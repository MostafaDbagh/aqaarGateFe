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
  inputRequired = false
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
          borderBottom: '1px solid #f0f0f0'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#333333'
          }}>
            {title}
          </h3>
        </div>

        {/* Body */}
        <div style={{
          padding: '20px 30px'
        }}>
          <p style={{
            margin: 0,
            marginBottom: showInput ? '16px' : 0,
            fontSize: '14px',
            color: '#666666',
            lineHeight: '1.5'
          }}>
            {message}
          </p>
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
              {inputRequired && !inputVal.trim() && (
                <p style={{
                  margin: '4px 0 0',
                  fontSize: '12px',
                  color: '#dc3545'
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
          backgroundColor: '#fafafa'
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
            disabled={loading || (showInput && inputRequired && !inputVal.trim())}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              background: loading ? '#ccc' : confirmColor,
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '80px'
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
