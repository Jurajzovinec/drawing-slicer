import React from "react";
import { LoadPdfButton }  from './LoadPdfButton';

interface PageAreaInfs {
    buttonText: string;
    dragAndDropText: string;
}

export const LoadPdfArea: React.FC<PageAreaInfs> = ({buttonText, dragAndDropText}) => {
    return (
        <section>
            <p className="drag-and-drop">{dragAndDropText}</p>
            <LoadPdfButton buttonText={buttonText}/>
        </section>         
    );
};