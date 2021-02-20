import React from "react";

interface ButtonOptions {
    ResetButtonText: string;
    ClearStates: Function;
}

export const RestartButton: React.FC<ButtonOptions> = ({ ResetButtonText, ClearStates }) => {

    const invokeClearingStates = () => ClearStates()

    return (
        <div>
            <button className="btn__restart" onClick={invokeClearingStates}>{ResetButtonText}</button>
        </div>
    );
};