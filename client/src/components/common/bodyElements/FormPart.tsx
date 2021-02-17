import React, { useState } from "react";
import { CheckScaleOptionButton } from '../interfaceButtons/CheckScaleOptionButton';
import { SliceButton } from "../interfaceButtons/SliceButton";
import { SelectScaleOptions } from "../options/SelectScaleOptions";
import { SelectSliceOptions } from "../options/SelectSliceOptions";
import { DrawingFormats } from '../bodyElements/DrawingFormats';

interface PageAreaInfs {
    ScaleButtonText: string;
    SliceButtonText: string;
    LoadedPdfName: undefined | string;
    setIsErrorInfoModalOpen: Function;
    setInfoModalMessage: Function;
}

export const FormPart: React.FC<PageAreaInfs> = ({ ScaleButtonText, SliceButtonText, LoadedPdfName, setIsErrorInfoModalOpen, setInfoModalMessage }) => {

    const [scaleBeforeSlice, setScaleBeforeSlice] = useState<boolean>(() => false);
    const [scaleToFormat, setScaleToFormat] = useState<string>(() => DrawingFormats[0].toLowerCase());
    const [sliceByFormat, setSliceByFormat] = useState<string>(() => DrawingFormats[0].toLowerCase());


    const requestResultedData = (fileResultPath: string): Promise<(string)> => {

        console.log("...askingForResultPDF...");
        const urlToFetch = process.env.NODE_ENV === 'production' ? `https://drawing-slicer.herokuapp.com/filetodownload/{"requestedFileName":"${fileResultPath}"}`
            : `http://localhost:5050/filetodownload/{"requestedFileName":"${fileResultPath}"}`;
        return new Promise(async (resolve, reject) => {
            fetch(urlToFetch, {
                method: 'GET',
            })
                .then(response => response.blob())
                .then(blobObj => {
                    const blobbedObject = new Blob([blobObj])
                    const blobUrl = window.URL.createObjectURL(blobbedObject);
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.setAttribute('download', 'resultedSlicedPdf.pdf');
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode!.removeChild(link);
                    window.URL.revokeObjectURL(blobObj.toString());
                    resolve('Succes')
                })
                .catch(err => reject(err))
        })
    }

    const clearBackendStorageAPI = (result: string): void => {

        console.log("...sendingRequestToClearBackendStorage...");
        const urlToFetch = process.env.NODE_ENV === 'production' ? "https://drawing-slicer.herokuapp.com/clearpdfdata" : "http://localhost:5050/clearpdfdata";
        fetch(urlToFetch)
    }

    const fetchFunction = () => {
        // console.log(LoadedPdfName)
        const urlToFetch = process.env.NODE_ENV === 'production' ?
            `https://drawing-slicer.herokuapp.com/slice/{"ScaleBeforeSlice":"${scaleBeforeSlice}","ScaleToFormat":"${scaleToFormat}","SliceByFormat":"${sliceByFormat}"}` :
            `http://localhost:5050/slice/{"Filename":"${LoadedPdfName}","ScaleBeforeSlice":"${scaleBeforeSlice}","ScaleToFormat":"${scaleToFormat}","SliceByFormat":"${sliceByFormat}"}`;

        fetch(urlToFetch, {
            method: 'GET'
        })
            .then(response => {
                return response.text()
            })
            .then(response => {
                console.log(response)
                return JSON.parse(response)
            })
            .then(response => {
                if (response.Status === "Fail") {
                    setInfoModalMessage(response.ErrorMessage)
                    setIsErrorInfoModalOpen(true)
                } else {
                    console.log(response.ResultPdfName)
                    requestResultedData(response.ResultPdfName)
                        // .then(result => clearBackendStorageAPI(result))
                }
            })
            .catch(error => console.log(error))
    };

    return (
        <>
            <div className="scale-form">
                <CheckScaleOptionButton
                    ScaleButtonText={ScaleButtonText}
                    setScaleBeforeSlice={(value: boolean) => setScaleBeforeSlice(value)}
                />
                <SelectScaleOptions
                    setScaleToFormat={(value: string) => setScaleToFormat(value)}
                />
            </div>
            <div className="slice-form">
                <SliceButton
                    SliceButtonText={SliceButtonText}
                    FetchFunction={fetchFunction}
                />
                <SelectSliceOptions
                    setSliceByFormat={(value: string) => setSliceByFormat(value)}
                />
            </div>
        </>
    );
};