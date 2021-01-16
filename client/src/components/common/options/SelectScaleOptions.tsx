import React, { useState } from "react";

const formats = ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"]

export const SelectScaleOptions: React.FC = () => {

    return (        
            <select id="scale-format-options" disabled>
                {formats.map((drawingFormat) => <option key={drawingFormat} value={drawingFormat}>{drawingFormat}</option>)}
            </select>        
    );
};

