import { Alert, Button, Snackbar } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/constants";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const router = useRouter();

  async function logout() {
    setLoading(true);
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

  return (
    <>
      <Button
        type="submit"
        loading={loading}
        variant="contained"
        onClick={logout}
        sx={{
          backgroundColor: "#3A3A3A",
          color: "#FFFFFF",
          width: "50%",
          alignSelf: "center",
        }}
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
          Failed to logout.
        </Alert>
      </Snackbar>
    </>
  );
}
