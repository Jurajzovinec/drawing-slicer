import React from "react";

interface ButtonOptions {
    ScaleButtonText: string;
    setScaleBeforeSlice: Function;
}

export const CheckScaleOptionButton: React.FC<ButtonOptions> = ({ ScaleButtonText, setScaleBeforeSlice }) => {

    const isCheckedScaleOption = () => {
        (document.getElementById("scale-format-options") as HTMLSelectElement).disabled = false;
        if ((document.getElementById("check-scale-options-button-id") as HTMLInputElement).checked) {
            (document.getElementById("scale-format-options") as HTMLSelectElement).disabled = false;
            setScaleBeforeSlice(true);
        } else {
            (document.getElementById("scale-format-options") as HTMLSelectElement).disabled = true;
            setScaleBeforeSlice(false);
        }
    }

    return (
        <div className="check-scale-options-button">
            <input type="checkbox" id="check-scale-options-button-id" onChange={() => isCheckedScaleOption()} />
        </div>
    );
};