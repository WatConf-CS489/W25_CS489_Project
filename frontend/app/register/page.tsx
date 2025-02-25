"use client";

import { API_URL } from "@/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { startRegistration } from "@simplewebauthn/browser";

export default function Page() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const startResponse = await fetch(`${API_URL}/auth/register/start`, {
      method: "POST",
      body: JSON.stringify({ username }),
    });
    const { challenge_id: challengeID, options } = await startResponse.json();
    const credential = await startRegistration({
      optionsJSON: JSON.parse(options),
    });
    const finishResponse = await fetch(`${API_URL}/auth/register/finish`, {
      method: "POST",
      body: JSON.stringify({
        credential: JSON.stringify(credential),
        challenge_id: challengeID,
      }),
    });
    const response = await finishResponse.json();
    if (response.verified) {
      router.push("/");
    } else {
      console.error("Registration failed", { response });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-sm mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
      >
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Username"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Register
        </button>
      </form>
    </>
  );
}
