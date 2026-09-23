# ============================================================
# InterviewBuddy — AWS Free-tier EC2 (Terraform)
#
# Provisions:
#   - A free-tier eligible t3.micro (or t2.micro) EC2 instance
#   - A security group opening 22 (SSH) and 80 (HTTP)
#   - An optional Elastic IP
#
# The instance's user-data runs deploy/aws/user-data.sh to install
# Docker and start the full docker-compose stack.
#
# Usage:
#   export TF_VAR_key_name="my-keypair"
#   export TF_VAR_git_repo="https://github.com/you/interviewbuddy.git"
#   terraform init && terraform plan && terraform apply
# ============================================================

terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "key_name" {
  type        = string
  description = "Name of an existing EC2 key pair (created in the AWS console)"
}

variable "git_repo" {
  type    = string
  default = ""
  description = "Git URL to clone the app on boot (leave empty to use S3 bundle)"
}

variable "git_branch" {
  type    = string
  default = "main"
}

variable "git_token" {
  type      = string
  default   = ""
  sensitive = true
}

variable "s3_bundle_url" {
  type    = string
  default = ""
  description = "s3://bucket/interviewbuddy.tar.gz alternative to git clone"
}

variable "db_host" {
  type        = string
  default     = ""
  description = "Supabase DB hostname only, e.g. db.<PROJECT-REF>.supabase.co"
}

variable "db_port" {
  type    = number
  default = 5432
}

variable "db_username" {
  type    = string
  default = "postgres"
}

variable "db_password" {
  type        = string
  default     = "change-me-now"
  sensitive   = true
  description = "Your Supabase database password"
}

variable "db_sslmode" {
  type    = string
  default = "require" # Supabase requires TLS
}

variable "jwt_secret" {
  type      = string
  default   = ""
  sensitive = true
}

variable "gemini_api_key" {
  type      = string
  default   = ""
  sensitive = true
}

variable "code_execution_service_url" {
  type    = string
  default = ""
}

variable "db_name" {
  type    = string
  default = "postgres"
}

variable "frontend_port" {
  type    = number
  default = 80
}

variable "mail_enabled" {
  type    = bool
  default = false
}

variable "brevo_api_key" {
  type      = string
  default   = ""
  sensitive = true
}

variable "brevo_base_url" {
  type    = string
  default = "https://api.brevo.com/v3"
}

variable "mail_from" {
  type    = string
  default = "noreply@interviewbuddy.com"
}

variable "mail_from_name" {
  type    = string
  default = "InterviewBuddy"
}

variable "app_frontend_url" {
  type        = string
  default     = ""
  description = "Public SPA URL used to build email verification links (defaults to http://localhost:<frontend_port>)"
}

variable "instance_type" {
  type    = string
  default = "t3.micro" # free tier
}

variable "allocate_eip" {
  type    = bool
  default = true
}

data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Render user-data from an env header (env.tftpl) prepended to the plain
# bash bootstrap (user-data.sh). Separating these keeps the bash script free
# of Terraform templating, so it also runs standalone from the AWS console.
locals {
  env_header = templatefile("${path.module}/env.tftpl", {
    git_repo                   = var.git_repo
    git_branch                 = var.git_branch
    git_token                  = var.git_token
    s3_bundle_url              = var.s3_bundle_url
    db_host                    = var.db_host
    db_port                    = var.db_port
    db_name                    = var.db_name
    db_username                = var.db_username
    db_password                = var.db_password
    db_sslmode                 = var.db_sslmode
    jwt_secret                 = var.jwt_secret
    gemini_api_key             = var.gemini_api_key
    code_execution_service_url = var.code_execution_service_url
    frontend_port              = var.frontend_port
    mail_enabled               = var.mail_enabled
    brevo_api_key              = var.brevo_api_key
    brevo_base_url             = var.brevo_base_url
    mail_from                  = var.mail_from
    mail_from_name             = var.mail_from_name
    app_frontend_url           = var.app_frontend_url
  })
  user_data = "${local.env_header}\n\n${file("${path.module}/../user-data.sh")}"
}

resource "aws_security_group" "interviewbuddy_sg" {
  name        = "interviewbuddy-sg"
  description = "SSH (22) + HTTP (80) for InterviewBuddy"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # restrict to your IP for SSH in production
  }
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_iam_role" "interviewbuddy_role" {
  name = "interviewbuddy-ec2"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

# Allow the instance to pull source from S3 (and Codedeploy logs later).
resource "aws_iam_role_policy" "interviewbuddy_policy" {
  name = "interviewbuddy-s3"
  role = aws_iam_role.interviewbuddy_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["s3:GetObject", "s3:ListBucket"]
        Resource = ["*"]
      }
    ]
  })
}

resource "aws_iam_instance_profile" "interviewbuddy_instance_profile" {
  name = "interviewbuddy-ec2-profile"
  role = aws_iam_role.interviewbuddy_role.name
}

resource "aws_instance" "interviewbuddy" {
  ami                    = data.aws_ami.al2023.id
  instance_type          = var.instance_type
  vpc_security_group_ids = [aws_security_group.interviewbuddy_sg.id]
  iam_instance_profile   = aws_iam_instance_profile.interviewbuddy_instance_profile.name
  key_name               = var.key_name

  root_block_device {
    volume_size = 20 # GiB (free tier offers 30 GiB gp2/gp3)
    volume_type = "gp3"
  }

  user_data = local.user_data
  user_data_replace_on_change = true

  tags = {
    Name = "interviewbuddy"
  }
}

resource "aws_eip" "interviewbuddy_eip" {
  count    = var.allocate_eip ? 1 : 0
  instance = aws_instance.interviewbuddy.id
  domain   = "vpc"
}

locals {
  public_ip = coalesce(
    var.allocate_eip ? join("", aws_eip.interviewbuddy_eip[*].public_ip) : "",
    aws_instance.interviewbuddy.public_ip
  )
}

output "instance_public_ip" {
  value = local.public_ip
}

output "app_url" {
  value = "http://${local.public_ip}"
}
