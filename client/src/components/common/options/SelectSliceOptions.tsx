import React from "react";

const formats = ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"]

export const SelectSliceOptions: React.FC = () => {
    return (
            <select id="slice-format-options">
                {formats.map((drawingFormat) => <option key={drawingFormat} value={drawingFormat}>{drawingFormat}</option>)}
            </select>
    );
};

