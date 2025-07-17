'use client'
import Header from './components/Header';
import { createTheme, ThemeProvider } from '@mui/material';
import PrefetchImages from './components/PrefetchImages';
import PrefetchSignInLink from './components/PrefetchSignInLink';
import StoreProvider from '@/lib/StoreProvider';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2f2f2f'
    },
    secondary: {
      main: '#fff'
    }
  }
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
            <StoreProvider>


              <PrefetchImages />
              <PrefetchSignInLink />

              <Header />
              {children}

            </StoreProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
