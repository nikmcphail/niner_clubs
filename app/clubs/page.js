'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import React from 'react';

const BrowseClubs = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function getClubs() {
            try {
                const response = await fetch('/api/clubs', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const clubData = await response.json();

                if (response.ok) {
                    setClubs(clubData);
                    setLoading(false);
                } else {
                    setMessage('Failed to load clubs');
                    setLoading(false);
                }
            } catch (error) {
                setMessage('Error fetching clubs');
                setLoading(false);
            }
        }

        getClubs();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (message) {
        return <div>{message}</div>;
    }

    return (
        <div className='flex flex-col justify-center items-center p-4'>
            <h2 className="text-xl font-semibold mb-2">Browse Clubs</h2>
            <ul className="space-y-4 w-full max-w-3xl">
                {clubs.length === 0 ? (
                    <div>No clubs have been created.</div>
                ) : (
                    clubs.map((club) => (
                        <Link href={`/club/${club._id}`}>
                            <li key={club._id} className="border p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-semibold mb-2">{club.name}</h3>
                                <p className="text-gold">{club.description}</p>

                            </li>
                        </Link>

                    ))
                )}
            </ul>
        </div>
    );
};

export default BrowseClubs;