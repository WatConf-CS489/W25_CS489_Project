"use client";

import { AppBar, Button, IconButton, Link, Toolbar, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import PersonIcon from "@mui/icons-material/Person";

import { BoldText } from "./Utils";

const StickyHeader = styled(AppBar)({
  position: "sticky",
  top: 0,
  zIndex: 1017,
  height: "10vh",
  minHeight: "100px",
  backgroundColor: "#000000",
});

const StyledToolbar = styled(Toolbar)({
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
  padding: 0,
});

const LeftChild = styled(Box)({
  display: "flex",
  flexGrow: 1,
  paddingLeft: "3vw",
});

const RightChild = styled(Box)({
  display: "flex",
  paddingRight: "3vw",
});

const PostButton = styled(Button)({
  backgroundColor: "#eaab00",
  "&:hover": {
    backgroundColor: "#f2eda8",
  },
});

const ProfileButton = styled(IconButton)({
  color: "#000000",
  backgroundColor: "#d9d9d9",
  "&:hover": {
    backgroundColor: "#f2eda8",
  },
  width: "auto",
  display: "inline-flex",
  aspectRatio: "1",
});

export default function PageHeader({ hasPostButton }: { hasPostButton: boolean }) {
  return (
    <>
      <StickyHeader>
        <StyledToolbar>
          <LeftChild>
            <Typography variant="h4">
              <Link href="/dashboard" color="inherit" underline="none">
                WAT<BoldText>Confessions</BoldText>
              </Link>
            </Typography>
          </LeftChild>
          <RightChild>
            {hasPostButton &&
            <PostButton variant="contained" component="a" href="/post">
              <Box sx={{ paddingLeft: "1vw", paddingRight: "1vw" }}>
              <Typography variant="h6">
                <BoldText sx={{ color: "#000000" }}>Post</BoldText>
              </Typography>
              </Box>
            </PostButton>}
            <Box sx={{ display: "flex", marginLeft: "3vw" }}>
              <ProfileButton component="a" href="/user/profile">
                <PersonIcon sx={{ color: "#000000" }} />
              </ProfileButton>
            </Box>
          </RightChild>
        </StyledToolbar>
      </StickyHeader>
    </>
  );
}