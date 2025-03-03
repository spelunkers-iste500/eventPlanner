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

/**
 * A reusable input component that can be used as a text input or a radio button.
 * 
 * @param {boolean} [props.isRadio] - Determines if the input is a radio button.
 * @param {string} props.label - The label for the input field.
 * @param {string} [props.type='text'] - The type of the input field.
 * @param {string} [props.id] - The id of the input field.
 * @param {string} [props.name] - The name of the input field.
 * @param {string} [props.placeholder] - The placeholder text for the input field.
 * @param {string} [props.classes] - Additional CSS classes for the input container.
 * @param {function} props.onChange - Callback function to handle the change event.
 * @returns {JSX.Element} The rendered input component.
 */
const Input: React.FC<InputProps> = ({ label, type = 'text', id, name, placeholder, classes, onChange, isRadio }) => {
    const [value, setValue] = useState('');

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
