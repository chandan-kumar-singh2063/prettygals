# Beauty E-commerce Store

A complete, functional beauty product e-commerce system built with Next.js 15, React 19, MongoDB, and integrated with Khalti payment gateway.

## ✨ Features

### 🔐 Authentication System
- Email/password registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes and API endpoints
- User profile management

### 🛒 Shopping Cart
- Add products to cart with quantity selection
- Real-time cart updates
- Persistent cart data
- Cart item management (update, remove)
- Order summary with tax and shipping calculations

### 💳 Payment Integration
- **Khalti Digital Wallet** integration
- Cash on Delivery (COD) option
- Secure payment processing
- Payment verification and order confirmation
- Order status tracking

### 🎨 Product Management
- Complete product catalog with categories
- Advanced filtering and search
- Product ratings and reviews
- Stock management
- Featured products section

### 🎯 User Experience
- Responsive design with Tailwind CSS
- Beautiful hover effects and animations
- Modern UI/UX design
- Mobile-friendly interface
- Loading states and error handling

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Payment**: Khalti Digital Wallet API
- **Icons**: Lucide React
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB database
- Khalti merchant account (for payment integration)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beauty-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/beauty-ecommerce
   
   # JWT Secret (change this in production)
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   
   # Khalti Payment Gateway (for production)
   KHALTI_SECRET_KEY=your-khalti-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 👤 Sample Login Credentials

After running the seed script, you can use these credentials:

### Admin Account
- **Email**: admin@beauty.com
- **Password**: admin123

### User Accounts
- **Email**: john@example.com
- **Password**: password123
- **Email**: jane@example.com
- **Password**: password123

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/           # Authentication endpoints
│   │   ├── cart/           # Cart management
│   │   ├── orders/         # Order processing
│   │   ├── payment/        # Khalti payment integration
│   │   └── products/       # Product catalog
│   ├── auth/               # Login/Register pages
│   ├── cart/               # Shopping cart page
│   ├── checkout/           # Checkout process
│   ├── payment/            # Payment success/failed pages
│   └── products/           # Product listing pages
├── components/
│   ├── layout/             # Navbar, Footer
│   └── products/           # Product cards
├── context/
│   ├── AuthContext.js      # Authentication state
│   └── CartContext.js      # Cart state management
├── lib/
│   ├── auth.js             # JWT authentication utilities
│   └── mongodb.js          # Database connection
└── models/
    ├── User.js             # User schema
    ├── Product.js          # Product schema
    ├── Cart.js             # Cart schema
    └── Order.js            # Order schema
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get products with filtering
- `GET /api/products/[id]` - Get single product

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order

### Payment
- `POST /api/payment/initiate` - Initiate Khalti payment
- `POST /api/payment/verify` - Verify payment status
- `GET /api/payment/verify` - Payment callback handler

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  address: Object,
  phone: String,
  isActive: Boolean,
  lastLogin: Date
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  brand: String,
  images: Array,
  stock: Number,
  rating: Object,
  isActive: Boolean
}
```

### Cart Model
```javascript
{
  user: ObjectId,
  items: [{
    product: ObjectId,
    quantity: Number,
    price: Number
  }],
  total: Number,
  itemCount: Number
}
```

### Order Model
```javascript
{
  user: ObjectId,
  items: Array,
  shippingAddress: Object,
  paymentMethod: String,
  paymentStatus: String,
  orderStatus: String,
  subtotal: Number,
  tax: Number,
  shipping: Number,
  total: Number
}
```

## 💳 Khalti Payment Integration

The system includes complete Khalti payment integration:

### Payment Flow
1. User selects Khalti payment method during checkout
2. System creates order and initiates Khalti payment
3. User is redirected to Khalti payment page
4. After payment, user is redirected back to success/failed page
5. System verifies payment and updates order status

### Environment Variables for Khalti
```env
KHALTI_SECRET_KEY=your-khalti-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## 🎨 UI Features

### Hover Effects
- Product cards with scale and shadow effects
- Image zoom on hover
- Overlay with action buttons (Add to Cart, View Details, Wishlist)
- Smooth transitions and animations

### Responsive Design
- Mobile-first approach
- Grid layouts that adapt to screen size
- Touch-friendly interface
- Optimized for all devices

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
1. Build the project: `npm run build`
2. Start production server: `npm start`
3. Set up environment variables
4. Configure MongoDB connection

## 🔧 Development

### Running in Development
```bash
npm run dev
```

### Database Seeding
```bash
npm run seed
```

### Building for Production
```bash
npm run build
npm start
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env.local

2. **Payment Integration Issues**
   - Verify KHALTI_SECRET_KEY is correct
   - Check NEXTAUTH_URL matches your domain

3. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT_SECRET in environment variables

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Note**: This is a complete, production-ready e-commerce system with full payment integration. Make sure to update environment variables and test thoroughly before deploying to production.
