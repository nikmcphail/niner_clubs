import logo from '@/app/public/images/logo.png'; 
import Link from 'next/link';
import Image from 'next/image';

/*
 * @TODO: Show/hide certain elements depending on if user is logged in or not.
 */

const Navbar = () => {
    return (
        <div className="w-full h-20 bg-uncc-green sticky top-0 gold-underline">
            <div className="container px-4 h-full">
                <div className="flex justify-between items-center h-full">
                    <div className="flex justify-start">
                    <Image
                        src={logo}
                        alt={`Logo`}
                        width={100} // Set the appropriate width
                        height={100} // Set the appropriate height
                    />
                    </div>
                    <div className="flex justify-end">
                        <ul className="hidden md:flex gap-x-6">
                            <li>
                                <Link href="/">
                                    <p className="navbar-item">Home</p>
                                </Link>
                            </li>
                            <li>
                                <Link href="/">
                                    <p className="navbar-item">Browse Clubs</p>
                                </Link>
                            </li>
                            <li>
                                <Link href="/">
                                    <p className="navbar-item">Register Club</p>
                                </Link>
                            </li>
                            <li>
                                <Link href="/user/profile">
                                    <p className="navbar-item">Profile</p>
                                </Link>
                            </li>
                            <li>
                                <Link href="/user/register">
                                    <p className="navbar-item">Register</p>
                                </Link>
                            </li>
                            <li>
                                <Link href="/user/login">
                                    <p className="navbar-item">Sign In</p>
                                </Link>
                            </li>
                            <li>
                                <Link href="/">
                                    <p className="navbar-item">Sign Out</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;