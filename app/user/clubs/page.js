'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const UserClubs = () => {
    const [clubs, setClubs] = useState([]); // Clubs the user is a member of
    const [ownedClubs, setOwnedClubs] = useState([]); // Clubs the user owns
    const [message, setMessage] = useState("");
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/user/login');
            return null;
        }

        async function fetchClubs() {
            if (status === 'authenticated') {
                try {
                    const response = await fetch(`/api/user/clubs?userId=${session.user.id}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    });

                    const clubData = await response.json();
                    if (response.ok) {
                        // Filter to only show clubs with `active: true`
                        const activeClubs = clubData.clubs?.filter(club => club.active) || [];
                        setClubs(activeClubs); // Set only active clubs the user belongs to
                        setOwnedClubs(clubData.ownedClubs || []); // Set clubs the user owns
                        setMessage('');
                    } else {
                        setMessage(clubData.message);
                    }
                } catch (err) {
                    setMessage('An error has occurred.');
                    console.log(err.message);
                }
            }
        }

        fetchClubs();
    }, [status, session, router]);

    if (status === 'loading') {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="flex flex-col justify-center items-center p-4">
            <h1 className="text-2xl font-bold mb-4">Your Clubs</h1>
            {message && <div className="text-red-500">{message}</div>}
            
            {/* Active clubs the user is a member of */}
            <h2 className="text-xl font-semibold mb-2">Clubs You Belong To</h2>
            <ul className="space-y-4">
                {clubs.length > 0 ? (
                    clubs.map((club) => (
                        <Link href={`/club/${club._id}`}>
                        <li key={club._id} className="flex flex-col items-center border p-4 rounded-lg mb-4">
                            <h3 className="text-lg font-semibold">{club.name}</h3>
                            <p className="text-gold">{club.description}</p>
                        </li>
                        </Link>
                    ))
                ) : (
                    <div className="text-center">You are not a member of any active clubs.</div>
                )}
            </ul>

            {/* Clubs the user owns */}
            <h2 className="text-xl font-semibold mt-6 mb-2">Clubs You Own</h2>
            <ul className="space-y-4">
                {ownedClubs.length > 0 ? (
                    ownedClubs.map((club) => (
                        <Link href={`/club/${club._id}`}>
                        <li key={club._id} className="flex flex-col items-center border p-4 rounded-lg mb-4">
                            <h3 className="text-lg font-semibold">{club.name}</h3>
                            <p className="text-gold">{club.description}</p>
                        </li>
                        </Link>
                    ))
                ) : (
                    <div className="text-center">You do not own any clubs.</div>
                )}
            </ul>
        </div>
    );
};

export default UserClubs;
