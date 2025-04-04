import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ContentProvider } from 'Utils/ContentProvider';
import { BookingProvider } from 'Utils/BookingProvider';
import { Provider } from 'Components/ui/provider';
import { Session } from 'next-auth';
import { UserProvider } from './UserProvider';

interface AppProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

const AppProvider: React.FC<AppProviderProps> = ({ children, session }) => {
  return (
    <Provider>
      <SessionProvider session={session}>
        <UserProvider>
          <ContentProvider>
            <BookingProvider>
              {children}
            </BookingProvider>
          </ContentProvider>
        </UserProvider>
      </SessionProvider>
    </Provider>
  );
};

export default AppProvider;