"use client";

import { API_URL } from "@/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { startAuthentication } from "@simplewebauthn/browser";
import Button from "@mui/material/Button";

export default function Page() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [remember, setRemember] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/auth/login/start`, {
      method: "POST",
      body: JSON.stringify({ username }),
    });
    const { challenge_id, options } = await response.json();
    const credential = await startAuthentication({
      optionsJSON: JSON.parse(options),
    });
    const finishResponse = await fetch(`${API_URL}/auth/login/finish`, {
      method: "POST",
      body: JSON.stringify({
        credential: JSON.stringify(credential),
        challenge_id,
        remember,
      }),
    });
    const finishResponseJson = await finishResponse.json();
    if (finishResponseJson.verified) {
      router.push("/");
    } else {
      console.error("Login failed", { finishResponseJson });
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
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            className="h-4 w-4"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />{" "}
          <label htmlFor="remember">Remember me</label>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Log in
        </button>
        <Button variant="contained">
          Nonfunctional button
        </Button>
        <a
          href="/register"
          className="text-blue-500 hover:text-blue-600 transition-colors"
        >
          Register
        </a>
      </form>
    </>
  );
}
