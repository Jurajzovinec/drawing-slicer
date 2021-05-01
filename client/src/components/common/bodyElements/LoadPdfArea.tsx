import React, { useState, useCallback } from "react";
import { useDropzone } from 'react-dropzone';

interface PageAreaInfs {
    setIsPdfConfirmed: Function;
    setPdfNumberOfPages: Function;
    setPdfFormat: Function;
    setIsErrorInfoModalOpen: Function;
    setInfoModalMessage: Function;
    setloadedPdfFileName: Function;
    setIsAppLoading: Function;
    dragAndDropText: string;
}

export const LoadPdfArea: React.FC<PageAreaInfs> = ({ setIsPdfConfirmed, setPdfNumberOfPages, setPdfFormat, setIsErrorInfoModalOpen, setInfoModalMessage,  dragAndDropText, setloadedPdfFileName, setIsAppLoading }) => {

    function sendFileOnBackend(file: any): Promise<any> {
        setIsAppLoading(true)
        let formData = new FormData();
        formData.append('pdffile', file);

        return new Promise(async (resolve, reject) => {

            const urlToFetch = process.env.NODE_ENV === 'production' ? "https://drawing-slicer.herokuapp.com/validatefile" : "http://localhost:5050/validatefile";

            fetch(urlToFetch, {
                method: 'POST',
                body: formData
            })
                .then(res => {
                    setIsAppLoading(false)
                    resolve(res.text())
                })
                .catch((error) => {
                    setIsAppLoading(false)
                    reject(error)
                });
        });
    }

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file: any) => {
            sendFileOnBackend(acceptedFiles[0])
                .then(response => {
                    response = JSON.parse(response);
                    console.log(response)
                    if (response.status === "OK") {
                        setIsPdfConfirmed(true);
                        setPdfNumberOfPages(response.numberOfPages);
                        setPdfFormat(response.drawingFormat.toUpperCase())
                        setloadedPdfFileName(response.filename)
                    }

                    if (response.status == "FAILED") {
                        setInfoModalMessage(response.error)
                        setIsErrorInfoModalOpen(true)
                    }

                });
        });
    }, [])

    const { getRootProps, getInputProps } = useDropzone({ accept: "application/pdf", onDrop })

    return (
        <div {...getRootProps()}>
            <input{...getInputProps()} />
            <p>{dragAndDropText}</p>
        </div>
    );
}
