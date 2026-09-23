# InterviewBuddy — AWS Deployment (Free Tier)

Deploy the whole stack (MySQL + backend + frontend) on **one free-tier
EC2 instance** using the Docker config already in the repo. Everything runs
inside the `docker-compose.yml` you already have.

> **Free-tier reality check:** the AWS 12-month free tier includes **one**
> `t2.micro`/`t3.micro` EC2 and (separately) one `db.t2/t3.micro` RDS, each up
> to 750 hours/month. You *can* run multiple AWS services, but only one
> instance of each eligible type is free. The instructions below stay on a
> single EC2 so it's fully free. Anything extra (bigger/extra instances, NAT
> gateway, Fargate, large EIP) can start billing you.

---

## Two ways to deploy

| Path | Tooling | Best for |
|---|---|---|
| **A. AWS Console** (recommended, no extra tools) | Browser only | Quickest to follow |
| **B. Terraform** (infrastructure-as-code) | `terraform` + `aws` CLI | Repeatable/reviewable deploys |

Both paths use the same bootstrap script
[`user-data.sh`](user-data.sh), which on first boot: installs Docker +
Compose, pulls the app source, writes `.env`, and runs
`docker compose up -d --build`.

---

## Path A — AWS Console (no local tools)

### 1. Get the code onto the instance

Choose one:

- **Via Git** (recommended): push this repo to GitHub (public, or private +
  a PAT). You'll paste the URL into user-data below.
- **Via S3**: create an S3 bucket, upload a tarball of the repo
  (`backend`, `frontend`, `database`, `docker-compose.yml`, `.env.example`)
  as `interviewbuddy.tar.gz`.

### 2. Create an SSH key pair

EC2 console → **Key Pairs** → *Create key pair* → name it (e.g. `interviewbuddy`)
→ download the `.pem`. You'll use it to SSH in.

### 3. Launch the instance

EC2 console → **Instances** → *Launch instance*:

- **Name:** `interviewbuddy`
- **AMI:** Amazon Linux 2023 (free tier eligible)
- **Instance type:** `t3.micro` (free tier) — or `t2.micro`
- **Key pair:** the one you created
- **Network settings → Edit:**
  - Create/keep a VPC and a subnet with *auto-assign public IP = enabled*
  - **Security group:** allow `SSH (22)` from your IP and `HTTP (80)` from `0.0.0.0/0`
- **Configure storage:** 20 GiB gp3 (free tier includes 30 GiB)
- **Advanced details → User data:** paste the contents of
  [`user-data.sh`](user-data.sh) (edit the two options at the top, see below)

In the user-data script, set your source:

```bash
# Option A — Git
GIT_REPO="https://github.com/<you>/interviewbuddy.git"   # required
GIT_TOKEN=""                                             # PAT if private
GIT_BRANCH="main"

# Option B — S3
S3_BUNDLE_URL="s3://<bucket>/interviewbuddy.tar.gz"
```

> The other `${...}` values (DB_PASSWORD, JWT_SECRET, GEMINI_API_KEY, ...) can
> be left as-is in the script, or set blank — secrets are read from your
> `.env`/environment later. At minimum, change `DB_PASSWORD` from
> `change-me-now`.

Launch. First boot takes a few minutes (installs Docker + builds images).

### 4. Grab a fixed public IP (optional, recommended)

EC2 → **Elastic IPs** → *Allocate* → associate with your instance. This keeps a
stable URL across restarts. (You get one free elastic IP.)

### 5. Verify

- Open http://<public-ip/elastic-ip> in a browser → the SPA should load.
- SSH in to watch the logs and run commands:

```bash
ssh -i interviewbuddy.pem ec2-user@<public-ip>
docker compose -f /opt/interviewbuddy/interviewbuddy/docker-compose.yml ps
docker compose logs -f backend frontend
```

> **Memory note:** building images (Maven + Vite) on a 1 GiB `t3.micro` works
> but can be slow. If it OOMs, either raise the instance size temporarily, or
> build/push images to ECR from your machine and reference them in compose.

### 6. Update after changes

```bash
ssh -i interviewbuddy.pem ec2-user@<public-ip>
cd /opt/interviewbuddy/interviewbuddy
git pull
docker compose up -d --build
```

---

## Path B — Terraform

Install `terraform` and the `aws` CLI, then:

```bash
cd deploy/aws/terraform

export TF_VAR_key_name="interviewbuddy"              # existing key pair name
export TF_VAR_git_repo="https://github.com/you/interviewbuddy.git"
export TF_VAR_git_token=""                           # PAT if private
export TF_VAR_db_password="a-strong-password"
export TF_VAR_jwt_secret="$(openssl rand -base64 48)"
# optional:
# export TF_VAR_gemini_api_key="..."
# export AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_REGION

terraform init
terraform plan
terraform apply -auto-approve
```

There are also `TF_VAR_s3_bundle_url` (use an S3 bundle instead of Git) and
`TF_VAR_instance_type` (default `t3.micro`). On success, Terraform prints
`app_url` — open it in a browser.

Tear down when done (avoids lingering free-tier costs):

```bash
terraform destroy
```

---

## HTTPS (optional)

The instance serves plain HTTP on port 80 by default — fine for a demo/MVP on
the free tier. For real HTTPS at no cost:

- **CloudFront + ACM (free TLS):** put a CloudFront distribution in front of
  the instance's public IP (or an ALB), attach a free ACM certificate, and set
  the origin to `http://<public-ip>`. No backend/nginx change needed because
  the SPA and API share one origin already.

Or, for a dedicated reverse proxy on the instance, run Caddy in front of the
frontend container and set `FRONTEND_PORT`. See `docs/deployment.md`.

---

## Cost / free-tier summary

| Item | Free-tier eligible? | Default in this setup |
|---|---|---|
| EC2 `t3.micro`/`t2.micro` | ✅ (750 h/mo, 12 mo) | Yes |
| 30 GiB gp3 root volume | ✅ | 20 GiB |
| Elastic IP (1, running) | ✅ | Yes |
| CloudFront + ACM | ✅ (free TLS) | Optional |
| Bigger instance / ECR / Fargate / NAT | ❌ | Not used |

**Always `terraform destroy` (or terminate the EC2) when you're done** so the
free tier isn't accidentally exhausted.
