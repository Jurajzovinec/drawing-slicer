import React from "react";

interface PageAreaInfs {
    isPdfSinglePage: string;
    pdfInputFormat: string;
}

export const InfoPdfArea: React.FC<PageAreaInfs> = ({isPdfSinglePage, pdfInputFormat}) => {
    return (
        <section>
            <p> Is PDF single page {isPdfSinglePage} </p>
            <p> Pdf input format is {pdfInputFormat} </p>
        </section>         
    );
};