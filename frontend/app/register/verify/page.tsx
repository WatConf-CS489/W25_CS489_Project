"use client";

import { API_URL } from "@/constants";
import { Container, Stack, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function toHexString(byteArray: Uint8Array) {
  return Array.from(byteArray)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function fromHexString(hexString: string) {
  return new Uint8Array(
    hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
}

const publicKeyPromise = (async () => {
  return await crypto.subtle.importKey(
    "jwk",
    {
      alg: "PS384",
      e: "AQAB",
      ext: true,
      key_ops: ["verify"],
      kty: "RSA",
      n: "pQmF0SprIYPPHgJuGJxYEVZ7FV2pDy_sXww0Oq7MdZzfW2DVZy4yCqWgUFDIu3aGIxxXpjeF52Pa1IK3vMFrf8609CIBHtHd2ndaE_CGyJM7amYwyDUO02dYZXrWibJkd1Xz61Yp4gNF15JUft5t18PakcW8moj6ZWgXHXdYQ8IK5AvIWxTDPBErsDk7OuaXlWtQsKQBGnGssvUZirMccyTPmhye5Kj6c27c0MxWG2yFwijKYGMhkLBU6JLH_uPiIYq-ZrgT_YZSHwwAZpKiCAFlzlPgRk8Jf_oJXtjPMSrIgXvjUKzLuMw-Uc1zQ7bHkW7bcV0tRcob10hRF9TMMQ",
    },
    { name: "RSA-PSS", hash: "SHA-384" },
    true,
    ["verify"]
  );
})();

async function blind(ticket: string) {
  // for some reason having this as a static import causes a Webpack error during HMR:
  // > TypeError: undefined is not an object (evaluating 'chunkIds.length')
  const { RSABSSA } = await import("@cloudflare/blindrsa-ts");
  const suite = RSABSSA.SHA384.PSS.Deterministic();
  const prepared = suite.prepare(new TextEncoder().encode(ticket));
  const publicKey = await publicKeyPromise;
  const { blindedMsg, inv } = await suite.blind(publicKey, prepared);
  return {
    blinded: toHexString(blindedMsg),
    unblind: async (response: string) => {
      const finalized = await suite.finalize(
        publicKey,
        prepared,
        fromHexString(response),
        inv
      );
      return toHexString(finalized);
    },
  };
}

export default function Page() {
  return (
    <Container className="h-screen flex flex-col justify-center">
      <Typography
        align="center"
        variant="h1"
        sx={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          userSelect: "none",
        }}
      >
        WATConfessions
      </Typography>
      <Container maxWidth="xs" sx={{ marginTop: 10 }}>
        <Stack
          className="bg-white rounded-lg shadow-xl px-10 py-12"
          spacing={1}
        >
          <Suspense fallback={<Typography>Loading...</Typography>}>
            <Verifier />
          </Suspense>
        </Stack>
      </Container>
    </Container>
  );
}

function Verifier() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";

  useEffect(() => {
    async function verify() {
      const ticket = crypto.randomUUID();
      const blinded = await blind(ticket);
      const confirmResponse = await fetch(`${API_URL}/auth/verify/confirm`, {
        method: "POST",
        body: JSON.stringify({
          code,
          blinded_ticket: blinded.blinded,
        }),
      });
      const { signed_ticket: signedBlindedTicket } =
        await confirmResponse.json();
      if (!signedBlindedTicket) {
        setError("Invalid code. Has it already been used?");
        return;
      }
      const signedTicket = await blinded.unblind(signedBlindedTicket);
      const payload = `${ticket}.${signedTicket}`;
      // we use the fragment to avoid leaking the ticket in the URL
      router.push(
        `/register/finish#${new URLSearchParams({
          ticket: payload,
        }).toString()}`
      );
    }
    verify();
  }, [code, router]);

  return <Typography>{error ? error : "Verifying..."}</Typography>
}
