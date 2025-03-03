"use client";

import { API_URL } from "@/constants";
import {
  Alert,
  Button,
  Container,
  Divider,
  FormHelperText,
  Link,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const startResponse = await fetch(`${API_URL}/auth/verify/send`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    if (startResponse.ok) {
      setSuccess(true);
    } else {
      setError(true);
    }
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
            {success ? (
              <Typography>
                If this is your first time registering, you will receive an
                email with next steps shortly.
              </Typography>
            ) : (
              <>
                <Typography>Create your account</Typography>
                <TextField
                  className="bg-slate-100"
                  label="Email"
                  variant="outlined"
                  autoComplete="email"
                  placeholder="user@uwaterloo.ca"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormHelperText sx={{ marginTop: -1, marginBottom: 2 }}>
                  Enter your University of Waterloo email
                </FormHelperText>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ backgroundColor: "#3A3A3A" }}
                >
                  Send Email
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
                    <Typography>Registration has failed. </Typography>
                    <Typography>Are you using your Waterloo email?</Typography>
                  </Alert>
                </Snackbar>
              </>
            )}
            <Divider variant="middle" className="p-2" />
            <Typography align="center">
              Already have an account?{" "}
              <Link href="/" underline="hover">
                Log in!
              </Link>
            </Typography>
          </Stack>
        </form>
      </Container>
    </Container>
  );
}
