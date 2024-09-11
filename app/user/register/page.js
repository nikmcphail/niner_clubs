"use client";
import {FormEvent, useRef, useState} from 'react';
import {useRouter} from "next/navigation";
import Link from "next/link";
import { register } from '@/app/action/register';

export default function Register() {
  const [error, setError] = useState("");
  const router = useRouter();
  const ref = useRef(null);

  const handleSubmit = async(formData) => {
    const reg = await register({
      firstname: formData.get("firstname"),
      lastname: formData.get("lastname"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    ref.current?.reset();
    if (reg?.error) { 
      setError(reg.error);
      return;
    } else {
      return router.push('/user/login');
    }
  };

  return (
    <div className="flex justify-center items-center pt-56">
      <form ref={ref} action={handleSubmit} className="form-background font-bold">
        <div className="flex flex-col items-center px-5 py-5 space-y-5">
          {error && <div className="">{error}</div>}
          <div className="flex flex-col">
            <label htmlFor="firstname">First Name</label>
            <input type="text" placeholder="John" id="firstname" name="firstname" className="form-input" required/>
          </div>

          <div className="flex flex-col">
            <label htmlFor="lastname">Last Name</label>
            <input type="text" placeholder='Doe' id="lastname" name="lastname" className="form-input" required/>
          </div>

          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input type="email" pattern="^[a-zA-Z0-9._%+\-]+@(uncc\.edu|charlotte\.edu)$" id="email" name="email" placeholder="johndoe@charlotte.edu" className="form-input" required/>
          </div>

          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input type="password" placeholder="Password" id="password" name="password" className="form-input" required/>
          </div>

          <button className="uncc-form-button p-3 text-white font-bold">Sign Up</button>
        </div>
      </form>
    </div>
  )
}