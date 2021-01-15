import React from "react";

interface ButtonOptions { 
    SliceButtonText: string;
}

export const SliceButton: React.FC<ButtonOptions> = ({SliceButtonText}) => {
    
    return (
        <div className="slice-button">
            <button>{SliceButtonText}</button>
        </div>
    );
};