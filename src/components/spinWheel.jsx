import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./SpinWheel.module.css";
import { useLocation } from "react-router-dom";

const pies = [
    { title: "Freeplays" },
    { title: "$10 in cashapp" },
    { title: "Golden ticket" },
    { title: "Platinum ticket" },
    { title: "Silver ticket" },
    { title: "Cashbacks" },
];

const SpinWheel = () => {
    const location = useLocation();
    const [canSpin, setCanSpin] = useState(false);
    const [email, setEmail] = useState(location.state?.email || "");
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [bouncing, setBouncing] = useState(false); // New state for bouncing animation

    const spin = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setBouncing(true); // Start the bouncing animation
        const randomSpin = Math.floor(Math.random() * 360) + 3600; // Minimum 10 full spins
        const newRotation = rotation + randomSpin;

        setRotation(newRotation);

        const degreesPerSegment = 360 / pies.length;
        const finalRotation = newRotation % 360;
        const selectedSegmentIndex = Math.floor(finalRotation / degreesPerSegment);

        setTimeout(() => {
            setIsSpinning(false);
            setSelectedIndex(selectedSegmentIndex);
            setBouncing(false); // Stop bouncing animation
        }, 4000);
    };

    useEffect(() => {
        const checkSpinEligibility = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/spin`, {
                    params: { email },
                });
                if (response.status === 200) {
                    setCanSpin(true);
                } else if (response.status === 201) {
                    setCanSpin(false);
                    alert(response.data.message);
                } else {
                    console.log(response.data.message);
                }
            } catch (error) {
                console.error("Error checking spin eligibility:", error);
            }
        };

        checkSpinEligibility();
    }, [email]);

    const handleSpin = () => {
        if (canSpin) {
            spin(); // Trigger the spin function
            setCanSpin(false); // Disable further spins immediately after the button is pressed
        } else {
            alert("Please wait until your next spin is available.");
        }
    };

    return (
        <div className={styles.wheelContainer}>
            <div className={styles.wheel} style={{ transform: `rotate(${rotation}deg)` }}>
                {pies.map((pie, index) => (
                    <div key={index} className={`${styles.segment} ${selectedIndex === index ? styles.highlight : ''}`}>
                        <div className={styles.segmentText} style={{ color: index % 2 === 0 ? 'white' : 'black' }}>
                            {pie.title}
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.spinBtn}>
                <button
                    className={`${styles.button} ${bouncing ? styles.bounce : ''}`} // Add bouncing class if bouncing is true
                    onClick={handleSpin}
                    disabled={isSpinning}
                >
                    {isSpinning ? "Spinning..." : "Spin the Wheel!"}
                </button>
            </div>
        </div>
    );
};

export default SpinWheel;
