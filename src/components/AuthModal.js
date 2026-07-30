"use client";

import { useState } from "react";
import Image from "next/image";

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // Admin Credentials Validation
    if (cleanEmail === "ad123@gmail.com") {
      if (password !== "ad123") {
        setError("Invalid password for Admin account.");
        return;
      }
    }

    const role = cleanEmail === "ad123@gmail.com" ? "admin" : "customer";
    const name = role === "admin" ? "Admin User" : email.split("@")[0];

    const userData = {
      email: cleanEmail,
      name,
      role,
    };

    onLogin(userData);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(6px)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "380px",
          padding: "28px 24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          position: "relative",
          border: "1px solid #e2e8f0"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "#f1f5f9",
            border: "none",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "22px" }}>
          <Image src="/images/90driplogo.png" alt="90DRIP" width={100} height={26} loading="lazy" style={{ height: "26px", width: "auto", marginBottom: "12px" }} />
          <h2 style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", margin: "0 0 4px", textTransform: "uppercase" }}>
            {isSignUp ? "Create Account" : "Sign In to 90Drip"}
          </h2>
          <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
            {isSignUp ? "Enter details to create your account" : "Enter your details to access your profile"}
          </p>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fee2e2", padding: "10px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: "700", marginBottom: "16px", textAlign: "center" }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "11px", fontWeight: "800", color: "#0f172a", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. ad123@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1.5px solid #cbd5e1",
                fontSize: "14px",
                fontWeight: "600",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: "800", color: "#0f172a", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1.5px solid #cbd5e1",
                fontSize: "14px",
                fontWeight: "600",
                outline: "none"
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background: "#0f172a",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "900",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginTop: "4px",
              boxShadow: "0 4px 14px rgba(15,23,42,0.25)"
            }}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {/* Toggle Sign Up / Sign In */}
        <div style={{ textAlign: "center", marginTop: "18px", fontSize: "12px", color: "#64748b" }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            style={{ background: "none", border: "none", color: "#2563eb", fontWeight: "800", cursor: "pointer", padding: 0 }}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
