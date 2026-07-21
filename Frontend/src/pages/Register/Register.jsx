import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User, Mail, Lock, Phone, Eye, EyeOff, UserPlus } from 'lucide-react';
import Input from '@/components/forms/Input';
import Button from '@/components/ui/Button';
import { authService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants';

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const { confirmPassword, ...payload } = formData;
      const res = await authService.register(payload);
      const { user, token } = res.data.data;
      login(user, token);
      toast.success(`Welcome to ShopVerse, ${user.name}!`);
      navigate(ROUTES.HOME, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1.5">Join us and start shopping in seconds</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-5">
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-[42px] text-gray-400" />
            <Input
              label="Full name"
              placeholder="John Doe"
              className="pl-10"
              error={errors.name}
              {...register('name', { required: 'Name is required' })}
            />
          </div>

          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-[42px] text-gray-400" />
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              error={errors.email}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
            />
          </div>

          <div className="relative">
            <Phone size={16} className="absolute left-3.5 top-[42px] text-gray-400" />
            <Input
              label="Phone number"
              type="tel"
              placeholder="9876543210"
              className="pl-10"
              error={errors.phone}
              {...register('phone', {
                required: 'Phone number is required',
                pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit number' },
              })}
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-[42px] text-gray-400" />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              className="pl-10 pr-10"
              error={errors.password}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3.5 top-[42px] text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-[42px] text-gray-400" />
            <Input
              label="Confirm password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              className="pl-10"
              error={errors.confirmPassword}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />
          </div>

          <Button type="submit" size="lg" disabled={submitting} className="w-full">
            <UserPlus size={17} />
            {submitting ? 'Creating account…' : 'Create Account'}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-[var(--color-primary)] font-medium hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;