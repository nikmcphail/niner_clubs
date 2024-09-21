'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

const ChangePasswordForm = () => {
  const { data: session } = useSession();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user?.id) {
      setMessage('User is not authenticated.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`/api/passwordchange?userId=${session.user.id}`, {
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
    <div className="flex flex-col justify-center items-center pt-56">
      <form onSubmit={handleSubmit} className="form-background font-bold">
        <div className="flex flex-col items-center px-5 py-5 space-y-5">
          <input
            className="form-input"
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <input
            className="form-input"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            className="form-input"
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="uncc-form-button p-3 text-white font-bold">
            Change Password
          </button>
          {message && <p>{message}</p>}
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
