"use client";

import { API_URL } from "@/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import * as yup from "yup";

import ContentWrapper from "@/components/ContentWrapper";
import PageHeader from "@/components/PageHeader";

import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  List,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { BoldText } from "@/components/Utils";

const reportSchema = yup.object({
  id: yup.number().required(),
  reporter_id: yup.string().required(),
  reportee_id: yup.string().required(),
  post_id: yup.string().required(),
});

const responseSchema = yup.array().of(reportSchema).required();

type ReportType = yup.InferType<typeof reportSchema>;

const postReportSchema = yup.object({
  content: yup.string().required(),
});

export default function Page() {
  const queryClient = useQueryClient();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [postData, setPostData] = useState<{ [key: string]: string }>({});
  const [reportData, setReportData] = useState<{ [key: number]: string }>({});
  const [postLoadingStarted, setPostLoadingStarted] = useState<{
    [key: string]: boolean;
  }>({});
  const [reportLoadingStarted, setReportLoadingStarted] = useState<{
    [key: number]: boolean;
  }>({});

  const temp_fallback_reports: ReportType[] = [
    {
      id: 1,
      reporter_id: "1",
      reportee_id: "3",
      post_id: "4",
    },
    {
      id: 2,
      reporter_id: "2",
      reportee_id: "4",
      post_id: "10",
    },
  ];

  const handlePostHover = useCallback(
    async (postId: string) => {
      // Don't re-load something that's already loaded (or loading)
      // I think there's still a race condition but don't look too hard
      if (postLoadingStarted[postId]) return;
      setPostLoadingStarted((prevMap) => ({
        ...prevMap,
        [postId]: true,
      }));

      try {
        const response = await fetch(`${API_URL}/moderation/post-text`, {
          method: "GET",
          body: JSON.stringify({ post_id: postId }),
        });
        if (response.ok) {
          const content = await postReportSchema.validate(
            await response.json()
          );
          setPostData((prevMap) => ({
            ...prevMap,
            [postId]: content.content,
          }));
        } else {
          setError(true);
          setPostLoadingStarted((prevMap) => ({
            ...prevMap,
            [postId]: false,
          }));
        }
      } catch (e) {
        setError(true);
        setPostLoadingStarted((prevMap) => ({
          ...prevMap,
          [postId]: false,
        }));
      }
    },
    [postData, postLoadingStarted]
  );

  const handleReportHover = useCallback(
    async (reportId: number) => {
      if (reportLoadingStarted[reportId]) return;
      setReportLoadingStarted((prevMap) => ({
        ...prevMap,
        [reportId]: true,
      }));

      try {
        const response = await fetch(`${API_URL}/moderation/report-text`, {
          method: "GET",
          body: JSON.stringify({ report_id: reportId }),
        });
        if (response.ok) {
          const content = await postReportSchema.validate(
            await response.json()
          );
          setReportData((prevMap) => ({
            ...prevMap,
            [reportId]: content.content,
          }));
        } else {
          setError(true);
          setReportLoadingStarted((prevMap) => ({
            ...prevMap,
            [reportId]: false,
          }));
        }
      } catch (e) {
        setError(true);
        setReportLoadingStarted((prevMap) => ({
          ...prevMap,
          [reportId]: false,
        }));
      }
    },
    [reportData, reportLoadingStarted]
  );

  const fetchReports = async () => {
    try {
      const response = await fetch(`${API_URL}/moderation/reports`);
      if (!response.ok) {
        throw new Error();
      }
      return await responseSchema.validate(await response.json());
    } catch (e) {
      console.error(e);
      setError(true);
      return temp_fallback_reports;
    }
  };

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: fetchReports,
  });

  const dismissReport = (postId: string) => {
    queryClient.setQueryData(["user"], (oldData: ReportType[]) => {
      if (!oldData) return oldData;
      return oldData.filter((report: ReportType) => report.post_id !== postId);
    });
  };

  const removePost = useCallback(async (postId: string) => {
    try {
      const response = await fetch(`${API_URL}/moderation/remove-post`, {
        method: "POST",
        body: JSON.stringify({ post_id: postId }),
      });
      if (response.ok) {
        setSuccess(true);
        dismissReport(postId);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  }, []);

  const HeaderBox = styled(Box)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: "30px",
    marginBottom: "10px",
  });

  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <PageHeader hasPostButton={true} />
        <ContentWrapper>
          <HeaderBox>
            <Typography variant="h6" component="div">
              <BoldText>Report dashboard</BoldText>
            </Typography>
          </HeaderBox>
          {data ? (
            <TableContainer sx={{ width: "60%" }}>
              <Box
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: "20px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                <Table sx={{ minWidth: 500 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="center"
                        sx={{ borderBottom: "1px solid #000000" }}
                      >
                        <BoldText>Reporter UID</BoldText>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderBottom: "1px solid #000000" }}
                      >
                        <BoldText>Reported UID</BoldText>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderBottom: "1px solid #000000" }}
                      >
                        <BoldText>Details</BoldText>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderBottom: "1px solid #000000" }}
                      >
                        <BoldText>Actions</BoldText>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          border: 0,
                          alignItems: "center",
                        }}
                      >
                        <TableCell
                          align="center"
                          sx={{ borderBottom: "transparent" }}
                        >
                          {row.reporter_id}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ borderBottom: "transparent" }}
                        >
                          {row.reportee_id}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            borderBottom: "transparent",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Tooltip
                              title={
                                postData[row.post_id] ? (
                                  postData[row.post_id]
                                ) : (
                                  <CircularProgress size={20} />
                                )
                              }
                              onOpen={() => handlePostHover(row.post_id)}
                              arrow
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  marginRight: "20px",
                                  textDecoration: "underline",
                                }}
                                component="p"
                              >
                                Read post
                              </Typography>
                            </Tooltip>
                            <Tooltip
                              title={
                                reportData[row.id] ? (
                                  reportData[row.id]
                                ) : (
                                  <CircularProgress size={20} />
                                )
                              }
                              onOpen={() => handleReportHover(row.id)}
                              arrow
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  marginLeft: "20px",
                                  textDecoration: "underline",
                                }}
                                component="p"
                              >
                                Read report
                              </Typography>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ borderBottom: "transparent" }}
                        >
                          <Tooltip
                            title="Dismiss report"
                            sx={{ marginRight: "10px" }}
                            arrow
                          >
                            <IconButton
                              onClick={() => dismissReport(row.post_id)}
                            >
                              <RemoveCircleOutlineIcon
                                sx={{ color: "#ff0000" }}
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title="Hide post"
                            sx={{ marginLeft: "10px" }}
                            arrow
                          >
                            <IconButton onClick={() => removePost(row.post_id)}>
                              <DeleteIcon sx={{ color: "#ff0000" }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </TableContainer>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <CircularProgress />
            </Box>
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
                Post removed successfully.
              </Alert>
            ) : undefined}
          </Snackbar>
        </ContentWrapper>
      </Box>
    </>
  );
}
