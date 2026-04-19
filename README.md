# ⚡ MailFlash — Disposable Email Service

MailFlash is a modern, production-grade temporary email service built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**. It allows users to generate instant, anonymous email addresses to bypass registrations, avoid spam, and stay private online.

![MailFlash Banner](https://raw.githubusercontent.com/CodeWithVedang/MailFlash/main/legacy/screenshot/sc1.jpg) *(Note: Replace with updated v2 screenshot when available)*

## ✨ Key Features

- **🚀 Lightning Fast**: Instant email generation upon landing.
- **🎨 Modern UI/UX**: Premium dashboard design inspired by Linear and Superhuman.
- **🌗 Smart Theme**: Persistent Dark/Light mode with high-fidelity transitions.
- **📡 Auto-Polling**: Real-time inbox updates without manual refreshes.
- **🛡️ Smart Extraction**: Automatically detects and extracts **OTP codes** and **Activation links** from emails for one-click access.
- **📱 Fully Responsive**: Optimized for every device, from mobile to ultra-wide monitors.
- **💾 Persistent Session**: Your temporary email and inbox stay with you even after a page refresh.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with Persistence Middleware
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using OKLCH colors & Glassmorphism)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API**: [Mail.tm](https://mail.tm/)

## 📁 Architecture

The project follows a clean, modular architecture:

- `/src/api`: Centralized API service abstraction using Axios.
- `/src/components`: Reusable UI components and complex dashboard modules.
- `/src/hooks`: Custom hooks for Auth and Inbox lifecycle management.
- `/src/store`: State management domains (Mail, UI, Notifications).
- `/src/utils`: Utilities for text processing, OTP extraction, and date formatting.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/CodeWithVedang/MailFlash.git
   cd MailFlash
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

Developed with ❤️ by [CodeWithVedang](https://github.com/CodeWithVedang)
