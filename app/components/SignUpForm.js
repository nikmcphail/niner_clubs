'use client';

import axios from 'axios';
import {motion} from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
    const [user, setUser] = useState({
        fullname: "",
        email: "",
        password: ""
    });

    const router = useRouter();
 
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Call api/user/register route.js
        try {
            const response = await axios.post('/api/user/register', user);
            router.push('/user/login');
        } catch (error) {
            console.log("There was a problem.", error.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="form-background font-bold">
            <div className="flex flex-col items-center px-5 py-5 space-y-5">
                <div className="flex flex-col">
                    <label htmlFor="fullname">Full Name</label>
                    <input value={user.fullname} onChange ={(e) => setUser({...user, fullname: e.target.value})} className="form-input" type="text" id="fullname" placeholder="John Doe" required />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="email">Email (uncc/charlotte.edu)</label>
                    <input value={user.email} onChange ={(e) => setUser({...user, email: e.target.value})} className="form-input" type="email" id="email" pattern="^[a-zA-Z0-9._%+\-]+@(uncc\.edu|charlotte\.edu)$" placeholder="johndoe@charlotte.edu" required />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="password">Password</label>
                    <input value={user.password} onChange ={(e) => setUser({...user, password: e.target.value})} className="form-input" type="password" id="password" placeholder="Enter password" required />
                </div>

                <motion.button whileHover={{scale: 1.1, transition:{duration: .2}}} className="uncc-form-button p-3 text-white font-bold" type="submit">Sign Up</motion.button>
            </div>
        </form>
    )
}