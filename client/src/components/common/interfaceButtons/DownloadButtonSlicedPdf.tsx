import React from "react";

interface ButtonOptions {
    DownloadButtonText: string;
    PreparedSlicedPdf: undefined | string;
    RequestFileFromAws: Function;
    RestartAppStates: Function;
    setIsAppLoading: Function;
}

export const DownloadButtonSlicedPdf: React.FC<ButtonOptions> = ({ DownloadButtonText, PreparedSlicedPdf, RequestFileFromAws, RestartAppStates, setIsAppLoading }) => {

    const changeStates = () => {
        setIsAppLoading(true)
        RestartAppStates()
        RequestFileFromAws(PreparedSlicedPdf)
        .then(setIsAppLoading(false))
    }

    return (
        <div>
            <button className="btn__download" onClick={() => changeStates()}>{DownloadButtonText}</button>
        </div>
    );
};