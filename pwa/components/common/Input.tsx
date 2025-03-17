import React, { useState } from 'react';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';

interface InputProps {
    isRadio?: boolean;
    label: string;
    type?: string;
    id?: string;
    name?: string;
    placeholder?: string;
    classes?: string;
    isPhoneNumber?: boolean;
    children?: React.ReactNode;
    maxlength?: number;
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
 * @param {boolean} [props.isPhoneNumber] - Determines if the input is a phone number.
 * @param {React.ReactNode} [props.children] - Additional children to be rendered inside the input container.
 * @returns {JSX.Element} The rendered input component.
 */
const Input: React.FC<InputProps> = ({ label, type = 'text', id, name, placeholder, classes, isRadio, isPhoneNumber, children, onChange, maxlength }) => {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let inputValue = e.target.value;
        if (isPhoneNumber) {
            const asYouType = new AsYouType('US');
            inputValue = asYouType.input(inputValue);
            const phoneNumber = parsePhoneNumberFromString(inputValue, 'US');
            if (phoneNumber && phoneNumber.isValid()) {
                inputValue = phoneNumber.format('E.164');
                setError('');
            } else {
                setError('Invalid phone number');
            }
        }
        setValue(inputValue);
        onChange(inputValue);
    }
    
    return (
        <div className={`input-container ${classes ? classes : ''} ${isRadio ? 'radio' : ''}`}>
            <label className='input-label' htmlFor={id ? id : label}>{label}</label>
            {error && <span className='error-msg'>{error}</span>}
            {children ? children : (
                <input
                    className='input-field'
                    type={isRadio ? 'radio' : type}
                    id={id ? id : label}
                    name={name ? name : label}
                    placeholder={placeholder}
                    value={value}
                    maxLength={maxlength}
                    onChange={handleChange}
                />
            )}
        </div>
    );
};

export default Input;
