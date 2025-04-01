"use client";

import { API_URL } from "@/constants";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import sanitize from "@/utils/sanitize";

import { startAuthentication } from "@simplewebauthn/browser";
import {
  Alert,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Link,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function Page() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (username: string | null) => {
      const santizedUsername = sanitize(username);
      try {
        const response = await fetch(`${API_URL}/auth/login/start`, {
          method: "POST",
          body: JSON.stringify({ username: santizedUsername }),
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
          router.push("/user/dashboard");
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        setError(true);
        setLoading(false);
      }
    },
    [router, remember]
  );

  useEffect(
    () => {
      submit(null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await submit(username);
  };

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
        <form onSubmit={(e) => handleSubmit(e)}>
          <Stack
            className="bg-white rounded-lg shadow-xl px-10 py-12"
            spacing={1}
          >
            <TextField
              className="bg-slate-100"
              label="Username"
              autoComplete="username webauthn"
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
              loading={loading}
              variant="contained"
              sx={{ backgroundColor: "#3A3A3A" }}
            >
              Log in
            </Button>
            <Snackbar
              open={error}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              autoHideDuration={3000}
              onClose={() => setError(false)}
            >
              <Alert
                severity="error"
                variant="filled"
                sx={{ width: "100%" }}
                onClose={() => setError(false)}
              >
                Login has failed.
              </Alert>
            </Snackbar>
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
