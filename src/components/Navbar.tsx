import React from 'react';
import { Icons } from './Icons';

interface NavbarProps {
  isUnlocked: boolean;
  onOpenUnlockModal: () => void;
  onLockAdmin: () => void;
  onOpenLookup: () => void;
  onOpenSettings: () => void;
  onNavigateHome: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isUnlocked,
  onOpenUnlockModal,
  onLockAdmin,
  onOpenLookup,
  onOpenSettings,
  onNavigateHome,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="portal-navbar">
      <div className="navbar-inner">
        {/* University Brand */}
        <div className="brand-section" onClick={onNavigateHome} title="Go to Portal Home">
          <div className="brand-crest">
            <img
              src="/logo.png"
              alt="Emerson University Logo"
              className="brand-logo-img"
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }}
            />
          </div>
          <div className="brand-info">
            <div className="brand-title">
              Emerson University Multan
              <span className="brand-badge">BS CS 7th EVE</span>
            </div>
            <div className="brand-subtitle">
              Session 2023-27 · Department of CS & IT
            </div>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="nav-actions">
          {/* Quick Student Lookup */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenLookup}
            title="Search student roll number attendance breakdown"
          >
            <Icons.Search size={15} />
            <span className="hide-mobile">Student Lookup</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            className="btn btn-ghost btn-icon btn-sm"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Icons.Sun size={17} /> : <Icons.Moon size={17} />}
          </button>

          {/* Settings / Backup */}
          <button
            type="button"
            className="btn btn-ghost btn-icon btn-sm"
            onClick={onOpenSettings}
            title="Settings & Data Backup"
            aria-label="Portal Settings"
          >
            <Icons.Settings size={17} />
          </button>

          {/* Master Admin Unlock Button */}
          {isUnlocked ? (
            <button
              type="button"
              className="admin-lock-btn unlocked"
              onClick={onLockAdmin}
              title="Admin Mode Unlocked - Click to Lock"
            >
              <Icons.Unlock size={16} />
              <span>Admin Active</span>
            </button>
          ) : (
            <button
              type="button"
              className="admin-lock-btn locked"
              onClick={onOpenUnlockModal}
              title="Enter Master Password to Mark/Edit Attendance"
            >
              <Icons.Lock size={16} />
              <span>🔒 Unlock Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
