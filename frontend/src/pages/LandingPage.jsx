import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const LandingPage = () => {
    const [prompt, setPrompt] = useState('');
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (prompt.trim()) {
            navigate('/mindmap', { state: { centralIdea: prompt.trim() } });
        }
    };

    return (
        <div className = "landing-container">
            <h1 className = "logo-text">💡 IdeaMapper</h1>
            <div className = "chatbox-wrapper">
                <input
                    type = "text"
                    value = {prompt}
                    onChange = {(e) => setPrompt(e.target.value)}
                    placeholder = "Enter your main idea..."
                    className = "chatbox"
                />
                <button onClick = {handleSubmit} className="enter-button">
                    ➤ Enter
                </button>
            </div>
        </div>
    );
};

export default LandingPage;