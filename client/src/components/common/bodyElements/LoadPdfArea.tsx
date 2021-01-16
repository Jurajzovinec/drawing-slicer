import React, { useState, useCallback } from "react";
import { useDropzone } from 'react-dropzone';


interface PageAreaInfs {
    buttonText: string;
    dragAndDropText: string;
}

export const LoadPdfArea: React.FC<PageAreaInfs> = ({ buttonText, dragAndDropText }) => {
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file: any) => {
            
            console.log("reaction");

            let formData = new FormData();
            formData.append('file', acceptedFiles)
            
            // Spravit call na BACKEND -> TEST ONLY -> CHECK INPUT FORMAT, TYPE, SINGLE PAGE

            /* const reader = new FileReader()
            console.log(typeof (acceptedFiles))
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                const binaryStr = reader.result
                console.log(typeof (binaryStr))
            }
            reader.readAsArrayBuffer(file) */
        })

    }, [])
    const { getRootProps, getInputProps } = useDropzone({ accept: "application/pdf", onDrop })

    return (
        <div {...getRootProps()}>
            <input{...getInputProps()} />
            <p>Drop files here or navigate me !</p>
        </div>
    );
}
