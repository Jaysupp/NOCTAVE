# 🌙 NOCTAVE

A modern dark productivity dashboard designed for focused night sessions. Built with performance, smooth animations, and minimal design in mind.

🔗 Live Site: https://noctave.netlify.app

---

## ✨ Overview

NOCTAVE is a sleek, dark-themed productivity dashboard built using Next.js App Router. It is designed to provide a distraction-free experience with smooth UI interactions, subtle animated backgrounds, and a modern glass-inspired interface.

The project emphasizes:

- ⚡ Performance-first design  
- 🎨 Minimal & modern UI  
- 🌊 Subtle animated wave background  
- 🧠 Focus-driven layout  
- 📱 Responsive design  

---

## 🚀 Tech Stack

- **Framework:** Next.js (App Router)  
- **Language:** TypeScript  
- **Styling:** CSS / Tailwind  
- **Font Optimization:** next/font  
- **Deployment:** Netlify  

---

## 📂 Project Structure

```bash
/app
├── page.tsx       # Main dashboard page
├── layout.tsx     # Root layout
└── globals.css    # Global styles

/public             # Static assets
```

---

## ⚙️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/noctave.git
cd noctave
```

### 2️⃣ Install dependencies

```bash
npm install
```

or

```bash
yarn install
```

or

```bash
pnpm install
```

### 3️⃣ Run development server

```bash
npm run dev
```

Open your browser:

👉 http://localhost:3000

The app will auto-reload when you edit `app/page.tsx`.

---

## 🎨 Features

### 🌊 Animated Wave Background

- Subtle GPU-accelerated motion  
- Optimized to avoid full-screen repaints  
- Respects prefers-reduced-motion  

### 📊 Dashboard Overview

- Focus time tracking  
- Task completion status  
- Productivity efficiency  
- Schedule breakdown  
- Quick review notes  

### 🧭 Sidebar Navigation

- Smooth transform-based animation  
- Performance-optimized toggle  
- Lightweight transitions  

### 🌙 Dark Mode Design

- Modern dark palette  
- High contrast typography  
- Clean glass-style cards  

---

## ⚡ Performance Optimizations

NOCTAVE is optimized to feel smooth and responsive:

- ✅ Transform-only animations (no layout thrashing)  
- ✅ No `transition: all`  
- ✅ Reduced shadow blur cost  
- ✅ CSS variables for theme switching  
- ✅ Minimized re-renders  
- ✅ Lightweight background animation  
- ✅ Mobile-friendly layout  

---

## 🛠 Customization

You can customize:

- Colors via CSS variables  
- Background animation intensity  
- Card shadow depth  
- Typography scaling  
- Dashboard widgets  

Main customization file:

```bash
app/globals.css
```

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

## 🌍 Deployment

The project is deployed on Netlify.

To deploy your own version:

1. Push your repository to GitHub  
2. Connect repository to Netlify  
3. Set build command:

```bash
npm run build
```

4. Set publish directory:

```bash
.next
```

---

## 🧠 Design Philosophy

NOCTAVE is built around:

- Minimal distraction  
- Night-focused productivity  
- Smooth interaction feedback  
- Performance over visual excess  
- Clean, modern UI language  

The goal is to create a dashboard that feels effortless to use.

---

## 📈 Future Improvements

- User authentication  
- Persistent task storage  
- Analytics insights  
- Custom themes  
- Performance mode toggle  
- Reduced motion mode toggle  

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository  
2. Create a new branch  
3. Make your changes  
4. Submit a pull request  

---

## 📄 License

MIT License

---

## 🌙 Built with focus. Designed for the night.
