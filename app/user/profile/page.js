"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const UserProfile = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);  
  const [data, setData] = useState(null);  
  const router = useRouter();  

  useEffect(() => {
    // Check the session status and either fetch user data or redirect to login
    if (status === 'authenticated') {
      fetchUserProfile();
    } else if (status === 'unauthenticated') {
      router.push('/user/login');  
    }
  }, [status]);

  // Function to fetch the user's profile data from the server
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

  // Handler for "Change Password" button click, navigates to the change password page
  const handleChangePassword = () => {
    router.push('/user/change-password');  // Replace with the actual path for changing password
  };

  // Handler for "View Clubs" button click, navigates to the clubs page
  const handleViewClubs = () => {
    router.push('/clubs');  // Replace with the actual path for viewing clubs
  };

  if (loading || status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!data) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="flex justify-center p-6">
      <div className="bg-navbar-button shadow-md rounded-lg p-6 w-full max-w-md">
        {/* Display the user's first and last name */}
        <h1 className="text-xl font-bold text-center text-white mb-4">{data.firstname} {data.lastname}'s Profile</h1>
        <div className="mb-4">
          {/* Display the user's email */}
          <label className="block text-white font-semibold">Email:</label>
          <p className="text-white">{data.email}</p>
        </div>
        {/* Button to navigate to the view clubs page */}
        <button 
          onClick={handleViewClubs} 
          className="uncc-form-button p-3 text-white font-bold mt-3 w-full">
          View Clubs
        </button>
        {/* Button to navigate to the change password page */}
        <button 
          onClick={handleChangePassword} 
          className="uncc-form-button p-3 text-white font-bold mt-5 w-full">
          Change Password
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
