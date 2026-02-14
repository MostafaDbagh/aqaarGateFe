"use client";

import React, { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { usePathname } from "next/navigation";
import { useSafeTranslations } from "@/hooks/useSafeTranslations";
import { authAPI } from "@/apis/auth";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import styles from "./OTPVerification.module.css";

const OTP_PENDING_KEY = "aqaar_otp_pending";

export default function OTPVerification({
  isOpen,
  onClose,
  onSuccess,
  userData,
  email,
  type = "signup",
}) {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";
  const isRTL = locale === "ar";

  const t = useSafeTranslations("otpVerification");
  const tRegistrationSuccess = useSafeTranslations("registrationSuccess");
  const { showSuccessModal, showWarningModal } = useGlobalModal();

  // --- State ---
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpTimer, setOtpTimer] = useState(300);
  const [isSendingOTP, setIsSendingOTP] = useState(false);

  const inputRefs = useRef([]);
  // Only one verify request per 6-digit value; reset when modal opens or OTP string changes (user corrected)
  const submittedOtpRef = useRef("");

  // --- Full reset every time modal opens (no error, no previous state) ---
  useEffect(() => {
    if (!isOpen) return;
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setIsLoading(false);
    setIsSendingOTP(false);
    setResendCooldown(300);
    setOtpTimer(300);
    submittedOtpRef.current = "";
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [isOpen]);

  // --- Resend cooldown ---
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // --- OTP expiry countdown ---
  useEffect(() => {
    if (!isOpen || otpTimer <= 0) return;
    const t = setTimeout(() => setOtpTimer((n) => Math.max(0, n - 1)), 1000);
    return () => clearTimeout(t);
  }, [isOpen, otpTimer]);

  const otpString = otp.join("");
  const allFilled = otpString.length === 6;

  // --- Single verify function: call API once per submit ---
  const runVerify = () => {
    if (!email || otpString.length !== 6 || isLoading) return;
    setIsLoading(true);
    setError("");

    authAPI
      .verifyOTP(email, otpString, type)
      .then((res) => {
        const verified = res?.success === true || res?.data?.success === true;
        if (!verified) {
          setError(t("invalidOTP"));
          submittedOtpRef.current = "";
          return;
        }
        setError("");
        try {
          sessionStorage.removeItem(OTP_PENDING_KEY);
          localStorage.removeItem(OTP_PENDING_KEY);
        } catch (_) {}
        if (type === "signup") {
          if (!userData) {
            setError(t("verificationFailed"));
            return;
          }
          flushSync(() => {
            onClose();
          });
          return authAPI.signup(userData).then(
            (signupRes) => {
              const ok = signupRes?.success === true || (signupRes?.user != null);
              if (ok) {
                showSuccessModal(
                  tRegistrationSuccess("title"),
                  tRegistrationSuccess("message"),
                  userData?.email,
                  true
                );
              } else {
                showWarningModal(
                  "Registration Failed",
                  signupRes?.message || "Registration failed. Please try again.",
                  userData?.email
                );
              }
            },
            (err) => {
              showWarningModal(
                "Registration Failed",
                err?.message || err?.response?.data?.message || "Registration failed. Please try again.",
                userData?.email
              );
            }
          );
        }
        if (type === "forgot_password") {
          onSuccess(otpString);
        }
      })
      .catch((err) => {
        submittedOtpRef.current = "";
        const msg =
          String(err?.message || err?.error || (typeof err === "string" ? err : "") || "");
        const lower = msg.toLowerCase();
        if (lower.includes("otp not found") || lower.includes("otp_not_found"))
          setError(t("otpNotFound"));
        else if (lower.includes("expired") || lower.includes("otp_expired"))
          setError(t("otpExpired"));
        else if (lower.includes("too many") || lower.includes("too_many"))
          setError(t("tooManyAttempts"));
        else if (lower.includes("invalid otp") || lower.includes("invalid_otp"))
          setError(t("invalidOTP"));
        else if (lower.includes("6 digits") || lower.includes("invalid_otp_format"))
          setError(t("invalidOTPFormat"));
        else setError(t("verificationFailed"));
      })
      .finally(() => setIsLoading(false));
  };

  // --- When 6 boxes are filled: call verify exactly once (no duplicate for same value) ---
  useEffect(() => {
    if (!isOpen || !email || !allFilled || isLoading) return;
    if (submittedOtpRef.current === otpString) return;
    submittedOtpRef.current = otpString;
    runVerify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, email, otpString, allFilled]);

  // --- Input handlers ---
  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setError("");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const digits = (e.clipboardData?.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");
    if (digits.length === 0) return;
    const next = [...otp];
    digits.forEach((d, i) => (next[i] = d));
    setOtp(next);
    setError("");
    submittedOtpRef.current = ""; // new value, allow verify
    const focusIdx = Math.min(digits.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResendCooldown(300);
    setOtpTimer(300);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    submittedOtpRef.current = "";
    setIsSendingOTP(true);
    try {
      await authAPI.sendOTP(email, type);
    } catch {
      setError(t("verificationFailed"));
    } finally {
      setIsSendingOTP(false);
    }
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allFilled || isLoading) return;
    runVerify();
  };

  if (!isOpen) return null;

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div
      className={styles.overlay}
      dir={isRTL ? "rtl" : "ltr"}
      onClick={(e) => e.target === e.currentTarget && e.stopPropagation()}
    >
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h4 className={styles.title}>
            {type === "forgot_password" ? t("titleForgotPassword") : t("title")}
          </h4>
          <span className={styles.closeIcon} onClick={onClose}>
            ×
          </span>
        </div>

        <div className={styles.emailSection}>
          <div className={styles.emailIcon}>📧</div>
          <p className={styles.emailText}>
            {type === "forgot_password" ? t("sentResetCode") : t("sentCode")}
          </p>
          <p className={styles.emailAddress}>{email}</p>
          <div className={styles.warningBox}>
            <p className={styles.warningText}>
              <span>⏰</span> {t("otpExpires")} — {formatTime(otpTimer)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.otpBlock}>
            <label className={styles.otpLabel}>{t("enterCode")}</label>
            <div className={styles.otpInputs}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className={styles.otpInput}
                  disabled={isLoading}
                />
              ))}
            </div>
            {error && <div className={styles.errorAlert}>{error}</div>}
          </div>

          <div className={styles.submitBlock}>
            <button
              type="submit"
              disabled={!allFilled || isLoading}
              className={`${styles.submitButton} ${
                allFilled && !isLoading ? styles.submitEnabled : styles.submitDisabled
              }`}
            >
              {type === "forgot_password"
                ? isLoading
                  ? t("verifying")
                  : t("verifyAndReset")
                : isLoading
                  ? t("verifying")
                  : t("verifyAndComplete")}
            </button>
          </div>

          <div className={styles.resendSection}>
            <p className={styles.resendText}>{t("didntReceive")}</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isSendingOTP}
              className={styles.resendButton}
            >
              {isSendingOTP ? t("resending") : t("resendCode")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
