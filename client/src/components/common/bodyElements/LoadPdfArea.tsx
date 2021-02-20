import React, { useState, useCallback } from "react";
import { useDropzone } from 'react-dropzone';


interface PageAreaInfs {
    setIsPdfConfirmed: Function;
    setPdfNumberOfPages: Function;
    setPdfFormat: Function;
    setIsErrorInfoModalOpen: Function;
    setInfoModalMessage: Function;
    setLoadedPdfFile: Function;
    setloadedPdfFileName: Function;
    setIsAppLoading: Function;
    dragAndDropText: string;
}

export const LoadPdfArea: React.FC<PageAreaInfs> = ({ setIsPdfConfirmed, setPdfNumberOfPages, setPdfFormat, setIsErrorInfoModalOpen, setInfoModalMessage, setLoadedPdfFile, dragAndDropText, setloadedPdfFileName, setIsAppLoading }) => {

    function sendFileOnBackend(file: any): Promise<any> {
        setIsAppLoading(true)
        let formData = new FormData();
        setLoadedPdfFile(formData);
        formData.append('pdffile', file);

        return new Promise(async (resolve, reject) => {

            const urlToFetch =  process.env.NODE_ENV === 'production'?  "https://drawing-slicer.herokuapp.com/testfile" : "http://localhost:5050/testfile";

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

                    if (response.Status === "Success") {
                        setIsPdfConfirmed(true);
                        setPdfNumberOfPages(response.NumberOfPages);
                        setPdfFormat(response.DrawingFormat.toUpperCase())
                        setloadedPdfFileName(response.Filename)
                    } else {
                        setInfoModalMessage(response.ErrorMessage)
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
