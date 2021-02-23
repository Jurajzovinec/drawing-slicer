import config from '../config';
import SliceDrawingParameters from '../types/sliceDrawingParameters';

export default function getSlicePdfFile(pdfHandleParameters: SliceDrawingParameters): Promise<(any)> {

    console.log("...requestingParamsToSlicePdf...");

    return new Promise((resolve, reject) => {
        const urlToFetch = `${config.BACKEND_SERVER}slice/${JSON.stringify(pdfHandleParameters)}`
        fetch(urlToFetch, {
            method: 'GET',
        })
            .then(resolve)
            .catch(error => reject(error))
    })
}