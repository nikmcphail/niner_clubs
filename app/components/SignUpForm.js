'use client';

import {motion} from 'framer-motion';

export default function SignUpForm() {

    return (
        <form className="form-background font-bold">
            <div className="flex flex-col items-center px-5 py-5 space-y-5">
                <div className="flex flex-col">
                    <label htmlFor="fullname">Full Name</label>
                    <input className="form-input" type="text" id="fullname" placeholder="John Doe" required />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="email">Email (uncc/charlotte.edu)</label>
                    <input className="form-input" type="email" id="email" pattern="^[a-zA-Z0-9._%+\-]+@(uncc\.edu|charlotte\.edu)$" placeholder="johndoe@charlotte.edu" required />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="password">Password</label>
                    <input className="form-input" type="password" id="password" placeholder="Enter password" required />
                </div>

                <motion.button whileHover={{scale: 1.1, transition:{duration: .2}}} className="uncc-form-button p-3 text-white font-bold" type="submit">Sign Up</motion.button>
            </div>
        </form>
    )
}