import mongoose from 'mongoose'

const OrderNewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true
  },
  items: [{
    productId: {
      type: String,
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
      // Remove required: false and make it completely optional
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  shipping: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['khalti', 'cod', 'esewa', 'card']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  paymentDetails: {
    pidx: String,
    paymentUrl: String,
    khaltiTransactionId: String,
    paymentDate: Date,
    failureReason: String,
    verificationData: mongoose.Schema.Types.Mixed
  },
  shippingAddress: {
    name: String,
    phone: {
      type: String,
      required: true
    },
    email: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'Nepal'
    }
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'],
    default: 'pending'
  },
  deliveryDate: Date,
  notes: String,
  cancellationReason: String
}, {
  timestamps: true
})

// Generate order number
OrderNewSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'PG' + Date.now() + Math.floor(Math.random() * 1000)
  }
  next()
})

// Calculate item totals
OrderNewSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.items.forEach(item => {
      if (!item.total) {
        item.total = item.quantity * item.price
      }
    })
  }
  next()
})

// Add indexes for better performance
OrderNewSchema.index({ user: 1, createdAt: -1 })
OrderNewSchema.index({ orderNumber: 1 })
OrderNewSchema.index({ paymentStatus: 1 })
OrderNewSchema.index({ orderStatus: 1 })

// Export with proper cache handling
export default mongoose.models.Order || mongoose.model('Order', OrderNewSchema)
