'use client';

import React, {useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { createAnnouncement } from '@/app/action/createAnnouncement';
import { motion } from 'framer-motion';

const AnnouncementCreation = ({ params }) => {
  const clubId = params.id;

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('none');
  const [isMember, setIsMember] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const ref = useRef(null);

  const { data: session, status } = useSession();

  const fetchClubInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/club/${clubId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch club profile');
      }

      const clubData = await response.json();
      console.log('Fetched club data:', clubData); // Log the fetched data

      setClub(clubData);
      setUserRole(clubData.userRole);
      setIsMember(clubData.isCurrentUserMember);
    } catch (err) {
      console.error('Error fetching club info:', err);
      setClub(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== 'loading') {
      fetchClubInfo();
    }
  }, [clubId, status]);

  const handleSubmit = async(event) => {
    event.preventDefault(); // Prevent form from refreshing the page
    
    const formData = new FormData(event.target); // Collect form data
    
    const ann = await createAnnouncement({
      title: formData.get("title"),
      description: formData.get("description"),
      creator: session?.user?.id,
      club: clubId
    });
  
    ref.current?.reset(); // Clear the form if successful
  
    if (ann?.error) {
      setError(ann.error);
    } else {
      router.push(`/club/${clubId}/announcement/${ann.announcementId}`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!club) {
    return <div className="flex justify-center items-center h-screen">No club data has been found.</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center pt-56">
      {(userRole !== 'owner' && userRole !== 'admin') ? (
        <p>You do not have permission to view this page.</p>
      ) : (
        <form ref={ref} onSubmit={handleSubmit} className="form-background font-bold">
          <div className="flex flex-col items-center px-5 py-5 space-y-5">
            {error && <div className="text-red-500">{error}</div>}
            <div className="flex flex-col">
              <label htmlFor="title">Announcement Title</label>
              <input type="text" placeholder="Announcement Title" id="title" name="title" className="form-input" />
            </div>

            <div className="flex flex-col">
              <label htmlFor="description">Announcement Description</label>
              <textarea
                className="form-input text-left placeholder-normal font-normal"
                id="description"
                name="description"
                rows="4"
                cols="50"
                placeholder="Announcement Description"
                required
              />
            </div>

            <motion.button 
              className="uncc-form-button p-3 text-white font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Create Announcement
            </motion.button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AnnouncementCreation;