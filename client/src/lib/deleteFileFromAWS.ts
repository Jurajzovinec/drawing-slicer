import config from '../config';

export default function deleteFileFromAWS (): void  {

    console.log("...sendingRequestToClearBackendStorage...");
    
    const urlToFetch = `${config.BACKEND_SERVER}/clearawsbucket`
    fetch(urlToFetch)

}