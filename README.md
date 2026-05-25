# AbdulWaris Portfolio 🚀

A modern developer portfolio built with React, TypeScript, and Vite to showcase my projects, skills, and experience as a Full Stack Web Developer.

The portfolio highlights my work in:
- Full Stack Web Development
- Frontend Engineering
- Inventory Management Systems
- Offline-First Applications
- Responsive UI/UX
- Modern Web Technologies

---

## ✨ Features

- Responsive modern UI
- Smooth animations and transitions
- Project showcase section
- Skills & tech stack section
- Experience timeline
- Mobile-friendly design
- Fast development with Vite
- Clean and scalable component structure

---

## 🛠️ Tech Stack

- React.js
- TypeScript
- Vite
- Tailwind CSS
- JavaScript (ES6+)
- Responsive Design

---

## 📂 Project Structure

```bash
src/
 ├── components/
 ├── pages/
 ├── assets/
 ├── hooks/
 ├── styles/
 ├── App.tsx
 └── main.tsx
```

---

## ⚡ Getting Started

Clone the repository:

```bash
git clone https://github.com/wariswebdev/your-repo-name.git
```

Navigate into the project:

```bash
cd your-repo-name
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## 📦 Build for Production

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

---

## 🧹 ESLint Configuration

This project uses ESLint for maintaining clean and consistent code quality.

Example TypeScript-aware ESLint setup:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

React-specific linting can also be added using:

- eslint-plugin-react-x
- eslint-plugin-react-dom

---

## 🌐 Portfolio Goals

This portfolio was built to:
- Showcase real-world projects
- Highlight frontend & full stack skills
- Demonstrate responsive UI development
- Present scalable and clean application architecture
- Create a fast and modern developer experience

---

## 📫 Contact

- GitHub: https://github.com/wariswebdev
- LinkedIn: https://www.linkedin.com/in/abdul-waris-ghazi-83b134252/
- Email: a.warisghazi.work@gmail.com

---

## 📄 License

This project is open source and available under the MIT License.