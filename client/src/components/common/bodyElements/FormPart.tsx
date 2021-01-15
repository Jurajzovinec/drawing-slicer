import React from "react";
import { CheckScaleOptionButton } from './CheckScaleOptionButton';
import { SelectFormatOptions } from './SelectFormatOptions';
import { SliceButton } from "./SliceButton";

interface PageAreaInfs {
    ScaleButtonText: string;
    SliceButtonText: string;
    importedFormat: string | null;
}

export const FormPart: React.FC<PageAreaInfs> = ({ ScaleButtonText, SliceButtonText, importedFormat }) => {
    return (
        <>
            <p id="form-p-tag">
                Your input drawing format is {importedFormat}.
            </p>
            <div className="scale-form">
                <CheckScaleOptionButton ScaleButtonText={ScaleButtonText} />
                <SelectFormatOptions />
            </div>
            <div className="slice-form">
                <SliceButton SliceButtonText={SliceButtonText} />
                <SelectFormatOptions />
            </div>
        </>
    );
};