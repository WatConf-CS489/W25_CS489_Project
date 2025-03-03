"use client";

import { Container } from "@mui/system";

export default function ContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: "40vw",
      }}
    >
      {children}
    </Container>
  );
}
