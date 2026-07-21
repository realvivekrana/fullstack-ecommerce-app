import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Input from '@/components/forms/Input';
import Button from '@/components/ui/Button';
import Breadcrumbs from '@/components/common/Breadcrumbs';

const CONTACT_INFO = [
  { icon: Mail, label: 'Email us', value: 'support@shopverse.com' },
  { icon: Phone, label: 'Call us', value: '+91 98765 43210' },
  { icon: MapPin, label: 'Visit us', value: 'Kharadi, Pune, Maharashtra' },
];

function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    // No backend endpoint for contact messages yet — this simulates submission.
    await new Promise((resolve) => setTimeout(resolve, 700));
    toast.success("Message sent! We'll get back to you soon.");
    reset();
    setSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-16">
      <Breadcrumbs items={[{ label: 'Contact' }]} />

      <div className="text-center max-w-lg mx-auto mb-10">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Get in Touch</h1>
        <p className="text-sm text-gray-500">
          Have a question about your order, a product, or anything else? We'd love to hear from you.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="lg:col-span-1 space-y-4">
          {CONTACT_INFO.map((item) => (
            <div key={item.label} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <item.icon size={17} className="text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-sm font-medium text-gray-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              label="Your name"
              placeholder="John Doe"
              error={errors.name}
              {...register('name', { required: 'Name is required' })}
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              error={errors.email}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
            />
          </div>

          <Input
            label="Subject"
            placeholder="How can we help?"
            error={errors.subject}
            {...register('subject', { required: 'Subject is required' })}
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
            <textarea
              rows={5}
              placeholder="Tell us more…"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[var(--color-primary)] resize-none"
              {...register('message', { required: 'Message is required' })}
            />
            {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
          </div>

          <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
            <Send size={16} />
            {submitting ? 'Sending…' : 'Send Message'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Contact;