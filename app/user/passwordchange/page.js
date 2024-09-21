"use client"; 

import { useSession, signIn } from 'next-auth/react'; // Import useSession to manage session state
import { useRouter } from 'next/navigation'; // Import useRouter to handle redirects
import ChangePasswordForm from '@/components/ChangePasswordForm'; // Adjust the import path if necessary
import { useEffect } from 'react'; // Use useEffect for side effects such as redirecting

const PasswordChangePage = () => {
  const { data: session, status } = useSession(); // Use session data to check authentication status
  const router = useRouter(); // Use router for navigation

  // Redirect to the home page if the user is authenticated to avoid showing the password change page unnecessarily
  useEffect(() => {
    if (status === 'authenticated' && !session) {
      router.push('/');
    }
  }, [status, session, router]);

  // If the session is loading, show a loading state
  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If the user is not authenticated, prompt them to log in
  if (!session) {
    return (
      <div className="flex flex-col justify-center items-center pt-56">
        <p className="mb-4">You need to be signed in to change your password.</p>
        <button
          className="uncc-form-button p-3 text-white font-bold"
          onClick={() => signIn()}
        >
          Sign in
        </button>
      </div>
    );
  }

  // Render the ChangePasswordForm if the user is authenticated
  return (
    <div className="password-change-page flex flex-col justify-center items-center pt-20">
      <h1 className="text-2xl font-bold mb-6">Change Your Password</h1>
      <ChangePasswordForm />
    </div>
  );
};

export default PasswordChangePage;
