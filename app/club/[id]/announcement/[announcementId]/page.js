'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'; 

const Announcement = ({ params }) => {
  // Retrieve clubId and announcementId from URL
  const announcementId = params.announcementId;
  const clubId = params.id;

  // State variables and other useful React hooks
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState(null);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [userRole, setUserRole] = useState('none');
  const [notification, setNotification] = useState({ message: '', visible: false });

  // Send API request to backend to get announcement information.
  const fetchAnnouncementInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/club/${clubId}/announcement/${announcementId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch announcement.');
      }

      const announcementData = await response.json();
      setAnnouncement(announcementData);
    } catch (err) {
      console.error('Error fetching club info:', err);
      setAnnouncement(null);
    } finally {
      setLoading(false);
    }
  }

  // Function to fetch user's role in the club
  const fetchUserRole = async () => {
    try {
      const response = await fetch(`/api/club/${clubId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch club info');
      
      const clubData = await response.json();
      setUserRole(clubData.userRole);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  // Handle back to club button
  const handleClick = () => {
    router.push(`/club/${clubId}`);
  }

  // Function to handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/club/${clubId}/announcement/${announcementId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editedTitle,
          description: editedDescription,
        }),
      });

      if (!response.ok) throw new Error('Failed to update announcement');

      const updatedAnnouncement = await response.json();
      setAnnouncement({
        ...announcement,
        title: editedTitle,
        description: editedDescription,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating announcement:', error);
    }
  };

  // Function to handle entering edit mode
  const handleEditClick = () => {
    setEditedTitle(announcement.title);
    setEditedDescription(announcement.description);
    setIsEditing(true);
  };

  // Fetch announcement information when page is loading
  useEffect(() => {
    if (loading) {
      fetchAnnouncementInfo();
      fetchUserRole();
    }
  }, [loading])

  // Display loading message
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Display message if announcement isn't found or is not part of the club
  if (!announcement) {
    return <div className="flex justify-center items-center h-screen">The announcement is either not a part of this club or does not exist.</div>;
  }

  // Display announcement information
  return (
    <div className="flex flex-col justify-center items-center pt-16 min-h-screen">
      {/* Notification Component */}
      <AnimatePresence>
        {notification.visible && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="bg-uncc-green text-white py-2 px-4 rounded-lg shadow-md mb-6 hover:bg-green-800 transition-all"
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Back to club
      </motion.button>
      
      {isEditing ? (
        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleEditSubmit} 
          className="bg-[#f2dab3] p-8 rounded-lg shadow-lg max-w-3xl w-full"
        >
          <div className="mb-6">
            <label className="block text-gray-800 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:border-blue-500 transition-all text-gray-800"
              placeholder="Enter announcement title"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-800 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:border-blue-500 transition-all text-gray-800"
              rows="6"
              placeholder="Enter announcement description"
            />
          </div>

          <div className="flex gap-4 justify-end">
            <motion.button
              type="submit"
              className="bg-uncc-green text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save Changes
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-red-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-red-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
          </div>
        </motion.form>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-[#f2dab3] p-6 rounded-lg shadow-lg max-w-3xl w-full"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{announcement.title}</h1>
          <p className="text-lg text-gray-800 mb-2">
            {announcement.creator.firstname} {announcement.creator.lastname}
          </p>
          <p className="text-lg text-gray-800 mb-4">
            {announcement.timestamp}
          </p>
          <p className="text-lg text-gray-800">
            {announcement.description}
          </p>
          {(userRole === 'admin' || userRole === 'owner') && (
            <motion.button
              onClick={handleEditClick}
              className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Edit Announcement
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default Announcement;