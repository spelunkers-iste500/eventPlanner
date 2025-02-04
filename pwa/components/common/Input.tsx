import React, { useState } from 'react';

interface InputProps {
    label: string;
    type?: string;
    placeholder?: string;
    classes?: string;
    onChange: (value: string) => void;
}

const Input: React.FC<InputProps> = ({ label, type = 'text', placeholder = '', classes, onChange }) => {
    const [value, setValue] = useState("");
    
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
        onChange(e.target.value);
    }
    
    return (
        <div className={`input-container ${classes ? classes : ''}`}>
            <label className='input-label' htmlFor={label}>{label}</label>
            <input
                className='input-field'
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                name={label}
            />
        </div>
    );
};

export default Input;
