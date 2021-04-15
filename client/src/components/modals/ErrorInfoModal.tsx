import React from 'react';
import Modal from 'react-modal';
import './ErrorInfoModal.css';

const closeIcon = process.env.PUBLIC_URL + "/closeIcon.png";

// Modal.setAppElement('#root');

interface ErrorInfoModalProps {
    isShown: boolean;
    infoMessage: undefined | string;
    onClose: () => void;
}

export const ErrorInfoModal: React.FC<ErrorInfoModalProps> = ({ isShown, infoMessage, onClose }) => 
    isShown ? 
    <div className="modal">
        <div className="modal-overlay">
            <div className="modal-box">
                <div className="modal-close btn" >
                    <img src={closeIcon} className="close-modal-img" alt={'Close modal'} onClick={onClose} />
                </div>
                <div className="modal-text">
                    <p>{infoMessage}</p>
                </div>
            </div>
        </div>
    </div> : null;


