"use client";

import {useState, useEffect} from "react";
import {signIn} from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();
  const {data: session, status} = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router])

  const handleSubmit = async(event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false
    });

    if (res?.error) {
      setError(res.error);
    }

    if (res?.ok) {
      return router.push('/');
    }
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="flex justify-center items-center pt-56">
    <form onSubmit={handleSubmit} className="form-background font-bold">
      <div className="flex flex-col items-center px-5 py-5 space-y-5">
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex flex-col">
          <label htmlFor="email">Email (uncc/charlotte.edu)</label>
          <input type="email" placeholder="Email" id="email" name="email" className="form-input"/>
        </div>

        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Password" id="password" name="password" className="form-input"/>
        </div>

        <button className="uncc-form-button p-3 text-white font-bold">Sign In</button>
      </div>
    </form>
    </div>
  );
}
