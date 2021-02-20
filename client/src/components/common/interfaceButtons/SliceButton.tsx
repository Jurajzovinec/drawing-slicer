import React from "react";

interface ButtonOptions {
    SliceButtonText: string;
    SliceFunction: Function;
}


export const SliceButton: React.FC<ButtonOptions> = ({ SliceButtonText, SliceFunction}) => {
    
    const invokeFetchFunction = () => SliceFunction()

    return (
        <div className="slice-button">
            <button onClick={invokeFetchFunction}>{SliceButtonText}</button>
        </div>
    );
};