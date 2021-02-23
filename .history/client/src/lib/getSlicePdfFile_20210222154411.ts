import config from '../config';
import SliceDrawingParameters from '../types/sliceDrawingParameters';

export default function getSlicePdfFile (args: SliceDrawingParameters) {

    console.log("...askingForSlicedPdfFile...");

    const urlToFetch = `${config.BACKEND_SERVER}/clearawsbucket/${args}`
    fetch(urlToFetch)

}