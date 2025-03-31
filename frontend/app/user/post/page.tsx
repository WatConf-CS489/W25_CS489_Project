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
  Modal,
  Snackbar,
  TextField,
  Typography,
  Box,
  Stack,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "25%",
  bgcolor: "background.paper",
  boxShadow: 24,
  outline: "none",
  p: 4,
};

export default function Page() {
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);

  const [submit, setSubmit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const postConfession = useCallback(async (content: string | null) => {
    setOpen(false);
    setLoading(true);
    try {
      const sanitizedContent = sanitize(content);
      const response = await fetch(`${API_URL}/post`, {
        method: "POST",
        body: JSON.stringify({ content: sanitizedContent }),
      });
      if (response.ok) {
        setSuccess(true);
        setLoading(false);
        setContent("");
        setSubmit(true);
      } else {
        setError(true);
        setLoading(false);
      }
    } catch {
      setError(true);
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpen(true);
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
        <PageHeader hasPostButton={false} isMod={false} />
        <ContentWrapper>
          <Typography variant="h3" marginTop="45px" marginBottom="40px">
            <BoldText>Post</BoldText>
          </Typography>
          <MainContent>
            {submit ? (
              <>
                <Typography variant="h6" align="center" marginTop="30px">
                  <BoldText>Thank you!</BoldText>
                </Typography>
                <Stack
                  className="bg-white rounded-lg shadow-xl px-10 py-12"
                  spacing={1}
                >
                  <Typography
                    variant="body1"
                    align="center"
                    marginTop="30px"
                    marginLeft="30px"
                    marginRight="30px"
                  >
                    Your confession has been submitted.
                  </Typography>
                </Stack>
              </>
            ) : (
              <>
                <Typography variant="h6" align="center" marginTop="30px">
                  <BoldText>Make a post</BoldText>
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  marginTop="30px"
                  marginLeft="30px"
                  marginRight="30px"
                >
                  Before submitting, please ensure your post contains only
                  respectful and relevant content.
                </Typography>
                <form onSubmit={(e) => handleSubmit(e)}>
                  <Stack
                    className="bg-white rounded-lg shadow-xl px-10 py-12"
                    spacing={1}
                  >
                    <Typography color="error" align="center">
                      Posts cannot be edited or removed after submitting.
                    </Typography>
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
                  </Stack>
                </form>
                <Modal open={open} disableEnforceFocus>
                  <Stack sx={style} spacing={1}>
                    <Typography align="center" variant="h4">
                      Are you sure you want to submit your confession?
                    </Typography>
                    <Typography color="error" align="center">
                      <BoldText>
                        Posts cannot be edited or removed after submitting.
                      </BoldText>
                    </Typography>
                    <Button
                      type="submit"
                      loading={loading}
                      variant="contained"
                      sx={{ backgroundColor: "#3A3A3A" }}
                      onClick={() => postConfession(content)}
                    >
                      Yes I want to confess
                    </Button>
                    <Button
                      type="submit"
                      loading={loading}
                      variant="outlined"
                      sx={{ color: "#3A3A3A" }}
                      onClick={() => setOpen(false)}
                    >
                      Actually, let me think...
                    </Button>
                  </Stack>
                </Modal>
              </>
            )}
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
          </MainContent>
        </ContentWrapper>
      </Box>
    </>
  );
}
