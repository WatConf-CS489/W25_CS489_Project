"use client";

import { API_URL } from "@/constants";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { startAuthentication } from "@simplewebauthn/browser";
import {
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function Page() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [remember, setRemember] = useState(false);

  const submit = useCallback(
    async (username: string | null) => {
      try {
        const response = await fetch(`${API_URL}/auth/login/start`, {
          method: "POST",
          body: JSON.stringify({ username }),
        });
        const { challenge_id, options } = await response.json();
        const credential = await startAuthentication({
          optionsJSON: JSON.parse(options),
          useBrowserAutofill: username === null,
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
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Login aborted");
        } else {
          console.error("Login failed", { error });
        }
      }
    },
    [router, remember]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submit(username);
  };

  return (
    <Container className="h-screen flex flex-col justify-center">
      <Typography align="center" variant="h1" className="mb-10">
        WATConfessions
      </Typography>
      <Container maxWidth="xs">
        <form onSubmit={(e) => handleSubmit(e)}>
          <Stack
            className="bg-white rounded-lg shadow-xl px-10 py-12"
            spacing={1}
          >
            <TextField
              className="bg-slate-100"
              label="Username"
              variant="outlined"
              onChange={(e) => setUsername(e.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "#3A3A3A" }}
            >
              Log in
            </Button>
            <Divider variant="middle" className="p-2" />
            <Typography align="center">
              New to WATConfessions?{" "}
              <Link href="/register" underline="hover">
                Sign up!
              </Link>
            </Typography>
          </Stack>
        </form>
      </Container>
    </Container>
  );
}
