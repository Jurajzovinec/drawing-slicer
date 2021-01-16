import React from "react";
import { CheckScaleOptionButton } from '../interfaceButtons/CheckScaleOptionButton';
import { SliceButton } from "../interfaceButtons/SliceButton";
import { SelectScaleOptions } from "../options/SelectScaleOptions";
import { SelectSliceOptions } from "../options/SelectSliceOptions";


interface PageAreaInfs {
    ScaleButtonText: string;
    SliceButtonText: string;
}

export const FormPart: React.FC<PageAreaInfs> = ({ ScaleButtonText, SliceButtonText }) => {  
    return (
        <>
            <div className="scale-form">
                <CheckScaleOptionButton ScaleButtonText={ScaleButtonText} />
                <SelectScaleOptions />
            </div>
            <div className="slice-form">
                <SliceButton SliceButtonText={SliceButtonText} />
                <SelectSliceOptions />
            </div>
        </>
    );
};