import React from "react";

interface ButtonOptions {
    SliceButtonText: string;
    FetchFunction: Function;
}


export const SliceButton: React.FC<ButtonOptions> = ({ SliceButtonText, FetchFunction}) => {
    
    const invokeFetchFunction = () => FetchFunction()

    return (
        <div className="slice-button">
            <button onClick={invokeFetchFunction}>{SliceButtonText}</button>
        </div>
    );
};