import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'تسجيل الدخول · Login',
  description: 'تسجيل الدخول لمنصة التميز الحكومي',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
