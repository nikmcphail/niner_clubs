'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react'; // Import useSession to get the session data

const ChangePasswordForm = () => {
  // Use the useSession hook to get session data
  const { data: session, status } = useSession();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  // Extract the userId from the session, assuming it's included in session.user.id
  const userId = session?.user?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage('User is not authenticated.');
      return;
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }

    try {
      // Send the password change request to the backend with the userId
      const response = await fetch(`/api/passwordchange?userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        setMessage('Password changed successfully.');
      } else {
        const data = await response.json();
        setMessage(data.message || 'Failed to change password.');
      }
    } catch (error) {
      setMessage('An error occurred while changing the password.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button type="submit">Change Password</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ChangePasswordForm;
