import React from "react";

interface ButtonOptions {
    buttonText: string;
}

export const CheckScaleOptionButton: React.FC<ButtonOptions> = ({buttonText}) => {
    
    return (
        <div className="check-scale-options-button">
            <button>{buttonText}</button>
        </div>
    );
};