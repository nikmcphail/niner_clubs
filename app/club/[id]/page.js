'use client';

import React, { useEffect, useState } from 'react';
import ScrollingBackground from '@/app/components/ScrollingBackground';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const ClubPage = ({ params }) => {
    // Extract club ID from the URL parameters
    const clubId = params.id;

    // State variables for managing club data and UI
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', visible: false });
    const [userRole, setUserRole] = useState('none');
    const [isMember, setIsMember] = useState(false);
    const [leaveConfirmation, setLeaveConfirmation] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState('');
    const router = useRouter();

    // Use Next.js authentication hook to get session data
    const { data: session, status } = useSession();

    // Function to fetch club information from the API
    const fetchClubInfo = async () => {
        try {
            setLoading(true);
            // Make a GET request to the club API endpoint (defined in app/api/club/[id]/route.js)
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
            // Update state with fetched club data
            setClub(clubData);
            setUserRole(clubData.userRole);
            setIsMember(clubData.isCurrentUserMember);
        } catch (err) {
            console.error('Error fetching club info:', err);
            showNotification(err.message);
            setClub(null);
        } finally {
            setLoading(false);
        }
    };

    // Fetch club info when component mounts or when clubId/status changes
    useEffect(() => {
        if (status !== 'loading') {
            fetchClubInfo();
        }
    }, [clubId, status]);

    // Function to display notifications
    const showNotification = (message) => {
        setNotification({ message, visible: true });
        setTimeout(() => {
            setNotification(prev => ({ ...prev, visible: false }));
        }, 3000);
    };

    // Function to handle joining a club
    const handleJoinClub = async () => {
        try {
            // Make a POST request to join the club (endpoint defined in app/api/club/join/[id]/route.js)
            const response = await fetch(`/api/club/join/${clubId}`, {
                method: 'POST',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to join the club');
            }

            // Update local state to reflect the user joining the club
            setIsMember(true);
            setUserRole('member');
            setClub(prevClub => ({
                ...prevClub,
                members: [...prevClub.members, session.user]
            }));

            showNotification('Successfully joined the club!');
        } catch (error) {
            console.error('Error joining club:', error);
            showNotification(error.message || 'An error occurred while joining the club');
        }
    };

    // Function to handle leaving a club
    const handleLeaveClub = async () => {
        if (!leaveConfirmation) {
            setLeaveConfirmation(true);
            return;
        }

        try {
            // Make a POST request to leave the club (endpoint defined in app/api/club/leave/[id]/route.js)
            const response = await fetch(`/api/club/leave/${clubId}`, {
                method: 'POST',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to leave the club');
            }

            // Update local state to reflect the user leaving the club
            setIsMember(false);
            setUserRole('none');
            setClub(prevClub => ({
                ...prevClub,
                members: prevClub.members.filter(member => member._id !== session.user.id)
            }));

            showNotification('Successfully left the club!');
        } catch (error) {
            console.error('Error leaving club:', error);
            showNotification(error.message || 'An error occurred while leaving the club');
        } finally {
            setLeaveConfirmation(false);
        }
    };

    // Function to handle clicking the edit button
    const handleEditClick = () => {
        setIsEditing(true);
        setEditedDescription(club.description);
    };

    // Function to handle redirection to announcement creation page
    const handleCreateAnnouncementClick = () => {
        router.push(`/club/${clubId}/announcement/create`);
    }

    // Function to handle canceling the edit
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedDescription('');
    };

    // Function to handle saving the edited description
    const handleSaveEdit = async () => {
        try {
            // Make a PUT request to update the club description (endpoint defined in app/api/club/update/[id]/route.js)
            const response = await fetch(`/api/club/update/${clubId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: editedDescription }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update club description');
            }
    
            const updatedClubData = await response.json();
            
            // Update only the description in the existing club state
            setClub(prevClub => ({
                ...prevClub,
                description: updatedClubData.club.description
            }));
            
            setIsEditing(false);
            showNotification('Club description updated successfully!');
        } catch (error) {
            console.error('Error updating club description:', error);
            showNotification(error.message || 'An error occurred while updating the club description');
        }
    };

    // Display loading state while fetching data
    if (status === 'loading' || loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // Display message if no club data is found
    if (!club) {
        return <div className="flex justify-center items-center h-screen">No club data has been found.</div>;
    }

    // Styles for buttons and hover effects
    const buttonStyle = "p-3 text-white font-bold rounded text-base shadow-md";
    const buttonHoverEffect = {
        scale: 1.1,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)"
    };

    // Main component render
    return (
        <>
            {/* Background component */}
            <ScrollingBackground />
            <div className="flex flex-col justify-center items-center pt-56 relative">
                <div className="form-background font-bold w-full max-w-md">
                    <div className="flex flex-col items-center px-5 py-5 space-y-5">
                        <h1 className="text-2xl font-bold">{club.name}</h1>

                        {/* Conditional rendering for editing mode */}
                        {isEditing ? (
                            <>
                                <textarea
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    className="form-input w-full text-left placeholder-normal font-normal"
                                    rows="4"
                                    placeholder="Describe your club"
                                />
                                <div className="flex space-x-2">
                                    <motion.button 
                                        onClick={handleSaveEdit} 
                                        className="uncc-form-button p-2 text-white font-bold"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Save
                                    </motion.button>
                                    <motion.button 
                                        onClick={handleCancelEdit} 
                                        className="bg-gray-500 p-2 text-white font-bold rounded"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Cancel
                                    </motion.button>
                                </div>
                            </>
                        ) : (
                            // Display club description when not in editing mode
                            <p className="font-normal text-left"><span className="font-bold">Description:</span> {club.description}</p>
                        )}

                        {/* Display club owner information */}
                        <p className="text-left w-full">
                            <span className="font-bold">Owner:</span>{' '}
                            <span className="font-normal">
                                {club.owner ? `${club.owner.firstname} ${club.owner.lastname}` : 'Unknown'}
                            </span>
                        </p>

                        {/* Display number of club members */}
                        <p className="text-left w-full">
                            <span className="font-bold">Members:</span>{' '}
                            <span className="font-normal">{club.members.length}</span>
                        </p>

                         {/* Conditional rendering of Edit Club button for club owner */}
                         {userRole === 'owner' && !isEditing && (
                            <motion.button 
                                onClick={handleEditClick}
                                className="bg-blue-500 hover:bg-blue-800 p-2 text-white font-bold rounded"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                Edit Club
                            </motion.button>
                        )}

                         {/* Conditional rendering of Creatre Announcement button for club owners/admins */}
                        {(userRole === 'owner' || userRole === 'admin') && (
                            <motion.button
                                onClick={handleCreateAnnouncementClick}
                                className="bg-blue-500 hover:bg-blue-800 p-2 text-white font-bold rounded"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >    
                                Create Announcement
                            </motion.button>
                        )}

                        {/* Conditional rendering of Join Club button for non-members */}
                        {session && session.user.id !== club.owner._id && !isMember && (
                            <motion.button 
                            onClick={handleJoinClub}
                            className="uncc-form-button p-3 text-white font-bold"
                            whileHover={{scale: 1.03}}
                            transition={{duration: .2}}
                        >
                            Join Club
                        </motion.button>
                    )}

                    {/* Conditional rendering of Leave Club button for members */}
                    {isMember && userRole !== 'owner' && (
                        <motion.button 
                            onClick={handleLeaveClub}
                            className="bg-red-500 hover:bg-red-700 focus:bg-red-900 p-3 text-white font-bold rounded text-base shadow-lg shadow-lg"
                            whileHover={{
                                scale: 1.03,
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)"
                            }}
                            transition={{duration: .2}}
                        >
                            {leaveConfirmation ? "Are you sure?" : "Leave Club"}
                        </motion.button>
                        )}
                    </div>
                </div>

                {/* Animated notification component */}
                <AnimatePresence>
                    {notification.visible && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, x: '100%' }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, y: 50, x: '100%' }}
                            transition={{ duration: 0.3 }}
                            className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg"
                        >
                            {notification.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}

export default ClubPage;

