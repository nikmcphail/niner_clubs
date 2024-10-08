'use client';

import logo from '@/app/public/images/logo.png'; 
import Link from 'next/link';
import Image from 'next/image';
import {motion} from 'framer-motion';
import {signOut, useSession} from "next-auth/react";
import {useRouter} from 'next/navigation';

/*
 * @TODO: Show/hide certain elements depending on if user is logged in or not.
 */

const Navbar = () => {
    const {data: session, status} = useSession();
    const router = useRouter();
    const debug = false;

    function test() {
        console.log(session?.user);
    }

    const sessionHandling = () => {
        if (status === 'authenticated') {
            return (
                <div className="absolute left-1/2 transform -translate-x-1/2">
                        <ul className="hidden md:flex gap-x-6">
                            <li>
                                <Link href="/">
                                    <motion.p whileHover={{scale: 1.1, transition:{duration: .2}}} className="navbar-item">Home</motion.p>
                                </Link>
                            </li>
                            <li>
                                <Link href="/clubs">
                                    <motion.p whileHover={{scale: 1.1, transition:{duration: .2}}} className="navbar-item">Browse Clubs</motion.p>
                                </Link>
                            </li>
                            <li>
                                <Link href="/club/new">
                                    <motion.p whileHover={{scale: 1.1, transition:{duration: .2}}} className="navbar-item">Register Club</motion.p>
                                </Link>
                            </li>
                            <li>
                                <Link href="/user/profile">
                                    <motion.p whileHover={{scale: 1.1, transition:{duration: .2}}} className="navbar-item">Profile</motion.p>
                                </Link>
                            </li>
                            <li>
                                    <motion.button whileHover={{scale: 1.1, transition:{duration: .2}}} onClick={() => { signOut({redirect: false}).then(() => {router.push("/")})}} className="navbar-item">Sign Out</motion.button>
                            </li>
                            {debug && <li>
                                <motion.button onClick={test} whileHover={{scale: 1.1, transition:{duration: .2}}} className="navbar-item">Testing Session</motion.button>
                            </li>}
                            
                        </ul>
                    </div>
            )
        } else {
            return (
                <div className="absolute left-1/2 transform -translate-x-1/2">
                        <ul className="hidden md:flex gap-x-6">
                            <li>
                                <Link href="/">
                                    <motion.p whileHover={{scale: 1.1, transition:{duration: .2}}} className="navbar-item">Home</motion.p>
                                </Link>
                            </li>
                            <li>
                                <Link href="/clubs">
                                    <motion.p whileHover={{scale: 1.1, transition:{duration: .2}}} className="navbar-item">Browse Clubs</motion.p>
                                </Link>
                            </li>
                            <li>
                                <Link href="/user/register">
                                    <motion.p whileHover={{scale: 1.1, transition:{duration: .2}}} className="navbar-item">Register</motion.p>
                                </Link>
                            </li>
                            <li>
                                <Link href="/user/login">
                                    <motion.p whileHover={{scale: 1.1, transition:{duration: .2}}} className="navbar-item">Sign In</motion.p>
                                </Link>
                            </li>
                        </ul>
                    </div>
            );
        }
    }
 
    return (
        <div className="w-full h-20 bg-uncc-green sticky top-0 gold-underline">
            <div className="container mx-auto px-4 h-full">
                <div className="flex justify-between items-center h-full relative">
                    <div className="flex justify-start">
                        <Image
                            src={logo}
                            alt={`Logo`}
                            width={100} // Set the appropriate width
                            height={100} // Set the appropriate height
                        />
                    </div>
                    {sessionHandling()}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
