import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f7", // Apple Light Grey
      }}
    >
      <Link href="/" style={{ textDecoration: 'none', marginBottom: '2rem' }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#1d1d1f', letterSpacing: '-0.5px' }}>
          Woodsphere.
        </Typography>
      </Link>
      
      <Container maxWidth="xs">
        {children}
      </Container>
    </Box>
  );
}