import React from "react";

const linkedInIcon = process.env.PUBLIC_URL + "/linkedinIcon.png";

const navigateToLinkedIn = (link: string) => (event: any) => {
    const win = window.open(link, '_blank');
    win!.focus();
};

export const LinkedInReference: React.FC<{ link: string }> = ({link}) => {
    return (
        <div className="linked-in-ref" >
            <img src={linkedInIcon} className="header--navbar-img" onClick={navigateToLinkedIn(link)} />
        </div>
    );
};