import config from '../config';
import deleteFileFromAWS from './deleteFileFromAWS';

export default function getDownloadFileFromAWS(fileResultPath: string | any): Promise<(string)> {

    console.log("...askingForResultPDF...");

    const urlToFetch = `${config.BACKEND_SERVER}/filedownload/{"requestedFileName":"${fileResultPath}"}`;

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
                link.setAttribute('download', `SlicedByDrawingSlicer_${fileResultPath}`);
                document.body.appendChild(link);
                link.click();
                link.parentNode!.removeChild(link);
                window.URL.revokeObjectURL(blobObj.toString());
                return 'Succes'
            })
            .then(result => {
                if (result == 'Succes') {
                    deleteFileFromAWS()
                    resolve(result)
                } else {
                    reject('File was not downloaded correctly.')
                }
            })
            .catch(err => reject(err))
    })
}