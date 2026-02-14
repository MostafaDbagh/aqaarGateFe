"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import GlobalStatusModal from '../modals/GlobalStatusModal';
import Register from '../modals/Register';
import { usePathname } from 'next/navigation';
import { useFileTranslations } from '@/hooks/useFileTranslations';
import Login from '../modals/Login';
import AuthChoiceModal from '../modals/AuthChoiceModal';
import ForgotPasswordFlow from '../modals/ForgotPasswordFlow';
import OTPVerification from '../modals/OTPVerification';
import MakeMeAgentModal from '../modals/MakeMeAgentModal';
import logger from '@/utlis/logger';

const OTP_PENDING_KEY = 'aqaar_otp_pending';
const OTP_PENDING_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes

const GlobalModalContext = createContext();

export const useGlobalModal = () => {
  const context = useContext(GlobalModalContext);
  if (!context) {
    throw new Error('useGlobalModal must be used within a GlobalModalProvider');
  }
  return context;
};

export const GlobalModalProvider = ({ children }) => {
  const pathname = usePathname();
  
  // Extract locale from pathname
  const locale = pathname?.split('/')[1] || 'en';
  
  const tRegistrationSuccess = useFileTranslations('registrationSuccess');
  
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    userEmail: '',
    showLoginButton: false
  });
  
  const [registerModalState, setRegisterModalState] = useState({
    isOpen: false
  });
  
  const [loginModalState, setLoginModalState] = useState({
    isOpen: false
  });
  
  const [authChoiceModalState, setAuthChoiceModalState] = useState({
    isOpen: false
  });
  
  const [forgotPasswordModalState, setForgotPasswordModalState] = useState({
    isOpen: false
  });
  
  const [otpModalState, setOtpModalState] = useState({
    isOpen: false,
    userData: null,
    email: '',
    type: 'signup'
  });

  const [makeMeAgentModalState, setMakeMeAgentModalState] = useState({
    isOpen: false
  });

  // Restore OTP modal after page reload (e.g. user left to open Gmail and browser reloaded)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(OTP_PENDING_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      const { email, userData, type, ts } = data;
      if (!email || !ts) return;
      if (Date.now() - ts > OTP_PENDING_MAX_AGE_MS) {
        sessionStorage.removeItem(OTP_PENDING_KEY);
        localStorage.removeItem(OTP_PENDING_KEY);
        return;
      }
      setOtpModalState({
        isOpen: true,
        userData: userData || null,
        email,
        type: type || 'signup'
      });
    } catch (_) {}
  }, []);

  // When OTP modal is open but storage was cleared (e.g. verify succeeded), close the modal
  useEffect(() => {
    if (!otpModalState.isOpen) return;
    const check = () => {
      try {
        const hasSession = sessionStorage.getItem(OTP_PENDING_KEY);
        const hasLocal = localStorage.getItem(OTP_PENDING_KEY);
        if (!hasSession && !hasLocal) {
          setOtpModalState((prev) => (prev.isOpen ? { ...prev, isOpen: false, userData: null, email: '', type: 'signup' } : prev));
        }
      } catch (_) {}
    };
    const id = setInterval(check, 150);
    return () => clearInterval(id);
  }, [otpModalState.isOpen]);

  const showSuccessModal = (title, message, userEmail = '', showLoginButton = false) => {
    setModalState({
      isOpen: true,
      type: 'success',
      title,
      message,
      userEmail,
      showLoginButton
    });
  };

  const showWarningModal = (title, message, userEmail = '') => {
    setModalState({
      isOpen: true,
      type: 'warning',
      title,
      message,
      userEmail
    });
  };

  const closeModal = () => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const showRegisterModal = () => {
    setRegisterModalState({
      isOpen: true
    });
  };

  const closeRegisterModal = () => {
    setRegisterModalState({
      isOpen: false
    });
  };

  const showLoginModal = () => {
    setLoginModalState({
      isOpen: true
    });
  };

  const closeLoginModal = () => {
    setLoginModalState({
      isOpen: false
    });
  };

  const showAuthChoiceModal = () => {
    setAuthChoiceModalState({
      isOpen: true
    });
  };

  const closeAuthChoiceModal = () => {
    setAuthChoiceModalState({
      isOpen: false
    });
  };

  const showForgotPasswordModal = () => {
    setForgotPasswordModalState({
      isOpen: true
    });
  };

  const closeForgotPasswordModal = () => {
    setForgotPasswordModalState({
      isOpen: false
    });
  };

  const showOTPModal = useCallback((userData, email, type = 'signup') => {
    setOtpModalState({
      isOpen: true,
      userData,
      email,
      type
    });
    try {
      sessionStorage.setItem(OTP_PENDING_KEY, JSON.stringify({
        email,
        userData,
        type,
        ts: Date.now()
      }));
    } catch (e) {
      logger.warn('OTP persist failed', e);
    }
  }, []);

  // Clear both storages so restore never re-opens; then close with functional update
  const closeOTPModal = useCallback(() => {
    try {
      sessionStorage.removeItem(OTP_PENDING_KEY);
      localStorage.removeItem(OTP_PENDING_KEY);
    } catch (_) {}
    setOtpModalState((prev) => ({
      ...prev,
      isOpen: false,
      userData: null,
      email: '',
      type: 'signup'
    }));
  }, []);

  const showMakeMeAgentModal = () => {
    setMakeMeAgentModalState({
      isOpen: true
    });
  };

  const closeMakeMeAgentModal = () => {
    setMakeMeAgentModalState({
      isOpen: false
    });
  };

  const hideAllModals = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
    setRegisterModalState({ isOpen: false });
    setLoginModalState({ isOpen: false });
    setAuthChoiceModalState({ isOpen: false });
    setForgotPasswordModalState({ isOpen: false });
    try {
      sessionStorage.removeItem(OTP_PENDING_KEY);
      localStorage.removeItem(OTP_PENDING_KEY);
    } catch (_) {}
    setOtpModalState((prev) => ({
      ...prev,
      isOpen: false,
      userData: null,
      email: '',
      type: 'signup'
    }));
    setMakeMeAgentModalState({ isOpen: false });
  }, []);

  // Unified modal show function
  const showModal = (modalType) => {
    switch (modalType) {
      case 'register':
        showRegisterModal();
        break;
      case 'login':
        showLoginModal();
        break;
      case 'forgotPassword':
        showForgotPasswordModal();
        break;
      case 'becomeAgent':
        // Show a custom modal for becoming an agent
        showWarningModal(
          'Become an Agent',
          'You need to upgrade to an agent account to access this feature. Would you like to become an agent?',
          ''
        );
        break;
      default:
        logger.warn(`Unknown modal type: ${modalType}`);
    }
  };

  const value = {
    showSuccessModal,
    showWarningModal,
    closeModal,
    modalState,
    showRegisterModal,
    closeRegisterModal,
    registerModalState,
    showLoginModal,
    closeLoginModal,
    loginModalState,
    showAuthChoiceModal,
    closeAuthChoiceModal,
    authChoiceModalState,
    showForgotPasswordModal,
    closeForgotPasswordModal,
    forgotPasswordModalState,
    showOTPModal,
    closeOTPModal,
    otpModalState,
    showMakeMeAgentModal,
    closeMakeMeAgentModal,
    makeMeAgentModalState,
    showModal,
    hideAllModals
  };

  return (
    <GlobalModalContext.Provider value={value}>
      {children}
      <GlobalStatusModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        userEmail={modalState.userEmail}
        showLoginButton={modalState.showLoginButton}
      />
      <Register
        isOpen={registerModalState.isOpen}
        onClose={closeRegisterModal}
      />
      <Login
        isOpen={loginModalState.isOpen}
        onClose={closeLoginModal}
      />
      <AuthChoiceModal
        isOpen={authChoiceModalState.isOpen}
        onClose={closeAuthChoiceModal}
      />
      <ForgotPasswordFlow
        isOpen={forgotPasswordModalState.isOpen}
        onClose={closeForgotPasswordModal}
        onSuccess={() => {
          closeForgotPasswordModal();
          showLoginModal();
        }}
      />
      <OTPVerification
        isOpen={otpModalState.isOpen}
        onClose={closeOTPModal}
        onSuccess={(result) => {
          closeOTPModal();
          showSuccessModal(tRegistrationSuccess('title'), tRegistrationSuccess('message'));
        }}
        userData={otpModalState.userData}
        email={otpModalState.email}
        type={otpModalState.type}
      />
      <MakeMeAgentModal
        isOpen={makeMeAgentModalState.isOpen}
        onClose={closeMakeMeAgentModal}
      />
    </GlobalModalContext.Provider>
  );
};
