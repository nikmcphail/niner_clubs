"use client";

import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { useSession } from 'next-auth/react'; // Optional, to display session information if needed

const UserProfile = () => {
  const router = useRouter(); // Initialize the router for navigation

  // Handler to navigate to the change password page
  const handleChangePassword = () => {
    router.push('/user/passwordchange'); // Correct path to navigate to the password change page
  };

  return (
    <div className="profile-page flex flex-col items-center pt-20">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <p className="mb-4">Manage your account settings and update your information.</p>

      {/* Button to navigate to the password change page */}
      <button
        className="uncc-form-button p-3 text-white font-bold mt-4"
        onClick={handleChangePassword}
      >
        Change Password
      </button>
    </div>
  );
};

export default UserProfile;
