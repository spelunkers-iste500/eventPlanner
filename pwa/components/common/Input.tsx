// This file defines a React functional component named `Input` which is a reusable input component that can be used as a text input or a radio button.

// The component imports React and its `useState` hook to manage local state in the component.
// It also imports `parsePhoneNumberFromString` and `AsYouType` from the `libphonenumber-js` library to handle phone number formatting and validation.

// The `InputProps` interface defines the shape of the props that the `Input` component expects. It includes:
// - `isRadio`: an optional boolean that determines if the input is a radio button.
// - `label`: a string that represents the label for the input field.
// - `type`: an optional string that represents the type of the input field, defaulting to 'text'.
// - `id`: an optional string that represents the id of the input field.
// - `name`: an optional string that represents the name of the input field.
// - `placeholder`: an optional string that represents the placeholder text for the input field.
// - `classes`: an optional string that represents additional CSS classes for the input container.
// - `isPhoneNumber`: an optional boolean that determines if the input is a phone number.
// - `children`: an optional React node that represents additional children to be rendered inside the input container.
// - `maxlength`: an optional number that represents the maximum length of the input field.
// - `inputMode`: an optional string that represents the input mode for the input field.
// - `onChange`: a function that handles the change event and receives the input value as a parameter.

// The `Input` component maintains two pieces of state using React's `useState` hook:
// - `value`: a string that stores the current value of the input field.
// - `error`: a string that stores any error message related to the input field.

// The `handleChange` function is defined to handle the change event on the input field. It updates the `value` state and calls the `onChange` callback with the input value.
// If the `isPhoneNumber` prop is true, it formats and validates the phone number using the `AsYouType` and `parsePhoneNumberFromString` functions from `libphonenumber-js`.

// The `Input` component returns a JSX structure that represents the input field. This structure includes:
// - A `div` container with optional CSS classes and a conditional class for radio buttons.
// - A `label` element that displays the input label and is associated with the input field.
// - A conditional `span` element that displays any error message.
// - An `input` element that represents the input field, with various attributes and event handlers based on the props.

// Finally, the `Input` component is exported as the default export of the module.

import React, { useState } from "react";
import { parsePhoneNumberFromString, AsYouType } from "libphonenumber-js";

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
    defaultValue?: string;
    disabled?: boolean;
    inputMode?:
        | "email"
        | "text"
        | "search"
        | "tel"
        | "url"
        | "none"
        | "numeric"
        | "decimal";
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
 * @param {string} [props.defaultValue] - The default value of the input field.
 * @param {boolean} [props.isPhoneNumber] - Determines if the input is a phone number.
 * @param {number} [props.maxlength] - The maximum length of the input field.
 * @param {string} [props.inputMode] - The input mode for the input field.
 * @param {boolean} [props.disabled] - Determines if the input field is disabled.
 * @param {React.ReactNode} [props.children] - Additional children to be rendered inside the input container.
 * @returns {JSX.Element} The rendered input component.
 */
const Input: React.FC<InputProps> = ({
    label,
    type = "text",
    id,
    name,
    placeholder,
    classes,
    isRadio,
    isPhoneNumber,
    children,
    onChange,
    maxlength,
    inputMode,
    defaultValue,
    disabled,
}) => {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let inputValue = e.target.value;
        if (isPhoneNumber) {
            const asYouType = new AsYouType("US");
            inputValue = asYouType.input(inputValue);
            const phoneNumber = parsePhoneNumberFromString(inputValue, "US");
            if (phoneNumber && phoneNumber.isValid()) {
                inputValue = phoneNumber.format("E.164");
                setError("");
            } else {
                setError("Invalid phone number");
            }
        }
        setValue(inputValue);
        onChange(inputValue);
    }

    return (
        <div
            className={`input-container ${classes ? classes : ""} ${
                isRadio ? "radio" : ""
            }`}
        >
            <label className="input-label" htmlFor={id ? id : label}>
                {label}
            </label>
            {error && <span className="error-msg">{error}</span>}
            {children ? (
                children
            ) : (
                <input
                    className="input-field"
                    type={isRadio ? "radio" : type}
                    id={id ? id : label}
                    name={name ? name : label}
                    placeholder={placeholder}
                    value={defaultValue ? defaultValue : value}
                    maxLength={maxlength}
                    inputMode={inputMode}
                    disabled={disabled}
                    onChange={handleChange}
                />
            )}
        </div>
    );
};

export default Input;
