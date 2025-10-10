# 🚀 Quick Start Guide

Get your e-commerce platform up and running in minutes!

## ⚡ One-Minute Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ecommerce-dashboard.git
cd ecommerce-dashboard

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and other secrets

# 4. Set up database
npm run db:push

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you're ready to go! 🎉

## 🔐 Default Admin Access

- **URL**: `/dashboard`
- **Email**: `client.store.info@gmail.com`
- **Password**: `123`

⚠️ **Change these credentials immediately in production!**

## 🌍 Language Support

- **Arabic**: [http://localhost:3000/ar](http://localhost:3000/ar)
- **English**: [http://localhost:3000/en](http://localhost:3000/en)

## 📱 Test Features

### Customer Features
1. Browse products on homepage
2. Add items to cart
3. Register/login with email or Google
4. Place test orders
5. View order history in account

### Admin Features
1. Go to `/dashboard`
2. Manage products and categories
3. View orders and customers
4. Upload images to gallery
5. Create discount coupons

## 🛠️ Essential Configuration

### Database (Required)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
```

### Authentication (Required)
```env
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Google OAuth (Optional)
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Image Upload (Optional)
```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## 🎯 Next Steps

1. **Customize**: Update branding and colors
2. **Products**: Add your product catalog
3. **Payment**: Integrate payment gateway
4. **Deploy**: Deploy to Vercel or your preferred platform

## 📚 Need Help?

- 📖 [Full Documentation](README.md)
- 🔧 [Deployment Guide](docs/GITHUB_DEPLOYMENT_GUIDE.md)
- 🛡️ [Security Guide](docs/SECURITY_GUIDE.md)
- 🧪 [Testing Guide](docs/TESTING_GUIDE.md)

Happy coding! 🚀