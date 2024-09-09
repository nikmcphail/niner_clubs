
import Link from 'next/link';

const Navbar = () => {
    return (
        <div className="w-full h-14 bg-emerald-600 sticky top-0 gold-underline">
            <div className="container mx-auto px-4 h-full">
                <div className="flex justify-center items-center h-full">
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
    );
};

export default Navbar;