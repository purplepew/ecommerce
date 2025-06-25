'use client'
import { UrqlProvider } from '../lib/urqlClient'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/lib/store';
import Header from './components/Header';
import { createTheme, ThemeProvider } from '@mui/material';

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
          <ReduxProvider store={store}>
            <ThemeProvider theme={theme}>
              <Header />
              {children}
            </ThemeProvider>
          </ReduxProvider>
        </UrqlProvider>
      </body>
    </html>
  );
}
