import React from "react";
import { CheckScaleOptionButton } from './CheckScaleOptionButton';
import { SelectFormatOptions } from './SelectFormatOptions';

interface PageAreaInfs {
    buttonText: string;
    importedFormat: string | null;
}

export const FormPart: React.FC<PageAreaInfs> = ({ buttonText, importedFormat }) => {
    return (
        <div className="form-part">
            <div className="input-format-drawing">
                <span>
                    Input format is {importedFormat}
                </span>
            </div>
            <div className="scale-form">
                <CheckScaleOptionButton buttonText={buttonText} />
                <SelectFormatOptions />
            </div>
            <div className="slice-form">
                <CheckScaleOptionButton buttonText={buttonText} />
                <SelectFormatOptions />
            </div>

        </div>
    );
};