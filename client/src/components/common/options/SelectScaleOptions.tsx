import React from "react";
import { DrawingFormats } from '../../../types/DrawingFormats';

interface ScaleOptionsProps {
    setScalingFormat: Function;
}

export const SelectScaleOptions: React.FC<ScaleOptionsProps> = ({ setScalingFormat }) => {
    const setScaleOption = (event:any) => setScalingFormat(event.target.value.toLowerCase());
    return (
        <select id="scale-format-options" disabled onChange={setScaleOption}>
            {DrawingFormats.map((drawingFormat) => <option key={drawingFormat} value={drawingFormat}>{drawingFormat}</option>)}
        </select>
    );
};

