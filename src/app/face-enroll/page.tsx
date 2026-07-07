"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, FaceStatusResponse } from "@/services/api";

export default function FaceEnrollPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [status, setStatus] = useState<FaceStatusResponse | null>(null);
  
  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [enrollMessage, setEnrollMessage] = useState("Initializing facial mapping...");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!api.auth.isAuthenticated()) {
      router.push("/auth");
      return;
    }
    loadFaceStatus();
  }, [router]);

  const loadFaceStatus = async () => {
    try {
      setLoading(true);
      const data = await api.face.getStatus();
      setStatus(data);
    } catch (err) {
      console.error("Failed to load face status", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError("");
      setSuccess(false);
    }
  };

  // Scanning messaging animations
  useEffect(() => {
    if (!enrolling) return;

    const messages = [
      "Detecting face boundary...",
      "Mapping 128 biometric facial landmarks...",
      "Generating master face mathematical vector...",
      "Storing encrypted vector in biometric vault...",
      "Verifying enrollment integrity...",
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < messages.length - 1) {
        currentIdx++;
        setEnrollMessage(messages[currentIdx]);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [enrolling]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please capture a face selfie photo first.");
      return;
    }

    try {
      setEnrolling(true);
      setError("");
      
      const res = await api.face.enroll(file);
      setStatus(res);
      setSuccess(true);
      setFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      setError(err.message || "Face enrollment failed. Please try again.");
    } finally {
      setEnrolling(false);
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

  if (enrolling) {
    return (
      <div className="screen-content flex-center scanning-screen">
        <div className="scanner-outer">
          <div className="scan-container">
            <div className="scan-line"></div>
            {previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Enrolling" className="scanning-img" />
            )}
          </div>
        </div>
        <div className="scanning-status float-anim">
          <div className="loading-dots">
            <span></span><span></span><span></span>
          </div>
          <p className="scan-status-text">{enrollMessage}</p>
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

  const isEnrolled = status?.enrolled;

  return (
    <div className="screen-content">
      <header className="page-header">
        <h2>Face biometrics</h2>
        <p>Manage your Face ID enrollment for selfie habit proofs.</p>
      </header>

      {/* Current Enrollment Status Card */}
      <div className="card glass status-indicator-card">
        <div className="flex-row-center">
          <div className="status-label-wrap">
            <span className={`status-dot ${isEnrolled ? "active" : "inactive"}`}></span>
            <h3>Biometric ID: {isEnrolled ? "Registered" : "Not Configured"}</h3>
          </div>
          <span className={`badge ${isEnrolled ? "badge-success" : "badge-warning"}`}>
            {isEnrolled ? "Enrolled" : "Setup Required"}
          </span>
        </div>

        {isEnrolled ? (
          <p className="status-desc">
            Your face profile was registered successfully on {status.enrollmentDate ? new Date(status.enrollmentDate).toLocaleDateString() : "recent date"}. 
            You can verify habits requiring photo checks.
          </p>
        ) : (
          <p className="status-desc">
            You must register your face biometrics before you can check in to any habits that require photo proofs.
          </p>
        )}
      </div>

      {success && (
        <div className="card success-banner">
          <div className="banner-icon">✓</div>
          <div>
            <h3>Enrollment Saved!</h3>
            <p>Your biometric Face ID signature has been recorded successfully.</p>
          </div>
        </div>
      )}

      {/* Face enrollment setup form */}
      <div className="card glass setup-card">
        <h3>{isEnrolled ? "Update Face Profile" : "Register Biometric ID"}</h3>
        <p style={{ fontSize: "13px" }}>
          To enroll, take a clear photo of your face. Make sure your face is well-lit, you look straight at the camera, and remove any sunglasses or masks.
        </p>

        <form onSubmit={handleSubmit} className="setup-form">
          {error && <div className="error-banner">{error}</div>}

          <div className="upload-container">
            {previewUrl ? (
              <div className="preview-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Biometric Preview" className="preview-image" />
                <button 
                  type="button" 
                  className="change-img-btn"
                  onClick={() => { setFile(null); setPreviewUrl(null); }}
                >
                  Discard Photo
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
                  <span className="dropzone-icon">👤</span>
                  <h3>Capture Face Selfie</h3>
                  <p>Tap to open front camera</p>
                </div>
              </label>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!file}
          >
            {isEnrolled ? "Overwrite Biometric ID" : "Register Biometrics"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .status-indicator-card {
          padding: 20px;
        }
        .status-label-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .status-dot.active {
          background: var(--success);
          box-shadow: 0 0 8px var(--success);
        }
        .status-dot.inactive {
          background: var(--warning);
          box-shadow: 0 0 8px var(--warning);
        }
        .status-desc {
          font-size: 13px;
        }
        .setup-card {
          padding: 20px;
          gap: 16px;
          margin-bottom: 40px;
        }
        .setup-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
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
          padding: 40px 16px;
          gap: 8px;
          text-align: center;
        }
        .dropzone-icon {
          font-size: 36px;
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
          aspect-ratio: 1;
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
        .success-banner {
          flex-direction: row;
          align-items: center;
          padding: 16px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.15);
          gap: 16px;
          text-align: left;
        }
        .banner-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--success);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
        }
        .success-banner h3 {
          font-size: 14px;
          color: var(--success);
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
