import React from "react";

const questionMarkIcon = process.env.PUBLIC_URL + "/questionmarkIcon.png";

interface QuestionMarkReferencelProps {
    setIsQuestionMarkInfoModalOpen: Function;
}

export const QuestionMarkReference: React.FC<QuestionMarkReferencelProps> = ({setIsQuestionMarkInfoModalOpen}) => {

    const invokeQuestionMark = () => setIsQuestionMarkInfoModalOpen(true)

    return (
        <div className="question-mark-icon" onClick={invokeQuestionMark}>
            <img src={questionMarkIcon} className="header--navbar-img"/>
        </div>
    );
};