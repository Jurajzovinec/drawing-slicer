import React from "react";

const formats = ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"]

export const SelectFormatOptions: React.FC = () => {
    return (
        <div className="scaling-format-options">
            <select>
                {formats.map((drawingFormat) => <option value={drawingFormat}>{drawingFormat}</option>)}
            </select>
        </div>
    );
};

