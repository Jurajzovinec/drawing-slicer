import React from "react";

interface PageAreaInfs {
    isPdfSinglePage: any;
    pdfInputFormat: any;
}

export const InfoPdfArea: React.FC<PageAreaInfs> = ({isPdfSinglePage, pdfInputFormat}) => {
    return (
        <section>
            <p> PDF has {isPdfSinglePage} page.</p>
            <p> PDF input format is in {pdfInputFormat} format.</p>
        </section>         
    );
};