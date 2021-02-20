import React from "react";
import { DrawingFormats } from '../../../types/DrawingFormats';

interface SliceOptionsProps {
    setSliceByFormat: Function;
}

export const SelectSliceOptions: React.FC<SliceOptionsProps> = ({setSliceByFormat}) => {
    const setSliceOption = (event:any) => setSliceByFormat(event.target.value.toLowerCase());
    return (
            <select id="slice-format-options" onChange={setSliceOption}>
                {DrawingFormats.map((drawingFormat) => <option key={drawingFormat} value={drawingFormat}>{drawingFormat}</option>)}
            </select>
    );
};

