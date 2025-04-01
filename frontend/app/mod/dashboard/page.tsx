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
  Modal,
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
import { Box, Stack, styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { BoldText } from "@/components/Utils";

const reportSchema = yup.object({
  id: yup.number().required(),
  reporter_id: yup.string().required(),
  reportee_id: yup.string().required(),
  post_id: yup.string().required(),
  post_content: yup.string().required(),
  reason: yup.string().required(),
});

const responseSchema = yup.array().of(reportSchema).required();

type ReportType = yup.InferType<typeof reportSchema>;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "25%",
  bgcolor: "#ffffff",
  boxShadow: 24,
  outline: "none",
  p: 4,
};

export default function Page() {
  const queryClient = useQueryClient();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [rowId, setRowId] = useState(0);
  const [postId, setPostId] = useState("");
  const [dismissOpen, setDismissOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const temp_fallback_reports: ReportType[] = [
    {
      id: 1,
      reporter_id: "1",
      reportee_id: "3",
      post_id: "4",
      post_content: "post text 1",
      reason: "report text 1",
    },
    {
      id: 2,
      reporter_id: "2",
      reportee_id: "4",
      post_id: "10",
      post_content: "post text 2",
      reason: "report text 2",
    },
  ];

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

  const dismissReport = useCallback(async (reportId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/moderation/resolve-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ report_id: reportId }),
      });
      if (response.ok) {
        // Also remove it from frontend
        queryClient.setQueryData(["user"], (oldData: ReportType[]) => {
          if (!oldData) return oldData;
          return oldData.filter((report: ReportType) => report.id !== reportId);
        });
        setSuccess(true);
        setLoading(false);
        setDismissOpen(false);
      } else {
        setError(true);
        setLoading(false);
        setDismissOpen(false);
      }
    } catch {
      setError(true);
      setLoading(false);
      setDismissOpen(false);
    }
  }, []);

  const removePost = useCallback(async (postId: string, reportId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/moderation/remove-post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id: postId }),
      });
      if (response.ok) {
        dismissReport(reportId);
        setDeleteOpen(false);
      } else {
        setError(true);
        setLoading(false);
        setDeleteOpen(false);
      }
    } catch {
      setError(true);
      setLoading(false);
      setDeleteOpen(false);
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
        <PageHeader hasPostButton={true} isMod={true} />
        <ContentWrapper>
          <HeaderBox>
            <Typography variant="h3" component="div">
              <BoldText>Report dashboard</BoldText>
            </Typography>
          </HeaderBox>
          {data && data.length !== 0 ? (
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
                          <Tooltip title={row.reporter_id} arrow>
                            <Typography
                              variant="body1"
                              sx={{ textDecoration: "underline" }}
                              component="p"
                            >
                              {row.reporter_id.length > 8
                                ? row.reporter_id.substring(0, 8)
                                : row.reporter_id}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ borderBottom: "transparent" }}
                        >
                          <Tooltip title={row.reportee_id} arrow>
                            <Typography
                              variant="body1"
                              sx={{ textDecoration: "underline" }}
                              component="p"
                            >
                              {row.reportee_id.length > 8
                                ? row.reportee_id.substring(0, 8)
                                : row.reportee_id}
                            </Typography>
                          </Tooltip>
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
                            <Tooltip title={row.post_content} arrow>
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
                            <Tooltip title={row.reason} arrow>
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
                              onClick={() => {
                                setRowId(row.id);
                                setDismissOpen(true);
                              }}
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
                            <IconButton
                              onClick={() => {
                                setRowId(row.id);
                                setPostId(row.post_id);
                                setDeleteOpen(true);
                              }}
                            >
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
          ) : data ? (
            <Typography variant="body1" sx={{ marginTop: "20px" }}>
              Nothing to see here, for now...
            </Typography>
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
          <Modal open={dismissOpen} disableEnforceFocus>
            <Stack sx={style} spacing={1}>
              <Typography align="center" variant="h4">
                Are you sure you want to dismiss this report?
              </Typography>
              <Button
                type="submit"
                loading={loading}
                variant="contained"
                sx={{ backgroundColor: "#FF0000", color: "#000000" }}
                onClick={() => dismissReport(rowId)}
              >
                Yes, dismiss it
              </Button>
              <Button
                type="submit"
                loading={loading}
                variant="outlined"
                sx={{ color: "#3A3A3A" }}
                onClick={() => setDismissOpen(false)}
              >
                No, never mind
              </Button>
            </Stack>
          </Modal>
          <Modal open={deleteOpen} disableEnforceFocus>
            <Stack sx={style} spacing={1}>
              <Typography align="center" variant="h4">
                Are you sure you want to delete this post?
              </Typography>
              <Button
                type="submit"
                loading={loading}
                variant="contained"
                sx={{ backgroundColor: "#FF0000", color: "#000000" }}
                onClick={() => removePost(postId, rowId)}
              >
                Yes, delete it
              </Button>
              <Button
                type="submit"
                loading={loading}
                variant="outlined"
                sx={{ color: "#3A3A3A" }}
                onClick={() => setDeleteOpen(false)}
              >
                No, never mind
              </Button>
            </Stack>
          </Modal>
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
                Action performed successfully.
              </Alert>
            ) : undefined}
          </Snackbar>
        </ContentWrapper>
      </Box>
    </>
  );
}
