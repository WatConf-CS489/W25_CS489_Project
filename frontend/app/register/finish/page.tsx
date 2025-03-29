"use client";

import { API_URL } from "@/constants";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";

import { startRegistration } from "@simplewebauthn/browser";
import useHash from "@/utils/useHash";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Link,
  Modal,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import sanitize from "@/utils/sanitize";
import { TERMS_AND_CONDITIONS } from "@/constants";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  bgcolor: "background.paper",
  boxShadow: 24,
  outline: "none",
  p: 4,
};

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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return ticketPayload ? (
    <TicketView ticketPayload={ticketPayload} />
  ) : (
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
          {
            // If this is the SSR pass, we'll hit this branch because the server
            // doesn't have access to the hash. It's only an error condition if
            // we're on the *client* and don't have a hash.
            isClient ? (
              <>
                <Typography>Error: Missing Ticket</Typography>
                <Divider variant="middle" className="p-2" />
                <Typography align="center">
                  <Link href="/" underline="hover">
                    Return to login
                  </Link>
                </Typography>
              </>
            ) : (
              <>
                <Typography align="center">Loading...</Typography>
              </>
            )
          }
        </Stack>
      </Container>
    </Container>
  );
}

function TicketView({ ticketPayload }: { ticketPayload: string }) {
  const [ticket, signature] = ticketPayload.split(".");

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const santizedUsername = sanitize(username);
      const startResponse = await fetch(`${API_URL}/auth/register/start`, {
        method: "POST",
        body: JSON.stringify({ username: santizedUsername }),
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
        setLoading(false);
        setError(true);
        console.error("Registration failed", { response });
      }
    } catch {
      setLoading(false);
      setError(true);
    }
  };

  const handleAgree = async (
    _: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    setAgree(true);
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
      <Modal open={!agree} disableEnforceFocus>
        <Stack sx={style} spacing={1}>
          <Typography align="center" variant="h4">
            Terms of Service
          </Typography>
          <Box
            sx={{
              overflowY: "scroll",
              height: "500px",
              backgroundColor: "#ECECEC",
              whiteSpace: "pre-wrap",
              paddingX: 2,
            }}
          >
            {TERMS_AND_CONDITIONS}
          </Box>
          <Button
            type="submit"
            loading={loading}
            variant="contained"
            sx={{ backgroundColor: "#3A3A3A" }}
            onClick={(e) => handleAgree(e)}
          >
            I agree
          </Button>
        </Stack>
      </Modal>
      <Container maxWidth="xs" sx={{ marginTop: 10 }}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <Stack
            className="bg-white rounded-lg shadow-xl px-10 py-12"
            spacing={1}
          >
            <Typography variant="h4" sx={{ marginTop: 5, marginBottom: 5 }}>
              Finish Registration
            </Typography>
            <Typography sx={{ marginTop: 10, marginBottom: 10 }}>
              We cannot tie your email to your username. For added anonymity, we
              recommend saving this link and coming back after midnight to
              finish registration.
            </Typography>
            <TextField
              className="bg-slate-100"
              label="Username"
              variant="outlined"
              autoComplete="off"
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
              disabled={!agree}
              type="submit"
              loading={loading}
              variant="contained"
              sx={{ backgroundColor: "#3A3A3A" }}
            >
              Register
            </Button>
            <Snackbar
              open={error}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              autoHideDuration={5000}
              onClose={() => setError(false)}
            >
              <Alert
                severity="error"
                variant="filled"
                sx={{ width: "100%" }}
                onClose={() => setError(false)}
              >
                <Typography>Registration has failed.</Typography>
              </Alert>
            </Snackbar>
          </Stack>
        </form>
      </Container>
    </Container>
  );
}
