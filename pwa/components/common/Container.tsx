import React from 'react';

interface ContainerProps {
    children: React.ReactNode;
    classes?: string;
}

const Container: React.FC<ContainerProps> = ({ classes, children }) => {
    return (
        <div className={`content-container ${classes ? classes : ''}`}>
            {children}
        </div>
    );
};

export default Container;
