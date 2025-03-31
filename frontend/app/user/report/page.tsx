"use client";

import { API_URL } from "@/constants";
import { useCallback, useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import moment from "moment";

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
  const router = useRouter();
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);

  const [submit, setSubmit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [postText, setPostText] = useState("");
  const [postTime, setPostTime] = useState(0);
  const [postId, setPostId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const details = sessionStorage.getItem("reportDetails");

      if (!details) {
        router.push("/user/dashboard");
      } else {
        const detailsJson = JSON.parse(details);
        setPostText(detailsJson["content"]);
        setPostTime(detailsJson["time"]);
        setPostId(detailsJson["id"]);
      }
    }
  }, [router]);

  const reportPost = useCallback(
    async (content: string | null) => {
      setOpen(false);
      setLoading(true);
      try {
        const sanitizedContent = sanitize(content);
        const response = await fetch(`${API_URL}/report`, {
          method: "POST",
          body: JSON.stringify({
            post_id: postId,
            reason: sanitizedContent,
          }),
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
    },
    [postId]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpen(true);
  };

  // Force wait until post text, time, ID all retrieved
  if (!postId) {
    return null;
  }

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
            <BoldText>Report</BoldText>
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
                    The report has been submitted.
                  </Typography>
                </Stack>
              </>
            ) : (
              <>
                <Typography
                  variant="h6"
                  align="center"
                  marginTop="30px"
                  marginLeft="20px"
                  marginRight="20px"
                >
                  <BoldText>
                    Are you sure you want to report this post from{" "}
                    {moment.unix(postTime).fromNow()}?
                  </BoldText>
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  marginTop="30px"
                  marginLeft="30px"
                  marginRight="30px"
                >
                  {postText}
                </Typography>
                <form onSubmit={(e) => handleSubmit(e)}>
                  <Stack
                    className="bg-white rounded-lg shadow-xl px-10 py-12"
                    spacing={1}
                  >
                    <Typography align="center" component="div">
                      <BoldText>
                        Tell us in a few words what is wrong about this
                        confession.
                      </BoldText>
                    </Typography>
                    <TextField
                      className="bg-slate-100"
                      label="Your explanation..."
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
                      sx={{ backgroundColor: "#FF0000", color: "#000000" }}
                    >
                      Report post
                    </Button>
                  </Stack>
                </form>
                <Modal open={open} disableEnforceFocus>
                  <Stack sx={style} spacing={1}>
                    <Typography align="center" variant="h4">
                      Are you sure you want to report this post?
                    </Typography>
                    <Button
                      type="submit"
                      loading={loading}
                      variant="contained"
                      sx={{ backgroundColor: "#FF0000", color: "#000000" }}
                      onClick={() => reportPost(content)}
                    >
                      Yes, report it
                    </Button>
                    <Button
                      type="submit"
                      loading={loading}
                      variant="outlined"
                      sx={{ color: "#3A3A3A" }}
                      onClick={() => setOpen(false)}
                    >
                      No, never mind
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
                  Report successfully submitted.
                </Alert>
              ) : undefined}
            </Snackbar>
          </MainContent>
        </ContentWrapper>
      </Box>
    </>
  );
}
