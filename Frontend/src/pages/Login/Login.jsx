import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import Input from '@/components/forms/Input';
import Button from '@/components/ui/Button';
import { authService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const redirectTo = location.state?.from || ROUTES.HOME;

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const res = await authService.login(formData);
      const { user, token } = res.data.data;
      login(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1.5">Login to continue to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-5">
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
            <Lock size={16} className="absolute left-3.5 top-[42px] text-gray-400" />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-10 pr-10"
              error={errors.password}
              {...register('password', { required: 'Password is required' })}
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

          <div className="flex justify-end -mt-2">
            <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs text-[var(--color-primary)] hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" size="lg" disabled={submitting} className="w-full">
            <LogIn size={17} />
            {submitting ? 'Logging in…' : 'Login'}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} className="text-[var(--color-primary)] font-medium hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;