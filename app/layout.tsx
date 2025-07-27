import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/navigation/Navbar";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SnackbarProvider } from "@/components/snackbar/SnackbarProvider";
import theme from "@/lib/theme/theme";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <SnackbarProvider>
              <AuthProvider>
                <Navbar />
                <main>{children}</main>
              </AuthProvider>
            </SnackbarProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
