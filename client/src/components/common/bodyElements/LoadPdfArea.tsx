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

            // Spravit call na BACKEND -> TEST ONLY -> CHECK INPUT FORMAT, SINGLE PAGE

            fetch("http://localhost:5050/test", {
                method: 'POST',
                body: formData
            }).then(res=>console.log(res.text()))

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
