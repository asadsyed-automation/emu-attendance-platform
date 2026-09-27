# 🏛️ Emerson University Multan — BS CS 7th Evening Attendance Portal

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-10B981?style=flat)](https://web.dev/progressive-web-apps/)

An ultra-fast, mobile-first, zero-bloat Class Attendance Portal built specifically for **Emerson University Multan (EUM) — BS Computer Science, 7th Semester (Session 2023-27), Evening Shift**.

---

## 📋 University & Academic Information
- **Institution**: Emerson University Multan
- **Department**: Department of Computer Science & Information Technology
- **Programme**: BS Computer Science
- **Shift**: Evening Shift
- **Semester**: 7th Semester
- **Session**: 2023-27
- **Official Strength**: 58 Students

---

## 📚 7 Official Courses Registered
1. **Analysis of Algorithms** (`COSC-4113` · Cr: `3+0` · Teacher: *Qasim Niaz*)
2. **Compiler Construction** (`COSE-4135` · Cr: `2+1` · Teacher: *Ayesha BiBi*)
3. **Computer Graphics** (`COSE-4150` · Cr: `2+1` · Teacher: *Maryem Ismail*)
4. **Cyber Security (Theory)** (`COSE-4146` · Cr: `2+0` · Teacher: *Samra Mushtaq*)
5. **Cyber Security (Lab)** (`COSE-4146 (Lab)` · Cr: `0+1` · Teacher: *Samra Mushtaq*)
6. **Foreign Language** (`FLNG-41xx` · Cr: `3+0` · Teacher: *Faculty Assigned*)
7. **Translation of the Holy Quran-V** (`ARAB-4101` · Cr: `3+0` · Teacher: *Faculty Assigned*)

---

## ✨ Key Features

- 📱 **Mobile-First & PWA Ready**: Installable on phones as a standalone app, with smooth touch scrolling and responsive layouts.
- 📌 **Frozen/Sticky Mobile Columns**: `Sr.`, `Roll No.`, and `Student Name` remain permanently visible on the left during horizontal scrolling.
- 🔒 **Zero-Bloat Single Password**: Universal master password (`emu2026`) unlocks attendance marking and inline cell editing across all 7 subjects.
- 📅 **Manual Date Picker**: Add lectures for any date; defaults all 58 students to **Present (P)** for rapid 1-click absent marking.
- ⚡ **Interactive Inline Editing**: Direct click-to-toggle (`P` ↔ `A`) directly in the register grid when unlocked.
- 🖨️ **1-Click Official Print / PDF**: Formatted for standard A4 landscape matching physical university submission sheets with signature blocks.
- 📊 **Student Roll Lookup**: Students can look up their roll number to check cumulative attendance percentage and exam eligibility ($\ge 75\%$).
- 💾 **Data Persistence & Backups**: Instant local auto-saving with JSON database export/import and CSV spreadsheet download.

---

## 🚀 Quick Start Locally

```bash
# 1. Clone repository
git clone https://github.com/asadsyed-automation/emu-attendance-platform.git
cd emu-attendance-platform

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🌐 Deploying to Live (Free & Instant)

### Option 1: Vercel (Recommended - 60 Seconds)
1. Push this repository to your GitHub account.
2. Go to [vercel.com/new](https://vercel.com/new) and select `emu-attendance-platform`.
3. Click **Deploy**. Vercel will automatically build and assign a free live URL (e.g. `emu-attendance.vercel.app`).

### Option 2: Netlify
1. Go to [netlify.com](https://www.netlify.com/).
2. Drag and drop the `dist/` folder after running `npm run build`, or link your GitHub repo.
3. Build command: `npm run build`, Publish directory: `dist`.

---

## 👨‍💻 Project Structure
```
emu-attendance-platform/
├── public/
│   ├── favicon.svg
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── AttendanceTable.tsx       # Official Emerson physical sheet layout
│   │   ├── Confetti.ts              # Lightweight micro confetti
│   │   ├── CourseCard.tsx           # Home grid course card
│   │   ├── Icons.tsx                # Crisp standalone SVG icons
│   │   ├── MarkAttendanceModal.tsx  # Touch-friendly lecture marking
│   │   ├── Navbar.tsx               # Top branding, theme, & unlock controls
│   │   ├── PasswordModal.tsx        # Single universal password modal
│   │   ├── SettingsModal.tsx        # Password change & JSON backup/restore
│   │   └── StudentLookupModal.tsx   # Individual student 7-subject report card
│   ├── data/
│   │   └── initialData.ts           # 58-student roster & 7 official courses
│   ├── services/
│   │   └── storage.ts               # Local persistence, stats, & CSV exports
│   ├── types/
│   │   └── attendance.ts            # TypeScript interfaces
│   ├── App.tsx                      # Main application router
│   ├── index.css                    # Academic design system & print styles
│   └── main.tsx                     # Entry point
├── index.html
├── package.json
└── vite.config.ts
```
