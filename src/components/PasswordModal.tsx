import React, { useState } from 'react';
import { Icons } from './Icons';
import { verifyPassword } from '../services/storage';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPassword(password)) {
      setError(false);
      setPassword('');
      onSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">
            <Icons.Lock size={20} style={{ color: 'var(--color-maroon-700)' }} />
            <span>Unlock Teacher / CR Access</span>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-icon btn-sm"
            onClick={onClose}
          >
            <Icons.X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Enter the universal master password to unlock attendance marking and editing for all subjects.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-password-input">
                Master Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(false);
                  }}
                  autoFocus
                  style={{
                    paddingRight: '2.75rem',
                    borderColor: error ? '#ef4444' : undefined,
                  }}
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-icon"
                  style={{
                    position: 'absolute',
                    right: '4px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '0.4rem',
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
                </button>
              </div>

              {error && (
                <div
                  style={{
                    color: '#ef4444',
                    fontSize: '0.8rem',
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Icons.AlertTriangle size={14} />
                  <span>Incorrect password. Default is <code>emu2026</code></span>
                </div>
              )}
            </div>

            <div
              style={{
                background: 'var(--bg-card-subtle)',
                padding: '0.75rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                border: '1px solid var(--border-light)',
              }}
            >
              <Icons.Info size={16} style={{ color: 'var(--color-maroon-700)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Default Universal Password:</strong> <code>emu2026</code>.
                <br />
                Single password unlocks attendance marking across all 7 subjects.
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Icons.Unlock size={16} />
              <span>Unlock Admin Mode</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
