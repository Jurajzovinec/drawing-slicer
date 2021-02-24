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
    setIsSlicedPdfReadyOnAWS: Function
    setIsAppLoading: Function
}

export const FormPart: React.FC<PageAreaInfs> = ({ ScaleButtonText, SliceButtonText, LoadedPdfName, setIsErrorInfoModalOpen, setInfoModalMessage, setIsSlicedPdfReadyOnAWS, setIsAppLoading }) => {

    const [scaleBeforeSlice, setScaleBeforeSlice] = useState<boolean>(() => false);
    const [scaleToFormat, setScaleToFormat] = useState<string>(() => DrawingFormats[0].toLowerCase());
    const [sliceByFormat, setSliceByFormat] = useState<string>(() => DrawingFormats[0].toLowerCase());

    const requestParamsForSlice: SliceDrawingParameters = {
        scaleBeforeSlice,
        scaleToFormat,
        sliceByFormat,
        filename: LoadedPdfName
    }

    function sliceLoadedPdfRequest(args: SliceDrawingParameters):void {
        setIsAppLoading(true)
        setIsSlicedPdfReadyOnAWS(false)
        getSlicePdfFile(args)
            .then(response => response.text())
            .then(response => JSON.parse(response))
            .then(response => {
                if (response.Status === "OK") {
                    setIsAppLoading(false)
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
            <div className="form-container--scalefrom">
                <CheckScaleOptionButton
                    ScaleButtonText={ScaleButtonText}
                    setScaleBeforeSlice={(value: boolean) => setScaleBeforeSlice(value)}
                />
                <SelectScaleOptions
                    setScaleToFormat={(value: string) => setScaleToFormat(value)}
                />
            </div>
            <div className="form-container--sliceform">
                <SliceButton
                    SliceButtonText={SliceButtonText}
                    SliceFunction={() => sliceLoadedPdfRequest(requestParamsForSlice)}
                />
                <SelectSliceOptions
                    setSliceByFormat={(value: string) => setSliceByFormat(value)}
                />
            </div>
        </>
    );
};