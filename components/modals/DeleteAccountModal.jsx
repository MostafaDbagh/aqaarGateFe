"use client";
import React, { useState, useEffect, useMemo } from 'react';
import ConfirmationModal from './ConfirmationModal';

const DeleteAccountModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading = false,
  userRole = 'user' // 'user' or 'agent'
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const requiredText = 'delete my account';
  const isTextValid = useMemo(() => {
    return confirmationText.trim().toLowerCase() === requiredText;
  }, [confirmationText]);

  useEffect(() => {
    if (isOpen) {
      setConfirmationText('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (isTextValid && onConfirm) {
      onConfirm();
    }
  };

  const warningMessage = userRole === 'agent' 
    ? '⚠️ WARNING: Deleting your account will permanently delete all your property listings. This action cannot be undone. Please type "delete my account" to confirm.'
    : '⚠️ WARNING: Deleting your account is permanent and cannot be undone. Please type "delete my account" to confirm.';

  // Custom validation: button should be disabled if text doesn't match exactly
  const isButtonDisabled = loading || !isTextValid;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Delete My Account"
      message={warningMessage}
      confirmText="Delete My Account"
      cancelText="Cancel"
      confirmColor="#dc3545"
      loading={loading}
      showInput={true}
      inputType="text"
      inputLabel="Type 'delete my account' to confirm"
      inputPlaceholder="delete my account"
      inputValue={confirmationText}
      onInputChange={(value) => setConfirmationText(value)}
      inputRequired={true}
      customDisabled={isButtonDisabled}
      showValidationMessage={true}
      isValid={isTextValid}
      validationMessage={confirmationText && !isTextValid ? 'Text does not match. Please type exactly: "delete my account"' : ''}
    />
  );
};

export default DeleteAccountModal;

