# AI Agent Guide: coffee-recommender-app

Welcome! This file provides a comprehensive overview of the `coffee-recommender-app` frontend codebase, including the technology stack, project structure, build instructions, and guidelines to follow during development.

---

## 🛠️ Technology Stack & Dependencies

- **Bundler & Dev Server**: Vite (v8.0.0-beta.13)
- **Library**: React (v19.2.4) + React DOM (v19.2.4)
- **Routing**: React Router DOM (v7.13.1)
- **Icons**: Lucide React (v0.577.0)
- **Maps**: Leaflet (v1.9.4) & React Leaflet (v5.0.0)
- **Styling**: Vanilla CSS (defined globally in `src/style.css`)

---

## 📂 Directory & File Structure

```text
coffee-recommender-app/
├── public/                   # Static assets (images, icons)
├── src/                      # Source code
│   ├── api/                  # API communication layer
│   │   └── index.js          # Fetch functions for backend connection
│   ├── components/           # Reusable UI components
│   │   ├── Layout.jsx        # App layout wrapping Navbar, Footer, and Page Content
│   │   ├── Navbar.jsx        # Navigation bar
│   │   ├── ShopCard.jsx      # Individual coffee shop card component
│   │   └── ...
│   ├── pages/                # Page route views
│   │   ├── Home.jsx          # Homepage (featured recommendations)
│   │   ├── Search.jsx        # Shop search & advanced filters
│   │   ├── Detail.jsx        # Detailed shop view with Gallery/Carousel & Reviews
│   │   ├── Favorites.jsx     # User's bookmarked shops (saved locally)
│   │   ├── Suggest.jsx       # Shop suggestion form for users
│   │   ├── AdminSuggestions.py # Admin dashboard to approve/reject suggestions
│   │   ├── Login.jsx         # Admin login screen
│   │   └── MapPage.jsx       # Leaflet Map displaying Danang coffee shop pins
│   ├── utils/                # Utility helpers (time formatting, localStorage favorites)
│   ├── index.jsx             # React application entrypoint
│   ├── App.jsx               # Router configuration and layout wrapper
│   └── style.css             # Main stylesheet containing all project CSS
├── package.json              # NPM dependencies & scripts
├── index.html                # Vite entry HTML template
└── vite.config.js            # Vite configuration
```

---

## 🚀 How to Run & Build

1. **Install Dependencies**:
   Ensure you have Node.js (v18+) installed. Run the following inside the project root:
   ```bash
   npm install
   ```

2. **Start Local Development Server**:
   ```bash
   npm run dev
   ```
   - The app will be available locally at: `http://localhost:5173/`
   - It will automatically connect to the backend running at `http://localhost:8000` via fetch handlers.

3. **Build for Production**:
   Generate minimized static assets inside the `dist/` directory:
   ```bash
   npm run build
   ```

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 🚨 Critical Architectural Rules for AI Agents

> [!IMPORTANT]
> **Styling Conventions**: The project uses **Vanilla CSS** stored in `src/style.css`. Do NOT install utility styling libraries like TailwindCSS or CSS Modules unless explicitly requested. Try to reuse existing custom utility classes and design variables (e.g. `--color-primary`, `--color-accent`) to keep the design cohesive.

> [!WARNING]
> **API Connection**: The connection URL `API_BASE` is currently hardcoded in `src/api/index.js` as `http://localhost:8000/api`. Ensure the backend API server is running on port `8000` when testing features that fetch data.

> [!NOTE]
> **Client-Side Routing**: Routing is set up using `react-router-dom` in `src/App.jsx`. When linking to routes, always use the `<Link>` component from `react-router-dom` instead of standard anchor tags `<a>` to avoid full-page reloads (except for external URLs like Google Maps).

> [!TIP]
> **Interactive Features**: Keep client-side interactions fast and fluid. Use subtle CSS animations or micro-interactions (e.g. scaling buttons on hover) already established in `style.css`.
