import React from "react";
import { DrawingFormats } from '../bodyElements/DrawingFormats';

interface ScaleOptionsProps {
    setScaleToFormat: Function;
}

export const SelectScaleOptions: React.FC<ScaleOptionsProps> = ({ setScaleToFormat }) => {
    const setScaleOption = (event:any) => setScaleToFormat(event.target.value.toLowerCase());
    return (
        <select id="scale-format-options" disabled onChange={setScaleOption}>
            {DrawingFormats.map((drawingFormat) => <option key={drawingFormat} value={drawingFormat}>{drawingFormat}</option>)}
        </select>
    );
};

