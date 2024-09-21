"use client"; 

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const UserProfile = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const router = useRouter();

  // UseEffect to handle session status and data fetching
  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserProfile();
    } else if (status === 'unauthenticated') {
      router.push('/user/login');
    }
  }, [status]);

  // Function to fetch the user's profile data
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/user/profile?userId=${session?.user?.id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const profileData = await response.json();
      setData(profileData);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler to navigate to the change password page
  const handleChangePassword = () => {
    router.push('/user/passwordchange'); // Correct path to navigate to the password change page
  };

  // Handler to navigate to the clubs page
  const handleViewClubs = () => {
    router.push('/clubs'); // Navigates to the clubs page
  };

  // Show loading state if session or profile data is still being fetched
  if (loading || status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Display message if no user data is available
  if (!data) {
    return <div>No user data available.</div>;
  }

  // Render the user's profile information along with navigation buttons
  return (
    <div className="flex justify-center p-6">
      <div className="bg-navbar-button shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-xl font-bold text-center text-white mb-4">
          {data.firstname} {data.lastname}'s Profile
        </h1>
        <div className="mb-4">
          <label className="block text-white font-semibold">Email:</label>
          <p className="text-white">{data.email}</p>
        </div>
        <button
          onClick={handleViewClubs}
          className="uncc-form-button p-3 text-white font-bold mt-3 w-full"
        >
          View Clubs
        </button>
        <button
          onClick={handleChangePassword}
          className="uncc-form-button p-3 text-white font-bold mt-5 w-full"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
