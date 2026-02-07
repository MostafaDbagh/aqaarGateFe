"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useFileTranslations } from "@/hooks/useFileTranslations";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import styles from "./AuthChoiceModal.module.css";

export default function AuthChoiceModal({ isOpen, onClose }) {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";
  const isRTL = locale === "ar";
  const t = useFileTranslations("authChoice");
  const { showLoginModal, showRegisterModal } = useGlobalModal();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLoginClick = (e) => {
    e.preventDefault();
    onClose();
    setTimeout(() => showLoginModal(), 200);
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    onClose();
    setTimeout(() => showRegisterModal(), 200);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.content}
        dir={isRTL ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label={isRTL ? "إغلاق" : "Close"}
        >
          <i className="icon-plus" style={{ transform: "rotate(45deg)" }} />
        </button>

        <button
          type="button"
          className={styles.loginButton}
          onClick={handleLoginClick}
        >
          {t("login")}
        </button>

        <p className={styles.prompt}>
          {t("dontHaveAccount")}{" "}
          <button type="button" onClick={handleRegisterClick} className={styles.registerLink}>
            {t("register")}
          </button>
        </p>
      </div>
    </div>
  );
}
