# 🛒 E-Commerce Dashboard & Store

A modern, full-stack e-commerce platform built with Next.js 15, featuring a comprehensive admin dashboard and a beautiful storefront with full Arabic and English support.

## ✨ Features

### 🏪 **Storefront**
- **Multi-language Support**: Full Arabic (RTL) and English (LTL) support
- **Product Catalog**: Browse products with advanced filtering and search
- **Shopping Cart**: Add/remove items with real-time updates
- **User Authentication**: Login/Register with Google OAuth and email/password
- **Order Management**: Place orders and track order history
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 🎛️ **Admin Dashboard**
- **Product Management**: Create, edit, delete products with multiple images
- **Category Management**: Organize products into categories
- **Order Management**: View and manage customer orders
- **User Management**: Manage user accounts and roles
- **Coupon System**: Create and manage discount coupons
- **Gallery Management**: Upload and manage images with Cloudinary
- **Analytics**: View sales and user statistics

### 🔐 **Authentication & Security**
- **Hybrid Auth System**: NextAuth.js + Custom authentication
- **Google OAuth**: Sign in with Google account
- **Role-based Access**: Super Admin and Viewer roles
- **Password Management**: Change password functionality
- **Session Management**: Secure JWT-based sessions

### 🎨 **UI/UX**
- **Modern Design**: Built with Tailwind CSS and shadcn/ui
- **Dark/Light Mode**: Theme switching support
- **Responsive Layout**: Mobile-first design approach
- **Smooth Animations**: Framer Motion animations
- **Accessibility**: WCAG compliant components

## 🚀 Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Framer Motion** - Smooth animations
- **Zustand** - State management

### **Backend**
- **Next.js API Routes** - Server-side API
- **NextAuth.js** - Authentication solution
- **Drizzle ORM** - Type-safe database ORM
- **PostgreSQL** - Primary database
- **Server Actions** - Server-side form handling

### **Services**
- **Cloudinary** - Image upload and management
- **Google OAuth** - Social authentication
- **Vercel** - Deployment platform

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ecommerce-dashboard.git
cd ecommerce-dashboard
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="your_postgresql_connection_string"

# NextAuth
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your_upload_preset"

# Admin Credentials
SUPER_ADMIN_EMAIL="admin@example.com"
SUPER_ADMIN_PASSWORD="your_admin_password"
```

### 4. Database Setup
```bash
# Generate database schema
npm run db:generate

# Push schema to database
npm run db:push
```

### 5. Run the development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗃️ Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - User accounts and authentication
- **products** - Product catalog with multilingual support
- **categories** - Product categories
- **orders** - Customer orders
- **order_items** - Order line items
- **cart** - Shopping cart
- **cart_items** - Cart items
- **coupons** - Discount coupons
- **reviews** - Product reviews
- **gallery_images** - Image management

## 🎯 Usage

### **Admin Access**
1. Navigate to `/dashboard`
2. Login with admin credentials
3. Access all management features

### **Customer Experience**
1. Browse products on the homepage
2. Add items to cart
3. Register/Login to place orders
4. Track orders in account page

### **Multi-language**
- **Arabic**: `/ar/` - Right-to-left layout
- **English**: `/en/` - Left-to-right layout

## 🛠️ Development

### **Project Structure**
```
├── app/                    # Next.js App Router
│   ├── [lang]/            # Internationalization
│   │   ├── (auth)/        # Authentication pages
│   │   ├── (dashboard)/   # Admin dashboard
│   │   └── (site)/        # Public storefront
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Layout components
│   └── shadcnUI/         # UI components
├── lib/                  # Utilities and configurations
│   ├── actions/          # Server actions
│   ├── auth/             # Authentication config
│   ├── db/               # Database schema and config
│   ├── i18n/             # Internationalization
│   └── stores/           # State management
├── docs/                 # Documentation
└── types/                # TypeScript type definitions
```

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate database schema
npm run db:push      # Push schema to database
```

## 🌐 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Manual Deployment**
```bash
npm run build
npm run start
```

## 🔧 Configuration

### **Google OAuth Setup**
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs

### **Cloudinary Setup**
1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret
3. Create an upload preset for image uploads

## 📚 Documentation

Detailed documentation is available in the `/docs` folder:

### **Code Quality & Best Practices:**
- [Phase 1 Improvements](docs/PHASE_1_IMPROVEMENTS.md) - ✨ Environment validation, Logger, Dependencies cleanup
- [Phase 2 Improvements](docs/PHASE_2_IMPROVEMENTS.md) - ✨ Rate Limiting, Error Handling, Tailwind Config
- [Error Pages Guide](docs/ERROR_PAGES_GUIDE.md) - ✨ Professional 404 & Error pages
- [Skeleton Loaders Guide](docs/SKELETON_GUIDE.md) - ✨ NEW: Professional loading states
- [API Examples](lib/api/EXAMPLE_API_ROUTE.md) - Complete API route examples with best practices
- [Migration Guide](docs/MIGRATION_GUIDE.md) - How to migrate to new systems

### **System Guides:**
- [Authentication System Guide](docs/AUTH_SYSTEM_REVIEW.md)
- [Account Integration Guide](docs/ACCOUNT_INTEGRATION_GUIDE.md)
- [Security Guide](docs/SECURITY_GUIDE.md)
- [Testing Guide](docs/TESTING_GUIDE.md)
- [New Features Guide](docs/NEW_FEATURES_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Cloudinary](https://cloudinary.com/) - Image management

## 📞 Support

If you have any questions or need help, please:
1. Check the documentation in `/docs`
2. Open an issue on GitHub
3. Contact the development team

---

**Built with ❤️ using Next.js and TypeScript**