import React from 'react';
import axios from 'axios';
// import Container from '../common/Container';
// import styles from './Contact.module.css';

const Test = ({ }) => {
    async function handleClick() {
        const response = await axios.get("/api/token")
        console.log(response);
    };
    return (
        <button onClick={handleClick}>Test</button>
    );
};

export default Test;
