# QR Analytics Platform - Frontend

A modern React frontend for the QR Analytics Platform, providing campaign analytics dashboards and admin management.

## 🎯 Features

### **Public Access (No Authentication)**
- **Campaign Dashboard**: `/dashboard/{campaignId}` - Real-time analytics
- **Privacy Policy**: `/privacy-policy` - GDPR compliance information

### **Admin Access (Authentication Required)**
- **Admin Login**: `/admin/login` - Email/password authentication
- **Admin Panel**: `/admin` - Campaign management and system overview

## 🏗️ Architecture

### **Dual Access Pattern**
```
PUBLIC ROUTES (No Login Required)
├── /dashboard/ABC123XYZ456    ← Client campaign analytics
└── /privacy-policy            ← GDPR compliance

ADMIN ROUTES (Login Required)
├── /admin/login              ← Admin authentication
└── /admin                    ← Campaign management
```

### **Technology Stack**
- **React 18** with modern hooks
- **React Router** for navigation
- **React Query** for API state management
- **Chart.js** for analytics visualization (as specified in requirements)
- **Tailwind CSS** + **Headless UI** for styling
- **Vite** for fast development builds

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update API URL in .env
VITE_API_URL=http://localhost:8000

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📊 Key Components

### **Public Dashboard** (`/dashboard/{campaignId}`)
- Real-time campaign analytics
- Chart.js visualizations (scans over time, device breakdown, geographic distribution)
- KPI cards (total scans, unique visitors, peak times)
- Excel export functionality
- Recent activity timeline

### **Admin Panel** (`/admin`)
- System-wide dashboard statistics
- Campaign list with management actions
- Create/archive campaigns
- Toggle client access controls
- QR code generation and download
- Copy dashboard links for sharing

### **Authentication**
- Admin-only JWT authentication
- Protected routes for admin areas
- Campaign ID-based access for clients (no login required)

## 🛡️ GDPR Compliance

### **Privacy-First Design**
- Anonymous data collection only
- City-level geolocation (no precise tracking)
- Automatic data anonymization after 30 days
- Comprehensive privacy policy page
- User rights support and contact information

## 🔌 API Integration

### **Service Layer**
- `publicAPI`: Campaign validation, stats, export (no auth)
- `adminAPI`: Authentication, campaign management (auth required)
- Automatic token management and error handling
- Loading states and error boundaries

## 🚀 Deployment

### **Environment Variables**
```bash
# Production API URL
VITE_API_URL=https://your-backend.up.railway.app
```

### **Build Commands**
```bash
# Build for production
npm run build

# Deploy to Railway/Vercel/Netlify
# Upload ./dist folder to static hosting
```

## 📈 Performance

- **Fast Loading**: Vite bundling with code splitting
- **Optimized Charts**: Chart.js with lazy loading
- **Responsive Design**: Mobile-first approach
- **Caching**: React Query for intelligent API caching

## 📂 Project Structure

```
src/
├── components/
│   ├── admin/          # Admin-specific components
│   ├── charts/         # Chart.js visualizations  
│   ├── ui/            # Reusable UI components
│   └── ProtectedRoute.jsx
├── hooks/
│   └── useAuth.js     # Admin authentication
├── pages/
│   ├── Dashboard.jsx   # Public campaign dashboard
│   ├── AdminLogin.jsx  # Admin authentication
│   ├── AdminPanel.jsx  # Admin management
│   └── PrivacyPolicy.jsx # GDPR compliance
├── services/
│   └── api.js         # API integration layer
├── App.jsx            # Main routing
└── main.jsx           # React entry point
```

## 🔍 Business Value

### **For Marketing Agencies**
- Professional client dashboards
- Comprehensive campaign management
- Real-time performance tracking
- Easy QR code generation and sharing

### **For Clients (Business Owners)**
- No-login campaign access via Campaign ID
- Real-time analytics and insights
- Excel export for offline analysis
- Mobile-friendly dashboard access

### **For End Users (Street Scanners)**
- Instant QR code redirects
- Complete privacy protection
- No tracking across campaigns
- GDPR-compliant data processing