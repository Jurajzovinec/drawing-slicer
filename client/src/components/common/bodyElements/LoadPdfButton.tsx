import React from "react";

export const LoadPdfButton: React.FC<{ buttonText: string }> = ({buttonText}) => {
    return (
        <div className="load-pdf-button">
            <button>{buttonText}</button>
        </div>
    );
};