import React from "react";

export const BodyHeader: React.FC<{ text: string }> = ({ text }) => {
    return (
        <h1>{text}</h1>
    );
};