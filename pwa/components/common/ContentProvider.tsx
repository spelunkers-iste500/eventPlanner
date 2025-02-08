'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Dashboard from '../dashboard/Dashboard';

interface ContentState {
    name: string;
    content: ReactNode;
}

interface ContentContextType {
    state: ContentState;
    setContent: (content: ReactNode, name: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<ContentState>({
        name: 'Dashboard',
        content: <Dashboard />,
    });

    const setContent = (content: ReactNode, name: string) => {
        setState({ name, content });
    };

    return (
        <ContentContext.Provider value={{ state, setContent }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};