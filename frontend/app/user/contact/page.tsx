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
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
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
        <PageHeader hasPostButton={true} isMod={false} />
        <ContentWrapper>
          <Typography variant="h3" marginTop="45px" marginBottom="40px">
            <BoldText>Contact us</BoldText>
          </Typography>
          <MainContent>
            <Typography variant="h6" align="center" marginTop="30px">
              <BoldText>Tell us your feedback</BoldText>
            </Typography>
            <Typography
              variant="body1"
              align="center"
              marginTop="30px"
              marginLeft="30px"
              marginRight="30px"
            >
              Please include as much information as possible.
            </Typography>
            <form onSubmit={(e) => handleSubmit(e)}>
              <Stack
                className="bg-white rounded-lg shadow-xl px-10 py-12"
                spacing={1}
              >
                <TextField
                  className="bg-slate-100"
                  label="Optional Email"
                  variant="outlined"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  className="bg-slate-100"
                  variant="outlined"
                  multiline
                  minRows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <Button
                  type="submit"
                  loading={loading}
                  variant="contained"
                  sx={{ backgroundColor: "#3A3A3A" }}
                >
                  Send Report
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
                      Feedback successfully sent.
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
