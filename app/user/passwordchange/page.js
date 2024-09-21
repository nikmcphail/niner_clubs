"use client"; 

import { useSession, signIn } from 'next-auth/react'; // Import useSession to manage session state
import { useRouter } from 'next/navigation'; // Import useRouter to handle redirects
import { useEffect } from 'react'; // Use useEffect for side effects such as redirecting
import ChangePasswordForm from '@/app/components/ChangePasswordForm'; // Corrected import path

const PasswordChangePage = () => {
  const { data: session, status } = useSession(); // Use session data to check authentication status
  const router = useRouter(); // Use router for navigation

  // Redirect to the login page if the user is unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/user/login');
    }
  }, [status, router]);

  // If the session is loading, show a loading state
  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If the user is authenticated, render the ChangePasswordForm
  if (status === 'authenticated') {
    return (
      <div className="password-change-page flex flex-col justify-center items-center pt-20">
        <h1 className="text-2xl font-bold mb-6">Change Your Password</h1>
        <ChangePasswordForm />
      </div>
    );
  }

  // Return null if the status is unauthenticated (handled by useEffect)
  return null;
};

export default PasswordChangePage;
