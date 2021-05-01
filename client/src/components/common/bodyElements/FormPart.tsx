import React, { useState } from "react";
import { CheckScaleOptionButton } from '../interfaceButtons/CheckScaleOptionButton';
import { SliceButton } from "../interfaceButtons/SliceButton";
import { SelectScaleOptions } from "../options/SelectScaleOptions";
import { SelectSliceOptions } from "../options/SelectSliceOptions";
import { DrawingFormats } from '../../../types/DrawingFormats';
import getSlicePdfFile from '../../../lib/getSlicePdfFile';
import SliceDrawingParameters from '../../../types/sliceDrawingParameters';

interface PageAreaInfs {
    ScaleButtonText: string;
    SliceButtonText: string;
    LoadedPdfName: undefined | string;
    setIsErrorInfoModalOpen: Function;
    setInfoModalMessage: Function;
    setIsSlicedPdfReadyOnAWS: Function;
    setIsAppLoading: Function;
    setSlicedPdfFileName: Function;
}

export const FormPart: React.FC<PageAreaInfs> = ({ setSlicedPdfFileName, ScaleButtonText, SliceButtonText, LoadedPdfName, setIsErrorInfoModalOpen, setInfoModalMessage, setIsSlicedPdfReadyOnAWS, setIsAppLoading }) => {

    const [scaleBeforeSlice, setScaleBeforeSlice] = useState<boolean>(() => false);
    const [scalingFormat, setScalingFormat] = useState<string>(() => DrawingFormats[0].toLowerCase());
    const [slicingFormat, setSlicingFormat] = useState<string>(() => DrawingFormats[0].toLowerCase());

    const requestParamsForSlice: SliceDrawingParameters = {
        scaleBeforeSlice,
        scalingFormat,
        slicingFormat,
        filename: LoadedPdfName
    }

    function sliceLoadedPdfRequest(args: SliceDrawingParameters): void {
        console.log(args);
        setIsAppLoading(true)
        setIsSlicedPdfReadyOnAWS(false)
        getSlicePdfFile(args)
            .then(response => response.text())
            .then(response => JSON.parse(response))
            .then(response => {
                console.log(response)
                if (response.status === "OK") {
                    setIsAppLoading(false)
                    setSlicedPdfFileName(response.uploadedFileName)
                    setIsSlicedPdfReadyOnAWS(true)
                } else {
                    setIsAppLoading(false)
                    setInfoModalMessage(response.Error)
                    setIsErrorInfoModalOpen(true)
                    setIsSlicedPdfReadyOnAWS(false)
                }
            })
            .catch(error => {
                setIsAppLoading(false)
            })
    }

    return (
        <>
            <div className="form-container--lineblock">
                <label>{ScaleButtonText}</label>
                <CheckScaleOptionButton
                    ScaleButtonText={ScaleButtonText}
                    setScaleBeforeSlice={(value: boolean) => setScaleBeforeSlice(value)}
                />
            </div>

            <div className="form-container--lineblock">
                <label>Scaling format</label>
                <SelectScaleOptions
                    setScalingFormat={(value: string) => setScalingFormat(value)}
                />
            </div>

            <div className="form-container--lineblock">
                <label>Slicing format</label>
                <SelectSliceOptions
                    setSlicingFormat={(value: string) => setSlicingFormat(value)}
                />
            </div>

            <div className="form-container--lineblock">
                <SliceButton
                    SliceButtonText={SliceButtonText}
                    SliceFunction={() => sliceLoadedPdfRequest(requestParamsForSlice)}
                />
            </div>
        </>
    );
};

/*

                <SelectScaleOptions
                    setScalingFormat={(value: string) => setScalingFormat(value)}
                />


*/