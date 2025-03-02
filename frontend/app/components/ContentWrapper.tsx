"use client";

import { Box } from "@mui/system";

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", minWidth: "40vw" }}>
      {children}
    </Box>
  );
}