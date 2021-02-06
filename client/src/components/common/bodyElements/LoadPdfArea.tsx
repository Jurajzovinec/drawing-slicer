import React, { useState, useCallback } from "react";
import { useDropzone } from 'react-dropzone';


interface PageAreaInfs {
    setIsPdfConfirmed: Function;
    setPdfNumberOfPages: Function;
    setPdfFormat: Function;
    setIsErrorInfoModalOpen: Function;
    setInfoModalMessage: Function;
    setLoadedPdfFile: Function;
    buttonText: string;
    dragAndDropText: string;
}

export const LoadPdfArea: React.FC<PageAreaInfs> = ({ setIsPdfConfirmed, setPdfNumberOfPages, setPdfFormat, setIsErrorInfoModalOpen, setInfoModalMessage, setLoadedPdfFile, buttonText, dragAndDropText }) => {

    function sendFileOnBackend(file: any): Promise<any> {

        let formData = new FormData();
        setLoadedPdfFile(formData);
        formData.append('file', file);

        return new Promise(async (resolve, reject) => {
            fetch(`http://localhost:5050/test/{"hello":"world"}`, {
                method: 'POST',
                body: formData
            })
                .then(res => {
                    resolve(res.text())
                })
                .catch((error) => reject(error));
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
