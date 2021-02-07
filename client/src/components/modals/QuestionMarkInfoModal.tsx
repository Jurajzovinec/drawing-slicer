import React from 'react';
import Modal from 'react-modal';
import './QuestionMarkInfoModal.css';

const closeIcon = process.env.PUBLIC_URL + "/closeIcon.png";
const downloadIcon = process.env.PUBLIC_URL + "/downloadIcon.png";

Modal.setAppElement('#root');

interface QuestionMarkInfoModalProps {
    isShown: boolean;
    onClose: () => void;
}

const requestExampleData = (): Promise<(string)> => {
    console.log("...askingForExamplePDF...");
    return new Promise(async (resolve, reject) => {

        const urlToFetch =  process.env.NODE_ENV === 'production'?  "https://drawing-slicer.herokuapp.com/exampledata" : "http://localhost:5050/exampledata";

        fetch(urlToFetch, {
            method: 'GET',
        })
            .then(response => response.blob())
            .then(blobityBlob => {
                const blobUrl = window.URL.createObjectURL(blobityBlob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.setAttribute('download', 'resultedSlicedPdf.zip');
                document.body.appendChild(link);
                link.click();
                link.parentNode!.removeChild(link);
            })
            .catch(err => reject(err))
    })
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
                        <img src={downloadIcon} className="download-pdf-img" alt={'Download PDF'} onClick={requestExampleData} />
                    </div>
                </div>
            </div>
        </div> : null;


