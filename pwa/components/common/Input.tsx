import React, { useState } from 'react';

interface InputProps {
    isRadio?: boolean;
    label: string;
    type?: string;
    id?: string;
    name?: string;
    placeholder?: string;
    classes?: string;
    onChange: (value: string) => void;
}

const Input: React.FC<InputProps> = ({ label, type = 'text', id, name, placeholder, classes, onChange, isRadio }) => {
    const [value, setValue] = useState('');

    const reformatDate = (dateStr: string): string => {
        const [month, day, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    };
    
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let newValue = e.target.value;
        if (type === 'date') {
            newValue = reformatDate(newValue);
        }
        setValue(e.target.value);
        onChange(e.target.value);
    }
    
    return (
        <div className={`input-container ${classes ? classes : ''} ${isRadio ? 'radio' : ''}`}>
            <label className='input-label' htmlFor={id ? id : label}>{label}</label>
            <input
                className='input-field'
                type={isRadio ? 'radio' : type}
                id={id ? id : label}
                name={name ? name : label}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
            />
        </div>
    );
};

export default Input;
