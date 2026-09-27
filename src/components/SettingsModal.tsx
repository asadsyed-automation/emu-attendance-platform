import React, { useState } from 'react';
import { getMasterPassword, setMasterPassword, resetPortalData, saveStoredAttendance, downloadFile } from '../services/storage';
import type { CourseAttendance } from '../types/attendance';
import { Icons } from './Icons';

interface SettingsModalProps {
  isOpen: boolean;
  attendanceData: Record<string, CourseAttendance>;
  onClose: () => void;
  onDataUpdated: (newData: Record<string, CourseAttendance>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  attendanceData,
  onClose,
  onDataUpdated,
}) => {
  const [currentPass, setCurrentPass] = useState(getMasterPassword());
  const [newPass, setNewPass] = useState('');
  const [passMessage, setPassMessage] = useState('');

  if (!isOpen) return null;

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass.trim()) {
      alert('Password cannot be empty');
      return;
    }
    setMasterPassword(newPass.trim());
    setCurrentPass(newPass.trim());
    setNewPass('');
    setPassMessage('Master password updated successfully!');
    setTimeout(() => setPassMessage(''), 3000);
  };

  const handleExportBackup = () => {
    const jsonStr = JSON.stringify(attendanceData, null, 2);
    const fileName = `EMU_BSCS_7th_Attendance_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    downloadFile(jsonStr, fileName, 'application/json');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (typeof parsed === 'object' && parsed !== null) {
          saveStoredAttendance(parsed);
          onDataUpdated(parsed);
          alert('Attendance backup restored successfully!');
          onClose();
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all attendance records to the initial official sample dataset?')) {
      const reset = resetPortalData();
      onDataUpdated(reset);
      alert('Reset complete.');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: '520px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">
            <Icons.Settings size={20} style={{ color: 'var(--color-maroon-700)' }} />
            <span>Portal Settings & Data</span>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-icon btn-sm"
            onClick={onClose}
          >
            <Icons.X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Master Password Setting */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-card-subtle)',
              marginBottom: '1.25rem',
            }}
          >
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              🔒 Master Admin Password
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Current Password: <code>{currentPass}</code>
            </p>

            <form onSubmit={handleUpdatePassword} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Enter new password (e.g. emu2026)"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Save
              </button>
            </form>

            {passMessage && (
              <div style={{ color: '#16a34a', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 600 }}>
                {passMessage}
              </div>
            )}
          </div>

          {/* Backup & Restore */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              marginBottom: '1.25rem',
            }}
          >
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              💾 Database Backup & Restore
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Save attendance data to a JSON file to prevent accidental browser cache clear, or transfer between devices.
            </p>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleExportBackup}
              >
                <Icons.Download size={15} />
                <span>Export JSON Backup</span>
              </button>

              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                <Icons.Download size={15} style={{ transform: 'rotate(180deg)' }} />
                <span>Import JSON Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* Reset Portal Data */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #fca5a5',
              background: '#fef2f2',
            }}
          >
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#991b1b', marginBottom: '0.4rem' }}>
              ⚠️ Reset to Official Dataset
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#7f1d1d', marginBottom: '0.75rem' }}>
              Restore default 58-student roster and pre-seeded lectures.
            </p>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleResetData}
            >
              <Icons.RefreshCw size={14} />
              <span>Reset All Records</span>
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
