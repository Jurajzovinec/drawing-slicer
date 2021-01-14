import React from "react";

const questionMarkIcon = process.env.PUBLIC_URL + "/questionmarkIcon.png";


export const QuestionMarkReference: React.FC = () => {
    return (
        <div className="question-mark-icon" >
            <img src={questionMarkIcon} className="nav-bar-img"/>
        </div>
    );
};