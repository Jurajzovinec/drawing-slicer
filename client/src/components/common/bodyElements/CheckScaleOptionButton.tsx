import React from "react";

interface ButtonOptions {
    ScaleButtonText: string;
}

export const CheckScaleOptionButton: React.FC<ButtonOptions> = ({ScaleButtonText}) => {
    
    return (
        <div className="check-scale-options-button">
            <button>{ScaleButtonText}</button>
        </div>
    );
};