import React from "react";
import AppLogo from '../../svg/openai_logo.svg';
import '../../styles/Chat.css';

const ChatMessage = ({ message }) => {
    return (
        <div className={`chat-message ${message.user === "gpt" && "chatgpt"}`}>
            <div className="chat-message-center">
                <div className={`avatar ${message.user === "gpt" && "chatgpt"}`}>
                    {message.user === "gpt" ? (
                        <img className="icon-md" src={AppLogo} alt="OpenAI Logo" />
                    ) : (
                        <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" className="icon-md" alt="User Logo" />
                    )}
                </div>
                <div className="message">
                    {message.message}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
