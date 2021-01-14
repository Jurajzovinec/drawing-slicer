import React from "react";
import { LoadPdfButton }  from './LoadPdfButton';

interface PageAreaInfs {
    buttonText: string;
    dragAndDropText: string;
}

export const LoadPdfArea: React.FC<PageAreaInfs> = ({buttonText, dragAndDropText}) => {
    return (
        <div className="load-pdf-area">
            <span className="drag-and-drop">{dragAndDropText}</span>
            <LoadPdfButton buttonText={buttonText}/>
        </div>
    );
};