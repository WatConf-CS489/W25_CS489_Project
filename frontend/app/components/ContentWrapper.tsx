"use client";

import { Box } from "@mui/system";

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ backgroundColor: "#fed34c", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {children}
    </Box>
  );
}