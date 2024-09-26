'use client';

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { createclub } from '@/app/action/createclub';
import ScrollingBackground from '@/app/components/ScrollingBackground';
import { motion, AnimatePresence } from 'framer-motion';

const ClubCreate = () => {
    const {data: session, status} = useSession();
    const router = useRouter();
    const [error, setError] = useState("");
    const [notification, setNotification] = useState({ message: '', visible: false });
    const [clubName, setClubName] = useState("");
    const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const clubNameRef = useRef(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/user/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (clubNameRef.current) {
            clubNameRef.current.focus();
        }
    }, []);

    const showNotification = (message) => {
        setNotification({ message, visible: true });
        setTimeout(() => {
            setNotification(prev => ({ ...prev, visible: false }));
        }, 3000);
    };

    const handleClubNameChange = (e) => {
        const text = e.target.textContent;
        setClubName(text);
        setIsPlaceholderVisible(text.trim() === "");
    };

    const handleClubNameKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
        setIsFocused(false);
        if (clubName.trim() === "") {
            setIsPlaceholderVisible(true);
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const description = e.target.description.value;
        
        if (clubName.trim() === "") {
            setError("Please enter a club name");
            return;
        }

        const create = await createclub({
            name: clubName,
            description: description,
            userId: session?.user?.id
        });

        if (create?.error) {
            setError(create.error);
        } else {
            showNotification('Club created successfully!');
            setTimeout(() => {
                router.push(`/club/${create.clubId}`);
            }, 1500);
        }
    }

    if (status === 'loading') {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <>
            <ScrollingBackground />
            <div className="flex flex-col justify-center items-center pt-56">
                <form onSubmit={handleSubmit} className="form-background font-bold w-full max-w-md">
                    <div className="flex flex-col items-center px-5 py-5 space-y-5 text-center">
                        {error && <div className="text-red-500 w-full">{error}</div>}
                        <div 
                            className="relative"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <motion.div
                                animate={{
                                    scale: isHovered ? 1.05 : 1
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20
                                }}
                            >
                                <div 
                                    ref={clubNameRef}
                                    contentEditable={true}
                                    onInput={handleClubNameChange}
                                    onKeyDown={handleClubNameKeyDown}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    className={`text-2xl font-bold outline-none transition-colors duration-200 min-w-[200px] text-center caret-transparent ${isFocused ? 'animate-text-fade' : ''}`}
                                    dir="auto"
                                />
                                {isPlaceholderVisible && (
                                    <div className={`absolute inset-0 text-2xl font-bold text-gray-200 pointer-events-none ${isFocused ? 'animate-placeholder' : ''}`}>
                                        Your Club Name
                                    </div>
                                )}
                            </motion.div>
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[120%] h-0.5 bg-gray-300"></div>
                        </div>
                        <div className="flex flex-col w-full">
                            <label htmlFor="description" className="mb-2 text-center">Club Description</label>
                            <textarea 
                                className="form-input text-left placeholder-normal font-normal" 
                                id="description" 
                                name="description" 
                                rows="4" 
                                cols="50"
                                placeholder="Describe your club here"
                                required
                            />
                        </div>
                        <button type="submit" className="uncc-form-button p-3 text-white font-bold w-full">Create Club</button>
                    </div> 
                </form>
            </div>
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
            <style jsx global>{`
                @keyframes placeholderFade {
                    0%, 100% { opacity: 0.15; }
                    50% { opacity: 1; }
                }
                .animate-placeholder {
                    animation: placeholderFade 1s ease-in-out infinite;
                }
                @keyframes textFade {
                    0%, 100% { opacity: 0.15; }
                    50% { opacity: 1; }
                }
                .animate-text-fade {
                    animation: textFade 1s ease-in-out infinite;
                }
            `}</style>
        </>
    )
}

export default ClubCreate
