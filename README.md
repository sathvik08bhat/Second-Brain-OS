# Second Brain OS

A comprehensive, all-in-one digital life management system and productivity dashboard built with React. Second Brain OS is designed to be your ultimate centralized hub for tracking, managing, and organizing every aspect of your life—from academics and career to fitness, mental health, and personal finances.

Featuring a cutting-edge, widget-driven UI (inspired by Neo-Brutalist and modern dashboard designs), the application uses robust local storage to maintain absolute privacy while keeping your data blazing fast and highly responsive.

---

## 🌟 Key Features

Second Brain OS goes far beyond standard note-taking. It includes dedicated modules managed by individualized `zustand` stores, ensuring performance and scalability across 15+ functional areas:

- **📊 Dashboard Hub**: A centralized command center summarizing all critical metrics from across the OS.
- **📚 Academics & Learning**: Track coursework, DSA progress, AI/ML study tracks, and unstructured learning journeys.
- **💼 Career & Placements**: A structured pipeline for job applications, internships, resume tracking, and interview prep.
- **💰 Personal Finance**: Budgeting, expense tracking, and financial goal visualization.
- **🧠 Mental Health & Wellness**: Mood tracking, daily journaling, and stress management tools.
- **💪 Fitness & Google Fit Integration**: Health tracking, workout logs, and historical data integration.
- **🎯 Task Management**: Global task tracking, reminders, and cross-module to-do integration.
- **🚀 Projects & Startup**: Idea cultivation, MVP tracking, and leadership growth pipelines.
- **🔒 Secure Vault**: A private, dedicated space for sensitive info and deep personal reflection (stored securely via local storage).
- **✈️ Travel & Hobbies**: Organize trips, bookmarked locations, and dedicated spaces for personal hobbies and clubs.

---

## 🛠️ Tech Stack

Built for maximum performance, clean developer ergonomics, and fluid user experiences:

**Frontend Framework**
- **React (v19)** powered by **Vite**
- **JavaScript / JSX** 
- **Zustand (v5)** - Blazing fast, modular state management (every module has its own dedicated store).
- **React Router DOM** - For seamless client-side routing across 20+ distinct views.

**UI, Animation & Visualization**
- **Vanilla CSS / Modern CSS Variables** - System-wide dark mode styling, glassmorphism, and responsive design natively built without heavy utility libraries.
- **Framer Motion** - Fluid micro-animations, page transitions, and interactive component states.
- **Recharts** - Dynamic, interactive data visualization (expenses, health trends, progress).
- **Lucide React** - Clean, modern iconography system.

**Infrastructure**
- LocalStorage Data Persistence
- Progressive Web App (PWA) configurable with registered service workers (`sw.js`).

---

## 📁 Project Structure

The project is highly modular. Every single life-category has its own dedicated sub-folder in `pages` and its own state controller in `store`.

```text
second-brain-os/
│
├── public/                 # Static assets, PWA manifest, service workers
│
├── src/
│   ├── assets/             # Images, fonts, and local assets
│   ├── components/         # Shared, reusable UI components (Cards, Modals, Navbar)
│   ├── pages/              # Individual module pages (Routing views)
│   │   ├── academics/
│   │   ├── finance/
│   │   ├── mental-health/
│   │   ├── vault/
│   │   └── ... (20+ specific views)
│   ├── store/              # Zustand global state managers
│   │   ├── financeStore.js
│   │   ├── taskStore.js
│   │   ├── globalStore.js
│   │   └── ... (19 individual stores)
│   ├── utils/              # Helper functions, formatters, and constants
│   ├── App.jsx             # Main Router and Global Layout wrapper
│   └── index.css           # Global CSS tokens, resets, and themes
│
├── package.json            # Scripts and Dependencies
└── vite.config.js          # Vite configurations
```

---

## 🚀 Installation & Setup

Want to run your own Second Brain OS locally? Follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/second-brain-os.git
   cd second-brain-os
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔐 Privacy & Security

**Your Data Stays With You.**
Currently, Second Brain OS operates entirely within your browser utilizing built-in LocalStorage. This means your private notes, financial data, and personal journals do not touch a remote backend.

While this ensures maximum privacy and offline accessibility, it means that clearing your browser cache will erase your data. 

**Future Security Enhancements Planned:**
- End-to-end encrypted cloud syncing.
- Multi-device syncing via an optional secure backend payload.
- Deeper secure-vault authentication mechanisms.

---

## 💡 Future Roadmap

- [ ] **PWA Enhancement:** Full offline support and mobile installability.
- [ ] **Cloud Sync:** Opt-in encrypted synchronization across devices.
- [ ] **AI Integration:** Integrating LLM APIs for automated tagging, summarization, and smart retrieval of notes.
- [ ] **Data Export:** Secure 1-click JSON/CSV backups of all OS data.
- [ ] **Graph View:** Obsidian-style node visualization connecting cross-module thoughts.

---

## 📄 License & Usage

Created as a comprehensive personal productivity and development project. 
Feel free to fork, expand, or customize the dashboard to fit your own personal operating system needs!
