'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'beige' }}>
      {/* Header */}
      <header className="text-center py-12" style={{ backgroundColor: 'rgb(196, 115, 115)', color: 'white' }}>
        <h1 className="text-4xl font-bold mb-4">Contact PrettyGals</h1>
        <p className="text-xl">We'd love to hear from you!</p>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#d63384' }}>Get in Touch</h2>
              <p className="text-lg mb-8">
                Have a question about our products? Want to collaborate? Or just want to say hello? 
                We're here for you! Reach out through any of the methods below.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(196, 115, 115)' }}>
                  <span className="text-white text-xl">📍</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Address</h3>
                  <p className="text-gray-700">Koteshwor, Kathmandu, Nepal</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(196, 115, 115)' }}>
                  <span className="text-white text-xl">📞</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Phone</h3>
                  <p className="text-gray-700">+977 1-4567890</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(196, 115, 115)' }}>
                  <span className="text-white text-xl">✉️</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Email</h3>
                  <p className="text-gray-700">hello@prettygals.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(196, 115, 115)' }}>
                  <span className="text-white text-xl">🕒</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Business Hours</h3>
                  <p className="text-gray-700">Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-700">Sat - Sun: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-bold text-lg mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: 'rgb(196, 115, 115)' }}>
                  📘
                </a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: 'rgb(196, 115, 115)' }}>
                  📷
                </a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: 'rgb(196, 115, 115)' }}>
                  🐦
                </a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: 'rgb(196, 115, 115)' }}>
                  🎵
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#d63384' }}>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Jenny Jordan"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="jenny@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 text-white font-medium rounded-lg transition-colors"
                style={{ backgroundColor: 'rgba(158, 81, 81, 0.905)' }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(158, 81, 81, 1)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(158, 81, 81, 0.905)'}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-white" style={{ backgroundColor: 'burlywood' }}>
        <p>&copy; 2025 PrettyGals. All rights reserved.</p>
      </footer>
    </div>
  )
}
