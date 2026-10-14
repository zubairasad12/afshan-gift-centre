'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building2,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { CONTACT_PHONE, CONTACT_PHONE_FORMATTED, CONTACT_EMAIL, ADDRESS, LOCATION } from '@/lib/constants';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setStatusMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setStatusMessage(data.message || 'Your inquiry has been sent successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'General Inquiry',
          message: '',
        });
      } else {
        setStatus('error');
        setStatusMessage(data.error || 'Failed to send message. Please call us directly.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setStatusMessage('Network connection error. Please call us at 0300 1005861.');
    }
  };

  return (
    <div className="bg-[#FAFAF7] text-[#3D3229]">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#F5F0EB] to-[#FAFAF7] py-14 sm:py-20 border-b border-[#DDD1C2]/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B8956A]/10 text-[#8C6E48] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>We are here to assist you</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2C2C2C] font-normal tracking-tight">
            Contact Afshan Gift Centre
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#5E5E5E] max-w-2xl mx-auto">
            Have questions about custom furniture dimensions, delivery to your city, or showroom visits in Vehari? Reach out to our team today.
          </p>
        </div>
      </section>

      {/* Main Grid: Info + Form */}
      <section className="py-12 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Contact Details & Showroom Info */}
          <div className="lg:col-span-5 space-y-8">
            {/* Showroom Details Box */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EBE3D9] shadow-subtle space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#EBE3D9]">
                <div className="w-10 h-10 rounded-lg bg-[#FAF7F4] border border-[#DDD1C2] flex items-center justify-center text-[#B8956A]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#2C2C2C]">Vehari Showroom</h3>
                  <p className="text-xs text-[#757575]">Flagship Retail & Consultation</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#B8956A] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-[#757575] uppercase tracking-wider">Address</div>
                  <div className="text-sm text-[#2C2C2C] font-medium mt-0.5">{ADDRESS}</div>
                  <div className="text-xs text-[#5E5E5E] mt-0.5">{LOCATION}</div>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-[#B8956A] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-[#757575] uppercase tracking-wider">Call / Order Hotline</div>
                  <a
                    href={`tel:${CONTACT_PHONE}`}
                    className="text-base text-[#2C2C2C] font-bold hover:text-[#B8956A] transition-colors block mt-0.5"
                  >
                    {CONTACT_PHONE_FORMATTED}
                  </a>
                  <div className="text-xs text-[#757575]">Available for direct calls & order inquiries</div>
                </div>
              </div>

              {/* WhatsApp direct button */}
              <a
                href={`https://wa.me/923001005861?text=Hello%20Afshan%20Gift%20Centre,%20I%20have%20an%20inquiry%20regarding%20furniture%20and%20decor`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 font-medium text-sm transition-colors border border-[#25D366]/30"
              >
                <MessageCircle className="w-4 h-4" />
                Chat with Us on WhatsApp
              </a>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-[#B8956A] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-[#757575] uppercase tracking-wider">Email</div>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-sm text-[#2C2C2C] hover:text-[#B8956A] transition-colors block mt-0.5"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3.5 pt-2 border-t border-[#EBE3D9]">
                <Clock className="w-5 h-5 text-[#B8956A] shrink-0 mt-0.5" />
                <div className="w-full">
                  <div className="text-xs font-semibold text-[#757575] uppercase tracking-wider">Working Hours</div>
                  <div className="mt-1 space-y-1 text-xs sm:text-sm text-[#4D4D4D]">
                    <div className="flex justify-between">
                      <span className="font-medium text-[#2C2C2C]">Monday – Saturday:</span>
                      <span>10:00 AM – 9:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-[#2C2C2C]">Sunday:</span>
                      <span>2:00 PM – 9:00 PM</span>
                    </div>
                    <div className="text-xs text-[#757575] italic pt-1">
                      * Friday break for Jummah prayers (1:00 PM – 2:30 PM)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Guarantees Card */}
            <div className="bg-[#F5F0EB] rounded-2xl p-6 border border-[#DDD1C2] space-y-3.5 text-xs text-[#5E5E5E]">
              <div className="flex items-center gap-2 font-semibold text-[#2C2C2C] text-sm">
                <ShieldCheck className="w-4 h-4 text-[#B8956A]" />
                Customer Assurance
              </div>
              <p>
                Every parcel dispatched from Vehari is securely bubble-crated and insured against in-transit handling.
              </p>
              <div className="flex items-center gap-2 pt-1 font-medium text-[#3D3229]">
                <Truck className="w-4 h-4 text-[#5A7A60]" />
                Fast delivery across Vehari, Multan, Bahawalpur, Lahore, and nation-wide.
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#EBE3D9] shadow-card">
              <div className="mb-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#B8956A]">
                  Inquiry Form
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#2C2C2C] mt-1">
                  Send Us a Message
                </h2>
                <p className="text-sm text-[#5E5E5E] mt-2">
                  Fill in your details below and our furniture consultant will contact you via phone or email within 24 hours.
                </p>
              </div>

              {/* Status Message */}
              {status === 'success' && (
                <div className="mb-6 p-4 rounded-xl bg-[#EFF5F1] border border-[#5A7A60]/30 text-[#5A7A60] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-sm leading-relaxed">{statusMessage}</div>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-[#FBEBEB] border border-[#C75050]/30 text-[#C75050] flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-sm leading-relaxed">{statusMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-medium text-[#2C2C2C] mb-1.5">
                      Full Name <span className="text-[#C75050]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Muhammad Usman"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#DDD1C2] focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] outline-none text-sm bg-[#FAFAF7]"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-medium text-[#2C2C2C] mb-1.5">
                      Phone / WhatsApp Number <span className="text-[#C75050]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="0300 1234567"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#DDD1C2] focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] outline-none text-sm bg-[#FAFAF7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-[#2C2C2C] mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#DDD1C2] focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] outline-none text-sm bg-[#FAFAF7]"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-medium text-[#2C2C2C] mb-1.5">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#DDD1C2] focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] outline-none text-sm bg-[#FAFAF7]"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Custom Furniture Order">Custom Furniture Order</option>
                      <option value="Order Tracking & Delivery">Order Tracking & Delivery</option>
                      <option value="Showroom Visit Appointment">Showroom Visit Appointment</option>
                      <option value="Bulk / Wedding Package">Bulk / Wedding Package</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-[#2C2C2C] mb-1.5">
                    Your Message / Custom Order Details <span className="text-[#C75050]">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder="Tell us what you're looking for, preferred wood polish, room measurements, or any specific questions..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#DDD1C2] focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] outline-none text-sm bg-[#FAFAF7] resize-y"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-[#3D3229] hover:bg-[#2A221B] text-[#FAFAF7] font-medium text-sm transition-all shadow-subtle hover:shadow-card disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Inquiry to Vehari Showroom</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
