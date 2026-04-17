# 🚀 Jit Patel Web Development — Complete Website

**Owner:** Jit Patel  
**Phone:** +91 9687991925  
**Stack:** HTML5 · CSS3 · JavaScript · Node.js · Express.js · MySQL

---

## 📁 Project Structure

```
jitpatel-webdev/
├── frontend/
│   ├── index.html          ← Home Page
│   ├── services.html       ← Services Page
│   ├── portfolio.html      ← Portfolio Page
│   ├── contact.html        ← Contact Page
│   ├── css/
│   │   └── style.css       ← Full CSS (dark neon theme)
│   └── js/
│       ├── main.js         ← Core JS (cursor, canvas, scroll)
│       ├── portfolio.js    ← Filter + Modal
│       └── contact.js      ← Form validation + submission
└── backend/
    ├── server.js           ← Express API server
    ├── database.js         ← MySQL connection pool
    ├── schema.sql          ← MySQL schema
    ├── package.json        ← Dependencies
    └── .env                ← Environment variables (edit this!)
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+ — https://nodejs.org
- MySQL 8.0+ — https://dev.mysql.com/downloads/
- A code editor (VS Code recommended)
- VS Code **Live Server** extension (for frontend)

---

## 🗄️ Step 1 — Set Up MySQL Database

1. Open **MySQL Workbench** or your terminal MySQL client.
2. Run the schema file:

```sql
-- In MySQL Workbench: File → Open SQL Script → backend/schema.sql → Run
-- OR in terminal:
mysql -u root -p < backend/schema.sql
```

This creates:
- Database: `jitpatel_webdev`
- Table: `inquiries`

---

## ⚙️ Step 2 — Configure Backend

1. Open `backend/.env`
2. Update with your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=jitpatel_webdev
FRONTEND_ORIGIN=http://127.0.0.1:5500
```

---

## 🖥️ Step 3 — Start the Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies (first time only)
npm install

# Start development server (with auto-reload)
npm run dev

# OR start production server
npm start
```

You should see:
```
✅  MySQL connected successfully.
✅  Table "inquiries" ready.

╔══════════════════════════════════════╗
║   Jit Patel Web Dev — Backend API   ║
╠══════════════════════════════════════╣
║  Server: http://localhost:5000      ║
║  Health: http://localhost:5000/api/health ║
╚══════════════════════════════════════╝
```

---

## 🌐 Step 4 — Open the Frontend

**Method A: VS Code Live Server (Recommended)**
1. Open the `frontend/` folder in VS Code
2. Right-click `index.html` → **"Open with Live Server"**
3. The site opens at `http://127.0.0.1:5500`

**Method B: Direct file (limited)**
- Double-click `frontend/index.html` to open in browser
- Note: Form submission requires the backend to be running

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/contact` | Submit inquiry form |
| GET | `/api/inquiries` | View all inquiries (admin) |
| POST | `/api/inquiries/:id/status` | Update inquiry status |

### Test the API:
```bash
# Health check
curl http://localhost:5000/api/health

# Submit test inquiry
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","message":"Hello from the API!"}'

# View all inquiries
curl http://localhost:5000/api/inquiries
```

---

## 🎨 Features Delivered

### Design & UI
- ✅ Dark + Neon gradient cinematic theme
- ✅ Glassmorphism cards throughout
- ✅ Custom animated cursor (dot + ring)
- ✅ Animated particle network canvas (hero)
- ✅ Cinematic preloader with progress bar
- ✅ Scroll-triggered reveal animations
- ✅ Parallax hero effect
- ✅ Scrolling marquee ticker
- ✅ Animated stats counter
- ✅ Responsive navbar with smooth hamburger menu
- ✅ Sticky navbar (hides on scroll down, shows on scroll up)
- ✅ Rotating orbit animation
- ✅ Hover micro-interactions on all cards

### Pages
- ✅ **Home** — Hero, About, Process, CTA
- ✅ **Services** — 6 service cards + tech stack pills
- ✅ **Portfolio** — Filter system + project modal
- ✅ **Contact** — Info cards + validated inquiry form

### Backend
- ✅ Express.js REST API
- ✅ MySQL storage for inquiries
- ✅ Input validation (express-validator)
- ✅ Rate limiting (20 req/15 min)
- ✅ CORS protection
- ✅ Helmet.js security headers
- ✅ Auto database/table initialization
- ✅ Status management (new/read/replied)

### Performance & SEO
- ✅ Semantic HTML5 structure
- ✅ Meta tags (description, keywords, author)
- ✅ Optimized Google Fonts loading
- ✅ CSS custom properties for consistency
- ✅ Mobile-first responsive design
- ✅ Cross-browser compatible
- ✅ Passive scroll event listeners

---

## 📱 Responsive Breakpoints

| Device | Breakpoint |
|--------|-----------|
| Desktop | 1280px+ |
| Laptop | 1024px |
| Tablet | 768px |
| Mobile | 480px |

---

## 🚀 Production Deployment

### Frontend → Netlify / Vercel
1. Drag the `frontend/` folder to [Netlify Drop](https://app.netlify.com/drop)
2. Update `contact.js` API URL to your production backend URL

### Backend → Railway / Render / VPS
1. Push code to GitHub
2. Connect repo to [Railway.app](https://railway.app)
3. Add MySQL plugin
4. Set environment variables from `.env`
5. Deploy!

---

## 📞 Contact

**Jit Patel** — Lead Developer  
📞 **+91 9687991925**  
📍 Gujarat, India

---

*Built with ❤️ — Production-grade, cinematic, fully responsive.*
