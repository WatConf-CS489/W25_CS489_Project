"use client";

import { Box, styled } from "@mui/system";

export const MainContent = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "40%",
  backgroundColor: "#ffffff",
  opacity: 0.9,
  borderRadius: "10px",
});

export const BoldText = styled(Box)({
  fontWeight: "bold",
  display: "inline",
});