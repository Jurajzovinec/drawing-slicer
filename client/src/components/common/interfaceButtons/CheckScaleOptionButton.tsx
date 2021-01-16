import React from "react";

interface ButtonOptions {
    ScaleButtonText: string;
}

const isCheckedScaleOption = () => {
    (document.getElementById("scale-format-options") as HTMLSelectElement).disabled = false;
    if ((document.getElementById("check-scale-options-button-id") as HTMLInputElement).checked) {
        (document.getElementById("scale-format-options") as HTMLSelectElement).disabled = false;
    } else {
        (document.getElementById("scale-format-options") as HTMLSelectElement).disabled = true;
    }
}

export const CheckScaleOptionButton: React.FC<ButtonOptions> = ({ ScaleButtonText }) => {
    return (
        <div className="check-scale-options-button">
            <label>{ScaleButtonText}</label>
            <input type="checkbox" id="check-scale-options-button-id" onChange={() => isCheckedScaleOption()} />
        </div>
    );
};