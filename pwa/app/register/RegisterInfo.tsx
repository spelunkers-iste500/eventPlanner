"use client";
import React, { useState, useEffect } from "react";
import styles from "../login/login.module.css";
import Input from "Components/common/Input";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
// Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). 
// All other copyright (c) for Lucide are held by Lucide Contributors 2022.
import { PasswordInput } from "Components/ui/password-input";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { formatDateSubmit } from "Types/events";

interface RegisterInfoProps {
    onSuccess: () => void;
}

const RegisterInfo: React.FC<RegisterInfoProps> = ({ onSuccess }) => {
    const searchParams = useSearchParams();
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
        title: "",
        gender: "",
        birthday: "",
        phoneNumber: "",
        eventCode: "",
        orgInviteId: "",
    });

    useEffect(() => {
        const eventCode = searchParams.get("eventCode");
        const orgInviteId = searchParams.get("orgInviteId");
        const email = searchParams.get("email");
        if (email) {
            setFormData((prevData) => ({ ...prevData, email }));
        }
        if (eventCode) {
            setFormData((prevData) => ({ ...prevData, eventCode }));
        }
        if (orgInviteId) {
            setFormData((prevData) => ({ ...prevData, orgInviteId }));
        }
    }, [searchParams]);

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (value) {
            setError("");
        }
    };

    const validateForm = () => {
        const requiredFields = [
            { field: "email", message: "Email is required" },
            { field: "password", message: "Password is required" },
            {
                field: "confirmPassword",
                message: "Confirm Password is required",
            },
            { field: "firstName", message: "First name is required" },
            { field: "lastName", message: "Last name is required" },
            { field: "title", message: "Title is required" },
            { field: "gender", message: "Gender is required" },
            { field: "birthday", message: "Birthday is required" },
            { field: "phoneNumber", message: "Phone number is required" },
        ];

        for (const { field, message } of requiredFields) {
            if (!formData[field as keyof typeof formData]) {
                return message;
            }
        }

        if (formData.password !== formData.confirmPassword) {
            return "Passwords do not match";
        }

        return "";
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errorMessage = validateForm();
        if (errorMessage) {
            setError(errorMessage);
            return;
        }

        // Format the request data to match the API route format
        const requestData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            birthday: new Date(formData.birthday).toISOString(),
            title: formData.title,
            gender: formData.gender,
            plainPassword: formData.password,
            ...(formData.eventCode
                ? { eventCode: formData.eventCode }
                : { userOrgInviteId: formData.orgInviteId }),
        };

        // send post request to /users using axios
        try {
            const response = await axios.post("/users", requestData, {
                headers: {
                    "Content-Type": "application/ld+json",
                },
            });

            if (response.status === 201) {
                console.info("Registration successful:", response.data);
                setError("");

                const isAuth = await signIn("credentials-no-2fa", {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                    // callbackUrl: '/'
                });

                if (isAuth?.error) {
                    console.error(isAuth.error);
                    setError("An error occurred during login");
                } else {
                    onSuccess();
                }
            }
        } catch (error) {
            setError("An error occurred during registration, please try again");
            console.error("Registration error:", error);
        }
    };

    const [startDate, setStartDate] = useState<Date | null>(null);

    return (
        <>
            {error && <div className="error-msg">{error}</div>}
            <form
                className={`${styles.sessionContainer} ${styles.register}`}
                onSubmit={handleSubmit}
            >
                <input
                    type="hidden"
                    value={
                        formData.eventCode
                            ? formData.eventCode
                            : formData.orgInviteId
                    }
                />
                <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    defaultValue={formData.email}
                    onChange={(value) => handleChange("email", value)}
                />

                <div className={styles.twoColForm}>
                    <Input
                        label="First Name"
                        type="text"
                        placeholder="Enter first name"
                        onChange={(value) => handleChange("firstName", value)}
                    />

                    <Input
                        label="Last Name"
                        type="text"
                        placeholder="Enter last name"
                        onChange={(value) => handleChange("lastName", value)}
                    />
                </div>

                <Input label="Password" onChange={() => {}}>
                    <PasswordInput
                        className={`${styles.passwordInput} input-field`}
                        placeholder="Enter your password"
                        onChange={(e) =>
                            handleChange("password", e.target.value)
                        }
                    />
                </Input>

                <Input label="Confirm Password" onChange={() => {}}>
                    <PasswordInput
                        className={`${styles.passwordInput} input-field`}
                        placeholder="Confirm your password"
                        onChange={(e) =>
                            handleChange("confirmPassword", e.target.value)
                        }
                    />
                </Input>

                <div className={styles.twoColForm}>
                    <Input label="Title" onChange={() => {}}>
                        <select
                            value={formData.title}
                            onChange={(e) =>
                                handleChange("title", e.target.value)
                            }
                            className={`select-menu vanilla`}
                        >
                            <option value="" disabled hidden>
                                Select a title
                            </option>
                            <option value="mr">Mr</option>
                            <option value="ms">Ms</option>
                            <option value="mrs">Mrs</option>
                            <option value="miss">Miss</option>
                            <option value="dr">Dr</option>
                        </select>
                    </Input>

                    <Input label="Gender" onChange={() => {}}>
                        <select
                            value={formData.gender}
                            onChange={(e) =>
                                handleChange("gender", e.target.value)
                            }
                            className={`select-menu vanilla`}
                        >
                            <option value="" disabled hidden>
                                Select a gender
                            </option>
                            <option value="m">Male</option>
                            <option value="f">Female</option>
                        </select>
                    </Input>
                </div>

                <div className={styles.twoColForm}>
                    <Input
                        label="Phone Number"
                        type="tel"
                        isPhoneNumber
                        placeholder="Enter your phone number"
                        onChange={(value) => handleChange("phoneNumber", value)}
                    />

                    <Input label="Date of Birth" onChange={() => {}}>
                        <DatePicker
                            selected={startDate}
                            startDate={startDate}
                            maxDate={new Date()}
                            onChange={(date) => {
                                setStartDate(date);
                                handleChange(
                                    "birthday",
                                    formatDateSubmit(date)
                                );
                            }}
                            openToDate={new Date("2000/01/01")}
                            showMonthDropdown
                            showYearDropdown
                            placeholderText="Enter your birthday"
                            dateFormat="MM/dd/yyyy"
                            className="input-field"
                            showIcon
                            icon={<Calendar size={32} />}
                        />
                    </Input>
                </div>
                <button type="submit" className={styles.signinBtn}>
                    Submit
                </button>
            </form>
        </>
    );
};

export default RegisterInfo;
