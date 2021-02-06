import React from 'react';
import Modal from 'react-modal';
import './QuestionMarkInfoModal.css';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import fs from 'fs';


const closeIcon = process.env.PUBLIC_URL + "/closeIcon.png";
const downloadIcon = process.env.PUBLIC_URL + "/downloadIcon.png";
const pdfFolderToZip = process.env.PUBLIC_URL + "/pdf_Examples";
const pdfFileToZip = process.env.PUBLIC_URL + "/pdf_Examples/FruitFlyDispenser_A3_format_1_page.pdf";


Modal.setAppElement('#root');

interface QuestionMarkInfoModalProps {
    isShown: boolean;
    onClose: () => void;
}

const zipAndDownloadFolder = () => {

    const convertFileToBase64 = (filePath: string) => {
        return new Promise((resolve, reject) => {

            const blobbityBlob = new Blob([filePath])
            const fileReader = new FileReader();
            // fileReader.readAsDataURL(filePath);
            fileReader.readAsArrayBuffer(blobbityBlob);

            fileReader.addEventListener('loadend', () => resolve(fileReader.result))
            fileReader.addEventListener('error', (error) => reject(error))
        })
    }

    const zipPDF = (readedBase64Data:any) => {
        const zip = new JSZip();
        zip.file("Test.pdf", readedBase64Data, { base64: true });
        zip.generateAsync({ type: "base64" }).then(function (content) {
            FileSaver.saveAs(content, "pdfExamples.zip");
        });
    }

    convertFileToBase64(pdfFileToZip)
    .then(zipPDF)


}




export const QuestionMarkInfoModal: React.FC<QuestionMarkInfoModalProps> = ({ isShown, onClose }) =>
    isShown ?
        <div className="modal">
            <div className="modal-overlay">
                <div className="modal-box">
                    <div className="modal-close btn" >
                        <img src={closeIcon} className="close-modal-img" alt={'Close modal'} onClick={onClose} />
                    </div>
                    <div className="modal-text">
                        <h2>What is Drawing Slicer ?</h2>
                        <p>Drawing slicer is single web page application, which may slice your giant formats (A1 or A0) to multiple A4 (or any smaller) formats ! Then you are able to print your drawing on home printer and glue the piecies together.</p>
                        <h2>I would like to only test it</h2>
                        <p>In case you just want to test the functionality of the application and have not any drawings you can try download files in attachment below.</p>
                    </div>
                    <div className="modal-download btn" >
                        <img src={downloadIcon} className="download-pdf-img" alt={'Download PDF'} onClick={zipAndDownloadFolder} />
                    </div>
                </div>
            </div>
        </div> : null;


