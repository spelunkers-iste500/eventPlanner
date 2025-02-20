import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ContentProvider } from 'Utils/ContentProvider';
import { BookingProvider } from 'Utils/BookingProvider';
import { Provider } from 'Components/ui/provider';
import { auth } from '../utils/auth';
import { Session } from 'next-auth';

interface AppProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

const AppProvider: React.FC<AppProviderProps> = ({ children, session }) => {
  return (
    <Provider>
      <SessionProvider session={session}>
        <ContentProvider>
          <BookingProvider>
            {children}
          </BookingProvider>
        </ContentProvider>
      </SessionProvider>
    </Provider>
  );
};

export default AppProvider;