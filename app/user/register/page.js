"use client";
import {useRef, useState, useEffect} from 'react';
import {useRouter} from "next/navigation";
import { register } from '@/app/action/register';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Register() {
  const [errors, setErrors] = useState("");
  const router = useRouter();
  const ref = useRef(null);
  const {data: session, status} = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router])

  const handleSubmit = async(formData) => {
    const reg = await register({
      firstname: formData.get("firstname"),
      lastname: formData.get("lastname"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    ref.current?.reset();
    if (reg?.errors) { 
      setErrors(reg.errors);
      return;
    } else if (reg?.error) {
      setErrors({general: reg.error});
      return;
    } else {
      return router.push('/user/login');
    }
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center pt-56">
      <form ref={ref} action={handleSubmit} className="form-background font-bold">
        <div className="flex flex-col items-center px-5 py-5 space-y-5">
          {errors.general && <div className="text-red-500">{errors.general}</div>}
          <div className="flex flex-col">
            <label htmlFor="firstname">First Name</label>
            <input type="text" placeholder="John" id="firstname" name="firstname" className="form-input" required/>
            {errors.firstname && <div className="text-red-500">{errors.firstname}</div>}
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="username">Username</label>
            <input type="text" placeholder="johndoe123" id="username" name="username" className="form-input" required/>
            {errors.username && <div className="text-red-500">{errors.username}</div>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="lastname">Last Name</label>
            <input type="text" placeholder='Doe' id="lastname" name="lastname" className="form-input" required/>
            {errors.lastname && <div className="text-red-500">{errors.lastname}</div>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input type="email" pattern="^[a-zA-Z0-9._%+\-]+@(uncc\.edu|charlotte\.edu)$" id="email" name="email" placeholder="johndoe@charlotte.edu" className="form-input" required/>
            {errors.email && <div className="text-red-500">{errors.email}</div>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input type="password" placeholder="Password" id="password" name="password" className="form-input" required/>
            {errors.password && <div className="text-red-500">{errors.password}</div>}
          </div>

          <button className="uncc-form-button p-3 text-white font-bold">Sign Up</button>
        </div>
        
      </form>
      <div className="pt-4">
        <Link href='/user/login'>Already have an account?</Link>
      </div>
    </div>
  )
}