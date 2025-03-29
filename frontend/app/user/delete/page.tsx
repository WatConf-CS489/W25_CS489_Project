"use client";

import { API_URL } from "@/constants";
import { useCallback, useState } from "react";
import React from "react";

import ContentWrapper from "../../components/ContentWrapper";
import PageHeader from "../../components/PageHeader";
import { BoldText, MainContent } from "../../components/Utils";
import sanitize from "@/utils/sanitize";

import {
  Alert,
  Button,
  Divider,
  Link,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";

export default function Page() {
  const [username, setUsername] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <PageHeader hasPostButton={true} />
        <ContentWrapper>
          <Typography variant="h3" marginTop="45px" marginBottom="40px">
            <BoldText>Delete Account</BoldText>
          </Typography>
          <MainContent>
            <form onSubmit={(e) => handleSubmit(e)}>
              <Stack
                className="bg-white rounded-lg shadow-xl px-10 py-12"
                spacing={1}
              >
                <Typography align="center" marginTop="30px">
                  <BoldText>
                    Are you sure you want to delete your account?
                  </BoldText>
                </Typography>
                <Typography color="error" align="center">
                  <BoldText>THIS ACTION CANNOT BE UNDONE</BoldText>
                </Typography>
                <TextField
                  className="bg-slate-100"
                  label="Username"
                  variant="outlined"
                  placeholder="Enter your username to confirm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <Button
                  type="submit"
                  loading={loading}
                  variant="contained"
                  sx={{ backgroundColor: "#3A3A3A" }}
                >
                  Delete Account
                </Button>
                <Snackbar
                  open={error || success}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  autoHideDuration={3000}
                  onClose={() => {
                    setError(false);
                    setSuccess(false);
                  }}
                >
                  {error ? (
                    <Alert
                      severity="error"
                      variant="filled"
                      sx={{ width: "100%" }}
                      onClose={() => setError(false)}
                    >
                      An error occurred.
                    </Alert>
                  ) : success ? (
                    <Alert
                      severity="success"
                      variant="filled"
                      sx={{ width: "100%" }}
                      onClose={() => setSuccess(false)}
                    >
                      Account has been deleted.
                    </Alert>
                  ) : undefined}
                </Snackbar>
                <Divider variant="middle" className="p-2" />
                <Typography align="center">
                  <Link href="/" underline="hover">
                    Never mind
                  </Link>
                </Typography>
              </Stack>
            </form>
          </MainContent>
        </ContentWrapper>
      </Box>
    </>
  );
}
