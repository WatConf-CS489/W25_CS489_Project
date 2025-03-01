"use client";

import { API_URL } from "@/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { startRegistration } from "@simplewebauthn/browser";
import useHash from "@/utils/useHash";

function parseHash(hash: string) {
  if (!hash.startsWith("#")) {
    return null;
  }
  const searchParams = new URLSearchParams(hash.slice(1));
  return searchParams.get("ticket");
}

export default function Page() {
  const params = useHash();
  const ticketPayload = params && parseHash(params);

  return ticketPayload ? <TicketView ticketPayload={ticketPayload} /> : <>
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      Error: Missing ticket
    </div>
  </>;
}

function TicketView({ ticketPayload }: { ticketPayload: string }) {
  const [ticket, signature] = ticketPayload.split(".");

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [remember, setRemember] = useState(false);

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
        ticket: ticket,
        ticket_signature: signature,
        remember,
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
        <h1 className="text-2xl font-semibold">Finish Registration</h1>
        <div>
          <p className="text-gray-500">
            We cannot tie your email to your username. For added anonymity, we recommend
            saving this link and coming back after midnight to finish registration.
          </p>
        </div>
        <input
          type="text"
          name="username"
          autoComplete="off"
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
          Register
        </button>
      </form>
    </>
  );
}
