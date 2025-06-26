import { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Register | E-Store',
  description: 'Create a new account on E-Store',
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Create an account</h1>
        <RegisterForm />
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              className="text-indigo-600 hover:text-indigo-800"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 