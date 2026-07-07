"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, HabitResponse, CheckInResponse } from "@/services/api";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [habits, setHabits] = useState<HabitResponse[]>([]);
  
  // Selection
  const [selectedHabitId, setSelectedHabitId] = useState<number | "">("");
  const [selectedHabit, setSelectedHabit] = useState<HabitResponse | null>(null);

  // Form inputs
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [scanMessage, setScanMessage] = useState("Initializing face scan...");

  // Results
  const [result, setResult] = useState<CheckInResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!api.auth.isAuthenticated()) {
      router.push("/auth");
      return;
    }
    loadHabits();
  }, [router]);

  const loadHabits = async () => {
    try {
      const data = await api.habits.list();
      const activeHabits = data.filter(h => h.status === "ACTIVE");
      setHabits(activeHabits);

      // Handle query parameter
      const queryId = searchParams.get("habitId");
      if (queryId) {
        const hId = parseInt(queryId);
        setSelectedHabitId(hId);
        const match = activeHabits.find(h => h.id === hId);
        if (match) setSelectedHabit(match);
      } else if (activeHabits.length > 0) {
        setSelectedHabitId(activeHabits[0].id);
        setSelectedHabit(activeHabits[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleHabitChange = (id: number) => {
    setSelectedHabitId(id);
    const match = habits.find(h => h.id === id);
    setSelectedHabit(match || null);
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError("");
    }
  };

  // Scanning messaging animations
  useEffect(() => {
    if (!submitting) return;

    const messages = [
      "Contacting biometric node network...",
      "Extracting facial keypoints...",
      "Comparing with enrolled face profile...",
      "Calculating match confidence score...",
      "Recording proof on timeline...",
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < messages.length - 1) {
        currentIdx++;
        setScanMessage(messages[currentIdx]);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [submitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHabitId) {
      setError("Please select a habit");
      return;
    }
    if (selectedHabit?.requiresSelfie && !file) {
      setError("Selfie photo proof is required for this habit.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setResult(null);
      
      const checkInRes = await api.checkins.create(Number(selectedHabitId), file, note);
      setResult(checkInRes);
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="screen-content flex-center" style={{ minHeight: "80vh" }}>
        <div className="spinner"></div>
        <style jsx>{`
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid var(--border);
            border-radius: 50%;
            border-top-color: var(--primary);
            animation: spin 1s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Verification Screen rendering modes
  if (submitting) {
    return (
      <div className="screen-content flex-center scanning-screen">
        <div className="scanner-outer">
          <div className="scan-container">
            <div className="scan-line"></div>
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Scanning" className="scanning-img" />
            ) : (
              <div className="scanning-icon">📷</div>
            )}
          </div>
        </div>
        <div className="scanning-status float-anim">
          <div className="loading-dots">
            <span></span><span></span><span></span>
          </div>
          <p className="scan-status-text">{scanMessage}</p>
        </div>

        <style jsx>{`
          .scanning-screen {
            min-height: 80vh;
            display: flex;
            flex-direction: column;
            gap: 32px;
          }
          .scanner-outer {
            width: 260px;
            height: 260px;
            border: 4px solid var(--border);
            border-radius: var(--radius-lg);
            padding: 8px;
            background: #141417;
            box-shadow: var(--shadow-glow);
          }
          .scan-container {
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
            border-radius: calc(var(--radius-lg) - 8px);
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .scanning-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.65;
          }
          .scanning-icon {
            font-size: 48px;
          }
          .scanning-status {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }
          .scan-status-text {
            color: #ffffff;
            font-weight: 600;
            font-size: 15px;
            letter-spacing: 0.2px;
          }
          .loading-dots {
            display: flex;
            gap: 6px;
          }
          .loading-dots span {
            width: 8px;
            height: 8px;
            background: var(--primary);
            border-radius: 50%;
            animation: bounce 1.2s infinite;
          }
          .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
          .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
        `}</style>
      </div>
    );
  }

  // Result screen
  if (result) {
    const isSuccess = result.verificationStatus === "VERIFIED";

    return (
      <div className="screen-content flex-center result-screen">
        <div className="card glass result-card">
          <div className="result-icon-wrapper flex-center">
            {isSuccess ? (
              <div className="result-icon success-glow">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            ) : (
              <div className="result-icon error-glow">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
            )}
          </div>

          <div className="result-header">
            <h2>{isSuccess ? "Proof Verified!" : "Verification Failed"}</h2>
            <p>{result.note || (isSuccess ? "Habit successfully checked-in" : "Face ID match score did not meet criteria")}</p>
          </div>

          <div className="result-body">
            <div className="detail-row flex-row-center">
              <span>Habit</span>
              <strong>{selectedHabit?.title}</strong>
            </div>
            {result.proofUrl && (
              <div className="detail-row flex-row-center">
                <span>Face Match Score</span>
                <strong className={isSuccess ? "text-success" : "text-error"}>
                  {Math.round(result.faceMatchScore * 100)}%
                </strong>
              </div>
            )}
            <div className="detail-row flex-row-center">
              <span>Status</span>
              <span className={`badge ${isSuccess ? "badge-success" : "badge-danger"}`}>
                {result.verificationStatus}
              </span>
            </div>
          </div>

          {isSuccess && selectedHabit && (
            <div className="streak-reward card">
              <span className="streak-reward-flame streak-flame">🔥</span>
              <div>
                <h3>Streak Upgraded!</h3>
                <p>You are now on a <strong>{selectedHabit.currentStreak + 1} day</strong> streak.</p>
              </div>
            </div>
          )}

          <button 
            className="btn btn-primary"
            onClick={() => router.push("/")}
          >
            Go to Dashboard
          </button>

          {!isSuccess && (
            <button 
              className="btn btn-secondary"
              onClick={() => setResult(null)}
            >
              Try Again
            </button>
          )}
        </div>

        <style jsx>{`
          .result-screen {
            min-height: 80vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .result-card {
            width: 100%;
            max-width: 380px;
            padding: 32px 24px;
            text-align: center;
            align-items: center;
            gap: 24px;
          }
          .result-icon-wrapper {
            margin-bottom: 8px;
          }
          .result-icon {
            width: 84px;
            height: 84px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .success-glow {
            background: var(--success);
            box-shadow: 0 0 24px rgba(16, 185, 129, 0.4);
          }
          .error-glow {
            background: var(--error);
            box-shadow: 0 0 24px rgba(239, 68, 68, 0.4);
          }
          .result-header h2 {
            font-size: 24px;
            color: #ffffff;
          }
          .result-body {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 12px;
            background: var(--bg-input);
            padding: 16px;
            border-radius: var(--radius-md);
            border: 1px solid var(--border);
          }
          .detail-row {
            font-size: 13px;
          }
          .detail-row span {
            color: var(--text-muted);
          }
          .detail-row strong {
            color: #ffffff;
          }
          .text-success { color: var(--success); }
          .text-error { color: var(--error); }
          .streak-reward {
            width: 100%;
            flex-direction: row;
            align-items: center;
            padding: 12px 16px;
            background: rgba(252, 82, 0, 0.08);
            border: 1px solid rgba(252, 82, 0, 0.15);
            text-align: left;
            gap: 14px;
          }
          .streak-reward-flame {
            font-size: 26px;
          }
          .streak-reward h3 {
            font-size: 14px;
            color: var(--primary);
          }
        `}</style>
      </div>
    );
  }

  // Form input screen
  return (
    <div className="screen-content">
      <header className="page-header">
        <h2>Submit Verification</h2>
        <p>Record your activity proof with secure biometric face validation.</p>
      </header>

      <form onSubmit={handleSubmit} className="verify-form card glass">
        {error && <div className="error-banner">{error}</div>}

        <div className="input-group">
          <label className="input-label">Select Habit</label>
          <select 
            className="input-field select-field"
            value={selectedHabitId}
            onChange={(e) => handleHabitChange(Number(e.target.value))}
            required
          >
            {habits.length === 0 ? (
              <option value="">No active habits found</option>
            ) : (
              habits.map(h => (
                <option key={h.id} value={h.id}>{h.title}</option>
              ))
            )}
          </select>
        </div>

        {selectedHabit?.requiresSelfie && (
          <div className="input-group">
            <label className="input-label">Capture Photo Proof</label>
            <div className="upload-container">
              {previewUrl ? (
                <div className="preview-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Proof Preview" className="preview-image" />
                  <button 
                    type="button" 
                    className="change-img-btn"
                    onClick={() => { setFile(null); setPreviewUrl(null); }}
                  >
                    Replace Photo
                  </button>
                </div>
              ) : (
                <label className="file-dropzone">
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="user" 
                    className="file-input"
                    onChange={handleFileChange}
                    required
                  />
                  <div className="dropzone-inner flex-center">
                    <span className="dropzone-icon">📷</span>
                    <h3>Take Selfie Photo</h3>
                    <p>Tap to open front camera</p>
                  </div>
                </label>
              )}
            </div>
          </div>
        )}

        <div className="input-group">
          <label className="input-label">Short Note (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Completed today's 5K! Felt amazing"
            className="input-field"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary submit-verify-btn"
          disabled={submitting}
        >
          {selectedHabit?.requiresSelfie ? "Submit Biometric Verification" : "Check-in Habit"}
        </button>
      </form>

      <style jsx>{`
        .verify-form {
          padding: 24px;
          gap: 22px;
          margin-bottom: 40px;
        }
        .select-field {
          appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 40px;
        }
        .upload-container {
          width: 100%;
        }
        .file-dropzone {
          display: block;
          width: 100%;
          border: 2px dashed var(--border);
          border-radius: var(--radius-md);
          background: var(--bg-input);
          cursor: pointer;
          transition: var(--transition);
        }
        .file-dropzone:hover {
          border-color: var(--primary);
          background: rgba(252, 82, 0, 0.02);
        }
        .dropzone-inner {
          flex-direction: column;
          padding: 32px 16px;
          gap: 8px;
          text-align: center;
        }
        .dropzone-icon {
          font-size: 32px;
        }
        .dropzone-inner h3 {
          font-size: 15px;
          color: #ffffff;
        }
        .file-input {
          display: none;
        }
        .preview-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #000;
        }
        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .change-img-btn {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 700;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition);
        }
        .change-img-btn:hover {
          background: #ffffff;
          color: #000000;
        }
        .submit-verify-btn {
          height: 48px;
          margin-top: 8px;
        }
        .error-banner {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: var(--error);
          padding: 12px;
          border-radius: var(--radius-md);
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="screen-content flex-center" style={{ minHeight: "80vh" }}>
        <div className="spinner"></div>
        <style jsx>{`
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid var(--border);
            border-radius: 50%;
            border-top-color: var(--primary);
            animation: spin 1s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
