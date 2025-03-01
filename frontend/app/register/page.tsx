"use client";

import { API_URL } from "@/constants";
import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const startResponse = await fetch(`${API_URL}/auth/verify/send`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    if (startResponse.ok) {
      setStatus("If this email is unregistered, you will receive next steps shortly.");
    } else {
      setStatus("Registration failed. Is the email valid?")
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-sm mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-semibold">Register</h1>
        <p className="text-gray-500">
          Enter your @uwaterloo.ca email.
        </p>
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Send Email
        </button>
        {status && <p>{status}</p>}
      </form>
    </>
  );
}
