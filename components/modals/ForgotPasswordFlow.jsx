"use client";
import React, { useState, useEffect } from "react";
import ForgotPassword from "./ForgotPassword";
import OTPVerification from "./OTPVerification";
import NewPassword from "./NewPassword";
import PasswordResetSuccess from "./PasswordResetSuccess";
import PasswordResetError from "./PasswordResetError";
import { authAPI } from "@/apis/auth";
import logger from "@/utlis/logger";

export default function ForgotPasswordFlow({ isOpen, onClose, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success, 5: Error
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Reset flow when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Reset all state when modal closes
      setCurrentStep(1);
      setEmail("");
      setOtpCode("");
      setErrorMessage("");
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle email submission
  const handleEmailSubmit = async (userEmail) => {
    try {
      // Call send OTP API with type 'forgot_password'
      await authAPI.sendOTP(userEmail, 'forgot_password');
      
      setEmail(userEmail);
      setCurrentStep(2); // Move to OTP verification
      
      logger.debug("📧 Reset code sent to:", userEmail);
    } catch (error) {
      throw new Error("Failed to send reset code. Please try again.");
    }
  };

  // Handle OTP verification success
  const handleOTPSuccess = (otpCode) => {
    logger.debug("🔄 handleOTPSuccess called, moving to step 3");
    setOtpCode(otpCode); // Store the verified OTP
    setCurrentStep(3); // Move to new password
    logger.debug("✅ OTP verified successfully, currentStep should be 3");
  };

  // Handle password reset
  const handlePasswordReset = async (newPassword) => {
    if (!email) {
      logger.error("❌ Password reset failed: No email available");
      setErrorMessage("Email not found. Please start the process again.");
      setCurrentStep(5);
      return;
    }
    
    try {
      logger.debug("🔄 Starting password reset for:", email);
      
      // Validate password before sending
      if (!newPassword || newPassword.trim().length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
        setCurrentStep(5);
        return;
      }
      
      // Call API to reset password
      const response = await authAPI.resetPassword(email, newPassword);
      
      logger.debug("✅ Password reset response:", response);
      
      // Check if the response indicates success
      if (response && response.success) {
        logger.debug("✅ Password reset successfully for:", email);
        logger.debug("🔄 Setting currentStep to 4 (success modal)");
        
        // Move to success step
        setCurrentStep(4);
        setErrorMessage(""); // Clear any previous errors
        
        logger.debug("✅ currentStep should now be 4");
      } else {
        // Handle unsuccessful response
        const message = response?.message || "Failed to reset password. Please try again.";
        logger.error("❌ Password reset failed:", message);
        setErrorMessage(message);
        setCurrentStep(5); // Show error modal
      }
    } catch (error) {
      logger.error("❌ Password reset failed:", error);
      
      // Extract error message from different error formats
      let errorMsg = "Failed to reset password. Please try again.";
      
      if (error?.message) {
        errorMsg = error.message;
      } else if (typeof error === 'string') {
        errorMsg = error;
      } else if (error?.error) {
        errorMsg = error.error;
      } else if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMsg = error.response.data.error;
      }
      
      setErrorMessage(errorMsg);
      setCurrentStep(5); // Show error modal
      
      // Don't re-throw - we're handling the error with the error modal
    }
  };

  // Handle login button click in success modal
  const handleSuccessLogin = () => {
    // Close the forgot password flow
    handleFlowClose();
    
    // Call the parent onSuccess callback to trigger login modal
    if (onSuccess) {
      onSuccess();
    }
  };

  // Handle retry from error modal
  const handleRetry = () => {
    // Go back to password entry step
    setCurrentStep(3);
    setErrorMessage("");
  };

  // Reset flow and close all modals
  const handleFlowClose = () => {
    setCurrentStep(1);
    setEmail("");
    setOtpCode("");
    setErrorMessage("");
    onClose();
  };


  return (
    <>
      <ForgotPassword
        isOpen={isOpen && currentStep === 1}
        onClose={handleFlowClose}
        onSubmit={handleEmailSubmit}
      />

      <OTPVerification
        isOpen={isOpen && currentStep === 2}
        onClose={handleFlowClose}
        onSuccess={handleOTPSuccess}
        email={email}
        type="forgot_password"
      />

      <NewPassword
        isOpen={isOpen && currentStep === 3}
        onClose={handleFlowClose}
        onSubmit={handlePasswordReset}
      />

      <PasswordResetSuccess
        isOpen={isOpen && currentStep === 4}
        onClose={handleFlowClose}
        onLogin={handleSuccessLogin}
      />

      <PasswordResetError
        isOpen={isOpen && currentStep === 5}
        onClose={handleFlowClose}
        onRetry={handleRetry}
        errorMessage={errorMessage}
      />
    </>
  );
}

