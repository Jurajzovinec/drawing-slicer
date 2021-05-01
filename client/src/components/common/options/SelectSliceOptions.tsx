import React from "react";
import { DrawingFormats } from '../../../types/DrawingFormats';

interface SliceOptionsProps {
    setSlicingFormat: Function;
}

export const SelectSliceOptions: React.FC<SliceOptionsProps> = ({setSlicingFormat}) => {
    const setSliceOption = (event:any) => setSlicingFormat(event.target.value.toLowerCase());
    return (
            <select id="slice-format-options" onChange={setSliceOption}>
                {DrawingFormats.map((drawingFormat) => <option key={drawingFormat} value={drawingFormat}>{drawingFormat}</option>)}
            </select>
    );
};

