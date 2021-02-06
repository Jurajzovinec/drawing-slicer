import React from "react";

interface ButtonOptions {
    ResetButtonText: string;
    ClearStates: Function;
}

export const RestartButton: React.FC<ButtonOptions> = ({ ResetButtonText, ClearStates }) => {

    const invokeClearingStates = () => ClearStates()

    return (
        <div className="restart-button">
            <button onClick={invokeClearingStates}>{ResetButtonText}</button>
        </div>
    );
};