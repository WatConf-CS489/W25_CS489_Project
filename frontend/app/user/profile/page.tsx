"use client";

import { API_URL } from "@/constants";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import ContentWrapper from "../../components/ContentWrapper";
import PageHeader from "../../components/PageHeader";
import LogoutButton from "@/components/LogoutButton";
import { BoldText, MainContent } from "../../components/Utils";

import { Alert, Divider, Snackbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";

export default function Page() {
  const [error, setError] = useState(false);

  const fetchUsername = async () => {
    const response = await fetch(`${API_URL}/profile`);
    try {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    } catch {
      setError(true);
      return { username: "temp_fallback" };
    }
  };

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUsername,
  });

  // Wait for username to render
  if (!data?.username) {
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
        <PageHeader hasPostButton={true} isMod={false} />
        <ContentWrapper>
          <Typography variant="h3" marginTop="45px" marginBottom="40px">
            <BoldText>User homepage</BoldText>
          </Typography>
          <MainContent minWidth="40vw">
            <Typography
              variant="h6"
              align="center"
              marginTop="30px"
              marginLeft="30px"
              marginRight="30px"
            >
              <BoldText>
                You&#39;re logged in as an anonymous member of WatConfessions.
              </BoldText>
            </Typography>
            <Box
              display="flex"
              flexDirection="row"
              marginTop="30px"
              marginBottom="30px"
              justifyContent="center"
            >
              <Typography variant="body1">
                Username (invisible to others):&nbsp;
              </Typography>
              <BoldText>{data?.username ?? ""}</BoldText>
            </Box>
            <LogoutButton />
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
                An error occurred.
              </Alert>
            </Snackbar>
            <Divider variant="middle" className="p-2" />
            <Typography align="center" marginTop="30px">
              <Link href="mailto:watconfessions@gmail.com">Contact us</Link>
            </Typography>
            <Typography align="center" margin="20px" color="#ff0000">
              <Link href="/user/delete">Delete account</Link>
            </Typography>
          </MainContent>
        </ContentWrapper>
      </Box>
    </>
  );
}
