import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Login | E-Store',
  description: 'Sign in to your E-Store account',
};

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Sign in to your account</h1>
        <LoginForm />
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link 
              href="/auth/register" 
              className="text-indigo-600 hover:text-indigo-800"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 