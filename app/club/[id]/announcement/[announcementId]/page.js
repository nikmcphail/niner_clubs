'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Announcement = ({ params }) => {
  // Retrieve clubId and announcementId from URL
  const announcementId = params.announcementId;
  const clubId = params.id;

  // State variables and other useful React hooks
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState(null);
  const router = useRouter();

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

  // Handle back to club button
  const handleClick = () => {
    router.push(`/club/${clubId}`);
  }

  // Fetch announcement information when page is loading
  useEffect(() => {
    if (loading) {
      fetchAnnouncementInfo();
    }
  })

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
      <button
      className="bg-uncc-green text-white py-2 px-4 rounded-lg shadow-md mb-6 hover:bg-green-800 transition-all"
      onClick={handleClick}
    >
      Back to club
    </button>
      <div className="bg-[#f2dab3] p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-black mb-4">{announcement.title}</h1>
        <p className="text-lg text-black mb-2">
          {announcement.creator.firstname} {announcement.creator.lastname}
        </p>
        <p className="text-lg text-black mb-4">
          {announcement.timestamp}
        </p>
        <p className="text-lg text-black">
          {announcement.description}
        </p>
      </div>
    </div>
  );
}

export default Announcement