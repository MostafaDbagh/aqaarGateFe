import React from 'react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  confirmColor = "#dc3545",
  loading = false,
  showInput = false,
  inputPlaceholder = "",
  inputLabel = "",
  inputValue = "",
  onInputChange = null,
  inputRequired = false,
  inputType = "textarea", // "textarea" or "text"
  customDisabled = null, // Custom disabled state (overrides default)
  showValidationMessage = false, // Show custom validation message
  isValid = null, // Custom validation state
  validationMessage = "" // Custom validation message
}) => {
  const [inputVal, setInputVal] = React.useState(inputValue || "");
  
  React.useEffect(() => {
    if (isOpen) {
      setInputVal(inputValue || "");
    }
  }, [isOpen, inputValue]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (showInput && inputRequired && !inputVal.trim()) {
      return; // Don't proceed if input is required and empty
    }
    if (onInputChange) {
      onInputChange(inputVal);
    }
    if (onConfirm) {
      onConfirm(inputVal);
    }
  };

  // Check if confirm button should be disabled
  const isConfirmDisabled = customDisabled !== null 
    ? customDisabled 
    : (loading || (showInput && inputRequired && !inputVal.trim()));

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px'
      }}
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '0',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 30px 20px',
          borderBottom: '1px solid #f0f0f0',
          background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 6V10M10 14H10.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              color: '#dc3545',
              letterSpacing: '-0.02em'
            }}>
              {title}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div style={{
          padding: '24px 30px'
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: '8px',
            marginBottom: showInput ? '20px' : 0
          }}>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#9a3412',
              lineHeight: '1.6',
              fontWeight: '500'
            }}>
              {message}
            </p>
          </div>
          {showInput && (
            <div>
              {inputLabel && (
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333333'
                }}>
                  {inputLabel}
                  {inputRequired && <span style={{ color: '#dc3545' }}> *</span>}
                </label>
              )}
              {inputType === 'text' ? (
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    if (onInputChange) {
                      onInputChange(e.target.value);
                    }
                  }}
                  placeholder={inputPlaceholder}
                  required={inputRequired}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: `2px solid ${
                      showValidationMessage 
                        ? (isValid ? '#28a745' : (inputVal.trim() ? '#dc3545' : '#d1d5db'))
                        : (inputRequired && !inputVal.trim() ? '#dc3545' : '#d1d5db')
                    }`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#ffffff',
                    boxShadow: showValidationMessage && isValid 
                      ? '0 0 0 3px rgba(40, 167, 69, 0.1)' 
                      : 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = showValidationMessage && isValid ? '#28a745' : '#3b82f6';
                    e.target.style.boxShadow = showValidationMessage && isValid 
                      ? '0 0 0 3px rgba(40, 167, 69, 0.1)' 
                      : '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    const borderColor = showValidationMessage 
                      ? (isValid ? '#28a745' : (inputVal.trim() ? '#dc3545' : '#d1d5db'))
                      : (inputRequired && !inputVal.trim() ? '#dc3545' : '#d1d5db');
                    e.target.style.borderColor = borderColor;
                    e.target.style.boxShadow = showValidationMessage && isValid 
                      ? '0 0 0 3px rgba(40, 167, 69, 0.1)' 
                      : 'none';
                  }}
                />
              ) : (
                <textarea
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    if (onInputChange) {
                      onInputChange(e.target.value);
                    }
                  }}
                  placeholder={inputPlaceholder}
                  required={inputRequired}
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '10px 12px',
                    border: `1px solid ${inputRequired && !inputVal.trim() ? '#dc3545' : '#d1d5db'}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = inputRequired && !inputVal.trim() ? '#dc3545' : '#d1d5db';
                  }}
                />
              )}
              {/* Show validation message based on mode */}
              {showValidationMessage && (
                <>
                  {isValid && (
                    <p style={{
                      margin: '8px 0 0',
                      fontSize: '13px',
                      color: '#28a745',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: '500'
                    }}>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Text matches correctly
                    </p>
                  )}
                  {!isValid && inputVal.trim() && validationMessage && (
                    <p style={{
                      margin: '8px 0 0',
                      fontSize: '13px',
                      color: '#dc3545',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: '500'
                    }}>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8L8 12M8 8L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {validationMessage}
                    </p>
                  )}
                </>
              )}
              {!showValidationMessage && inputRequired && !inputVal.trim() && (
                <p style={{
                  margin: '8px 0 0',
                  fontSize: '13px',
                  color: '#dc3545',
                  fontWeight: '500'
                }}>
                  This field is required
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          padding: '20px 30px 24px',
          borderTop: '1px solid #f0f0f0',
          backgroundColor: '#fafafa',
          borderRadius: '0 0 12px 12px'
        }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              padding: '10px 20px',
              border: '1px solid #e1e5e9',
              borderRadius: '6px',
              background: '#ffffff',
              color: '#666666',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s ease',
              minWidth: '80px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#f8f9fa';
                e.target.style.borderColor = '#d1d5db';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#e1e5e9';
              }
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              background: isConfirmDisabled ? '#ccc' : confirmColor,
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isConfirmDisabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '120px',
              opacity: isConfirmDisabled ? 0.6 : 1,
              boxShadow: isConfirmDisabled ? 'none' : '0 2px 8px rgba(220, 53, 69, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading && confirmColor === '#dc3545') {
                e.target.style.backgroundColor = '#c82333';
              } else if (!loading && confirmColor === '#ff6b35') {
                e.target.style.backgroundColor = '#e55a2b';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = confirmColor;
              }
            }}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
