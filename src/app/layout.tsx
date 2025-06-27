'use client'
import { UrqlProvider } from '../lib/urqlClient'
import Header from './components/Header';
import { createTheme, ThemeProvider } from '@mui/material';
import PrefetchImages from './components/PrefetchImages';

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
        <UrqlProvider>
          <ThemeProvider theme={theme}>
            <PrefetchImages />
            <Header />
            {children}
          </ThemeProvider>
        </UrqlProvider>
      </body>
    </html>
  );
}
