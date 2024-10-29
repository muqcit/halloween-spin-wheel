import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import for navigation
import styles from "./loginPage.module.css";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // State for error message
    const navigate = useNavigate(); // Initialize the navigation function

// Email validation function
    const isValidEmail = (email) => {
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        //     return emailRegex.test(email);
        return true;
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setErrorMessage(""); // Reset error message on input change
    };

    const handleSubmit = async () => {
        if (!isValidEmail(email)) {
            setErrorMessage("Please enter a valid id.");
            return;
        }

        try {
            // Send a POST request to register the user
            const response = await axios.post("http://localhost:5000/register", { email });
            
            if (response.status === 201 || response.status === 200) {
                // Navigate to the spin page on success
                navigate("/spin", { state: { email } });
            }
        } catch (error) {
            console.error("Error registering user:", error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.background}`}></div>
            <div className={styles.main}>
                <h1>Halloween Offer</h1>
                <h2>Spin and win the Halloween Offer</h2>
                <input 
                    type="email" 
                    placeholder="Enter the id to win in the lucky spin"
                    value={email}
                    onChange={handleEmailChange}
                />
                <button onClick={handleSubmit}>Submit</button>
                {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            </div>
        </div>
    );
};

export default LoginPage;
