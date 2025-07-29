import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please provide a product category'],
    enum: ['face', 'eyes', 'lips', 'blush', 'perfume'],
    lowercase: true
  },
  subcategory: {
    type: String,
    maxlength: [50, 'Subcategory cannot be more than 50 characters']
  },
  brand: {
    type: String,
    required: [true, 'Please provide a brand name'],
    maxlength: [50, 'Brand name cannot be more than 50 characters']
  },
  images: [{
    url: { type: String, required: true },
    alt: { type: String, default: '' }
  }],
  colors: [{
    name: String,
    hex: String,
    available: { type: Boolean, default: true }
  }],
  sizes: [{
    name: String,
    value: String,
    available: { type: Boolean, default: true }
  }],
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  tags: [String],
  seoTitle: String,
  seoDescription: String,
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  }
}, {
  timestamps: true
})

// Index for search functionality
ProductSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' })

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
