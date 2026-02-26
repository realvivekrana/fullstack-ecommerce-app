'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Message sent successfully!')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">Get in Touch</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
          Have questions? We'd love to hear from you.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="card p-6 text-center">
            <Mail className="h-12 w-12 mx-auto text-primary-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Email Us</h3>
            <p className="text-gray-600 dark:text-gray-400">support@premiumstore.com</p>
          </div>

          <div className="card p-6 text-center">
            <Phone className="h-12 w-12 mx-auto text-primary-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Call Us</h3>
            <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
          </div>

          <div className="card p-6 text-center">
            <MapPin className="h-12 w-12 mx-auto text-primary-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Visit Us</h3>
            <p className="text-gray-600 dark:text-gray-400">123 Store St, City, State 12345</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="input-field resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button type="submit" className="w-full btn-primary">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
