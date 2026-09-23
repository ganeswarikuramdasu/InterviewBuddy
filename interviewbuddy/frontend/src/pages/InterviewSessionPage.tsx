import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { interviewsApi } from "../api/interviews";
import type { InterviewSessionStart } from "../types";
import LoadingState from "../components/LoadingState";
import { getErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";
type MicStatus = "idle" | "listening" | "unsupported" | "denied" | "error";
type AnalyzerState = {
  active: boolean;
  videoOn: boolean;
  emotion: string | null;
  confidence: number | null;
  speechLevel: number;
  pace: string | null;
  recognitionOn: boolean;
  faceModelLoaded: boolean;
  micStatus: MicStatus;
};
const initState: AnalyzerState = {
  active: false,
  videoOn: false,
  emotion: null,
  confidence: null,
  speechLevel: 0,
  pace: null,
  recognitionOn: false,
  faceModelLoaded: false,
  micStatus: "idle",
};
const FACE_MODELS_URL =
  "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model";
const InterviewSessionPage: React.FC = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [session] = useState<InterviewSessionStart | undefined>(
    (location.state as any)?.session,
  );
  const [videoRequested] = useState<boolean>(
    Boolean((location.state as any)?.videoEnabled),
  );
  const [current, setCurrent] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [answered, setAnswered] = useState<Set<number>>(new Set());
  const [analyzer, setAnalyzer] = useState<AnalyzerState>(initState);
  const [micEnabled, setMicEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recognitionRef = useRef<any>(null);
  const speechDeniedRef = useRef(false);
  const animFrameRef = useRef<number>(0);
  const wordCountRef = useRef(0);
  const finalTranscriptRef = useRef("");
  const lastSpeechRef = useRef(Date.now());
  const paceRef = useRef<string | null>(null);
  const loadFaceApi = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const w = window as any;
      if (w.faceapi && w.faceapi.nets) return resolve(w.faceapi);
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/dist/face-api.js";
      script.onload = () => resolve(w.faceapi);
      script.onerror = () => reject(new Error("Failed to load face-api"));
      document.head.appendChild(script);
    });
  };
  const stopMedia = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    cancelAnimationFrame(animFrameRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
  };
  useEffect(() => {
    if (!videoRequested) return;
    setAnalyzer((a) => ({ ...a, active: true }));
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setAnalyzer((a) => ({ ...a, videoOn: true }));
        const AudioCtx =
          (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx: AudioContext = new AudioCtx();
          audioCtxRef.current = ctx;
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 512;
          analyserRef.current = analyser;
          const src = ctx.createMediaStreamSource(stream);
          src.connect(analyser);
        }
        try {
          const faceapi = await loadFaceApi();
          await faceapi.nets.ssdMobilenetv1.loadFromUri(FACE_MODELS_URL);
          await faceapi.nets.faceExpressionNet.loadFromUri(FACE_MODELS_URL);
          setAnalyzer((a) => ({ ...a, faceModelLoaded: true }));
        } catch {
          /* face analysis unavailable - continue without it */
        }
      } catch {
        /* media denied - continue text-only */
      }
    })();
    return stopMedia;
  }, [videoRequested]);
  // Speech-to-text lets users speak their answer. It is turned on by clicking
  // the microphone button (a user gesture that Chrome requires to reliably
  // prompt for permission) rather than auto-starting on page load, which can
  // silently fail and show "voice unavailable".
  const micSupported = (() => {
    const w = window as any;
    return !!(w.SpeechRecognition || w.webkitSpeechRecognition);
  })();
  useEffect(() => {
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    if (!micEnabled) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      recognitionRef.current = null;
      return;
    }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (event: any) => {
      let interim = "";
      let finalChunk = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalChunk += t;
        else interim += t;
      }
      if (finalChunk) {
        finalTranscriptRef.current +=
          (finalTranscriptRef.current &&
          !finalTranscriptRef.current.endsWith(" ")
            ? " "
            : "") + finalChunk;
        wordCountRef.current += finalChunk
          .trim()
          .split(/\s+/)
          .filter(Boolean).length;
      }
      const delta = Date.now() - lastSpeechRef.current;
      if (delta > 0)
        paceRef.current = `${Math.round((wordCountRef.current * 60000) / delta)}`;
      lastSpeechRef.current = Date.now();
      const base = finalTranscriptRef.current;
      setAnswerText(
        base +
          (interim ? (base && !base.endsWith(" ") ? " " : "") + interim : ""),
      );
    };
    rec.onerror = (e: any) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        speechDeniedRef.current = true;
        setAnalyzer((a) => ({ ...a, recognitionOn: false, micStatus: "denied" }));
        setMicEnabled(false);
      } else if (e.error === "no-speech" || e.error === "aborted") {
        // no-speech is expected if the user is quiet; keep listening
        setAnalyzer((a) => ({ ...a, recognitionOn: true, micStatus: "listening" }));
      } else {
        setAnalyzer((a) => ({ ...a, recognitionOn: false, micStatus: "error" }));
      }
    };
    rec.onend = () => {
      if (speechDeniedRef.current) return;
      // Chrome stops recognition after silence; restart it automatically while
      // the mic remains enabled unless an error/denial occurred.
      try {
        rec.start();
        setAnalyzer((a) => ({ ...a, recognitionOn: true, micStatus: "listening" }));
      } catch {}
    };
    speechDeniedRef.current = false;
    recognitionRef.current = rec;
    setAnalyzer((a) => ({ ...a, recognitionOn: true, micStatus: "listening" }));
    try {
      rec.start();
    } catch {
      speechDeniedRef.current = false;
      setAnalyzer((a) => ({ ...a, recognitionOn: false, micStatus: "error" }));
    }
    return () => {
      speechDeniedRef.current = true;
      try {
        rec.stop();
      } catch {}
      if (recognitionRef.current === rec) recognitionRef.current = null;
    };
  }, [micEnabled]);

  const toggleMic = () => {
    // Starting from a user gesture (button click) so Chrome prompts for the
    // microphone permission reliably.
    setMicEnabled((enabled) => (enabled ? false : true));
    if (!micEnabled) {
      setAnalyzer((a) => ({ ...a, micStatus: "idle" }));
    }
  };
  useEffect(() => {
    if (!analyserRef.current) return;
    const analyser = analyserRef.current;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((s, v) => s + v, 0) / data.length;
      const level = Math.round((avg / 255) * 100);
      setAnalyzer((a) => ({
        ...a,
        speechLevel: level,
        pace: paceRef.current
          ? Number(paceRef.current) > 130
            ? "Fast"
            : Number(paceRef.current) < 80
              ? "Slow"
              : "Good"
          : null,
      }));
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    const w = window as any;
    const detectFace = () => {
      if (videoRef.current && w.faceapi && w.faceapi.nets && analyser) {
        w.faceapi
          .detectSingleFace(
            videoRef.current,
            new w.faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }),
          )
          .withFaceExpressions()
          .then((res: any) => {
            if (res && res.expressions) {
              const entries = Object.entries(res.expressions);
              const top = entries.reduce((a: any, b: any) =>
                b[1] > a[1] ? b : a,
              );
              setAnalyzer((a) => ({
                ...a,
                emotion: top[0],
                confidence: Math.round(Number(top[1]) * 100),
              }));
            }
          })
          .catch(() => {})
          .finally(() => {
            const t = window.setTimeout(detectFace, 1500);
            (window as any).__faceTimer = t;
          });
      }
    };
    detectFace();
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if ((window as any).__faceTimer)
        clearTimeout((window as any).__faceTimer);
    };
  }, [analyzer.active]);
  if (!session) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        {" "}
        <p className="text-slate-600">
          This interview session has expired or was opened directly. Please
          start a new interview.
        </p>{" "}
        <button
          onClick={() => navigate("/interviews")}
          className="btn-primary mt-4"
        >
          Start New Interview
        </button>{" "}
      </div>
    );
  }
  const question = session.questions[current];
  const isLast = current === session.questions.length - 1;
  const submitAnswer = async () => {
    setSubmitting(true);
    try {
      await interviewsApi.answer(
        session.sessionId,
        question.answerId,
        answerText,
      );
      setAnswered((a) => new Set(a).add(question.answerId));
      setAnswerText("");
      wordCountRef.current = 0;
      finalTranscriptRef.current = "";
      lastSpeechRef.current = Date.now();
      if (isLast) {
        const result = await interviewsApi.finish(session.sessionId);
        navigate(`/interviews/${session.sessionId}/result`, {
          state: { result },
        });
      } else {
        setCurrent((c) => c + 1);
      }
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className={analyzer.active ? "max-w-5xl" : "max-w-2xl"}>
      {" "}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        {" "}
        <h1 className="text-lg font-bold text-slate-900">
          {session.role} &mdash; {session.interviewType} Interview
        </h1>{" "}
        <span className="text-sm text-slate-500">
          Question {current + 1} of {session.questions.length}
        </span>{" "}
      </div>{" "}
      <div className={analyzer.active ? "grid lg:grid-cols-3 gap-6" : ""}>
        {" "}
        {/* Main question panel */}{" "}
        <div className={analyzer.active ? "lg:col-span-2" : ""}>
          {" "}
          <div className="card p-6">
            {" "}
            <p className="text-base font-medium text-slate-900 mb-6">
              {question.questionText}
            </p>{" "}
            <textarea
              value={answerText}
              onChange={(e) => {
                setAnswerText(e.target.value);
                finalTranscriptRef.current = e.target.value;
              }}
              placeholder={
                micEnabled
                  ? "Speak your answer, or type here (speech-to-text is live)..."
                  : "Type your answer here (or click Mic to speak)..."
              }
              className="input h-40 resize-none"
            />{" "}
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex flex-col gap-1 text-xs text-slate-500">
                {micEnabled && analyzer.micStatus === "listening" && (
                  <span className="inline-flex items-center gap-1 text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />{" "}
                    Listening &mdash; speak your answer
                  </span>
                )}
                {!micSupported && (
                  <span className="text-amber-600">
                    Voice input is not supported in this browser. Please type
                    your answer.
                  </span>
                )}
                {micSupported && !micEnabled && (
                  <span className="text-slate-400">
                    Click the mic button to answer by voice.
                  </span>
                )}
                {micEnabled && analyzer.micStatus === "denied" && (
                  <span className="text-amber-600">
                    Microphone access is blocked. Allow the microphone in your
                    browser (or type your answer).
                  </span>
                )}
                {micEnabled && analyzer.micStatus === "error" && (
                  <span className="text-amber-600">
                    Voice input failed to start. Please type your answer.
                  </span>
                )}
                {micEnabled && analyzer.micStatus === "idle" && (
                  <span className="text-slate-400">
                    Starting voice input...
                  </span>
                )}
                {answered.has(question.answerId) && (
                  <span className="text-emerald-600 font-medium">
                    &#10003; Answered
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {micSupported && (
                  <button
                    type="button"
                    onClick={toggleMic}
                    disabled={analyzer.micStatus === "denied"}
                    title={
                      micEnabled
                        ? "Turn off voice input"
                        : "Turn on voice input"
                    }
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      micEnabled
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-slate-200 text-slate-600 hover:border-brand-400 hover:text-brand-600"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${micEnabled ? "bg-red-500 animate-pulse" : "bg-slate-300"}`}
                    />
                    {micEnabled ? "Stop Mic" : "Mic"}
                  </button>
                )}
                <button
                  onClick={submitAnswer}
                  disabled={submitting}
                  className="btn-primary"
                >
                  {" "}
                  {submitting
                    ? "Evaluating..."
                    : isLast
                      ? "Submit & Finish"
                      : "Submit & Next"}{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <p className="text-xs text-slate-400 mt-3 text-center">
            {" "}
            You can leave an answer blank and continue - unanswered questions
            score lowest.{" "}
          </p>{" "}
        </div>{" "}
        {/* Live analysis panel */}{" "}
        {analyzer.active && (
          <div className="space-y-4">
            {" "}
            <div className="card p-4">
              {" "}
              <div className="flex items-center justify-between mb-3">
                {" "}
                <span className="text-sm font-semibold text-slate-800">
                  Live Analysis
                </span>{" "}
                <button
                  onClick={() => {
                    setAnalyzer((a) => ({ ...a, videoOn: false }));
                    stopMedia();
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Stop
                </button>{" "}
              </div>{" "}
              <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden">
                {" "}
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />{" "}
                {!analyzer.videoOn && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                    Camera off
                  </div>
                )}{" "}
                {analyzer.faceModelLoaded && analyzer.emotion && (
                  <div className="absolute bottom-2 left-2 bg-slate-900/70 text-white text-xs px-2 py-1 rounded-lg">
                    {" "}
                    {analyzer.emotion}{" "}
                    {analyzer.confidence != null
                      ? `(${analyzer.confidence}%)`
                      : ""}{" "}
                  </div>
                )}{" "}
              </div>{" "}
              <div className="mt-4 space-y-3 text-sm">
                {" "}
                <div>
                  {" "}
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    {" "}
                    <span>Speech volume</span>{" "}
                    <span>{analyzer.speechLevel}%</span>{" "}
                  </div>{" "}
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    {" "}
                    <div
                      className="h-full bg-brand-500 transition-all"
                      style={{ width: `${analyzer.speechLevel}%` }}
                    />{" "}
                  </div>{" "}
                </div>{" "}
                <div className="flex justify-between text-xs">
                  {" "}
                  <span className="text-slate-500">Pacing</span>{" "}
                  <span className="font-medium">
                    {analyzer.pace ?? "-"}
                  </span>{" "}
                </div>{" "}
                <div className="flex justify-between text-xs">
                  {" "}
                  <span className="text-slate-500">Emotion</span>{" "}
                  <span className="font-medium capitalize">
                    {analyzer.emotion ?? "-"}
                  </span>{" "}
                </div>{" "}
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {" "}
                  All analysis happens locally in your browser. Your webcam and
                  microphone are never uploaded.{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
};
export default InterviewSessionPage;
