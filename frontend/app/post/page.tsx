"use client";

import { API_URL } from "@/constants";
import { useCallback, useState } from "react";
import React from "react";

import ContentWrapper from "../components/ContentWrapper";
import PageHeader from "../components/PageHeader";
import { BoldText, MainContent } from "../components/Utils"

import { Alert, Button, Snackbar, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";

export default function Page() {
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const submit = useCallback(
    async (content: string | null) => {
      try {
        const response = await fetch(`${API_URL}/post`, {
          method: "POST",
          body: JSON.stringify({ content }),
        });
        if (response.ok) {
          setSuccess(true);
          setLoading(false);
          setContent("");
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await submit(content);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh" }}>
        <PageHeader hasPostButton={false} />
        <ContentWrapper>
          <Typography variant="h3" marginTop="45px" marginBottom="40px">
            <BoldText>Post</BoldText>
          </Typography>
          <MainContent>
            <Typography variant="h6" align="center" marginTop="30px">
              <BoldText>Make a post</BoldText>
            </Typography>
            <Typography variant="body1" align="center" marginTop="30px" marginLeft="30px" marginRight="30px">
              Before submitting, please ensure your post contains only respectful and relevant content. Posts cannot be edited or removed after submitting.
            </Typography>
            <form onSubmit={(e) => handleSubmit(e)}>
              <Stack
                className="bg-white rounded-lg shadow-xl px-10 py-12"
                spacing={1}
              >
                <TextField
                  className="bg-slate-100"
                  label="Write your confession..."
                  variant="outlined"
                  multiline
                  minRows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <Button
                  type="submit"
                  loading={loading}
                  variant="contained"
                  sx={{ backgroundColor: "#3A3A3A" }}
                >
                  Post
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
                      Confession successfully posted.
                    </Alert>
                  ) : undefined}
                </Snackbar>
              </Stack>
            </form>
          </MainContent>
        </ContentWrapper>
      </Box>
    </>
  );
}
