import React from "react";

const githubIcon = process.env.PUBLIC_URL + "/githubIcon.png";

const navigateToGitHub = (link: string)  => (event: any) => {
    const win = window.open(link, '_blank');
    win!.focus();
};

export const GitHubReference: React.FC<{ link: string }> = ({link}) => {
    return (
        <div className="git-hub-ref">
            <img src={githubIcon} className="nav-bar-img" onClick={navigateToGitHub(link)} />
        </div>
    );
};