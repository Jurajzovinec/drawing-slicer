import React from "react";

export const BodyHeader: React.FC<{ text: string }> = ({text}) => {
    return (
        <div className="body-header">
            <h1>{text}</h1>
        </div>
    );
};