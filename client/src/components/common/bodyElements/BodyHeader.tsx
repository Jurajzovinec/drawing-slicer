import React from "react";
import { BarLoader } from 'react-spinners';

export const BodyHeader: React.FC<{ text: string }> = ({ text }) => {
    return (
        <h1>{text}</h1>
    );
};