"use client";

import { API_URL } from "@/constants";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import ContentWrapper from "../../components/ContentWrapper";
import PageHeader from "../../components/PageHeader";
import { BoldText, MainContent } from "../../components/Utils"

import { Alert, Button, Divider, Snackbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  
  const router = useRouter();

  async function logout() {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
    });
    if (response.ok) {
      router.push("/");
    } else {
      setError(true);
      setLoading(false);
    }
  }

  const fetchUsername = async () => {
    const response = await fetch(`${API_URL}/profile`);
    try {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
<<<<<<< HEAD
    } catch (error) {
=======
    } catch {
>>>>>>> origin/main
      setError(true);
      return {"username": "temp_fallback"};
    }
  }

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUsername,
  });

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh" }}>
        <PageHeader hasPostButton={true} />
        <ContentWrapper>
          <Typography variant="h3" marginTop="45px" marginBottom="40px">
            <BoldText>User homepage</BoldText>
          </Typography>
          <MainContent minWidth="40vw">
            <Typography variant="h6" align="center" marginTop="30px" marginLeft="30px" marginRight="30px">
              <BoldText>You&#39;re logged in as an anonymous member of WatConfessions.</BoldText>
            </Typography>
            <Box display="flex" flexDirection="row" marginTop="30px" marginBottom="30px" justifyContent="center">
              <Typography variant="body1">
                Username (invisible to others):&nbsp;
              </Typography>
              <BoldText>{data?.username ?? ""}</BoldText>
            </Box>
            <Button
              type="submit"
              loading={loading}
              variant="text"
              onClick={logout}
              sx={{ backgroundColor: "#3A3A3A", color: "#FFFFFF", width: "50%", alignSelf: "center" }}
            >
              Log out
            </Button>
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
<<<<<<< HEAD
              <Link href="/user/contact" underline="hover">
=======
              <Link href="/user/contact">
>>>>>>> origin/main
                Contact us
              </Link>
            </Typography>
            <Typography align="center" margin="20px" color="#ff0000">
<<<<<<< HEAD
              <Link href="/user/delete-account" underline="hover">
=======
              <Link href="/user/delete-account">
>>>>>>> origin/main
                Delete account
              </Link>
            </Typography>
          </MainContent>
        </ContentWrapper>
      </Box>
    </>
  );
}
