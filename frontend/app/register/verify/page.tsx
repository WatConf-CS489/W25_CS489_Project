"use client";

import { API_URL } from "@/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function blind(ticket: string) {
  // TODO: crypto: implement
  return {
    blinded: ticket,
    unblind: (response: string) => response
  };
}

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";

  useEffect(() => {
    async function verify() {
      const ticket = crypto.randomUUID();
      const blinded = blind(ticket);
      const confirmResponse = await fetch(`${API_URL}/auth/verify/confirm`, {
        method: "POST",
        body: JSON.stringify({
          code,
          blinded_ticket: blinded.blinded,
        }),
      });
      const { signed_ticket: signedBlindedTicket } = await confirmResponse.json();
      if (!signedBlindedTicket) {
        setError("Invalid code. Has it already been used?");
        return;
      }
      const signedTicket = blinded.unblind(signedBlindedTicket);
      const payload = `${ticket}.${signedTicket}`
      // we use the fragment to avoid leaking the ticket in the URL
      router.push(`/register/finish#${new URLSearchParams({ ticket: payload }).toString()}`);
    }
    verify();
  }, [code, router]);

  return (
    <>
      <div className="flex flex-col gap-4 max-w-sm mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold">Verify Email</h1>
        {
          error ? (
            <p>{error}</p>
          ) : (
            <p>Verifying...</p>
          )
        }
      </div>
    </>
  );
}
