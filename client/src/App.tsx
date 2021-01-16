import React, { useState } from 'react';
import './App.css';
import { GitHubReference } from './components/common/logosRefs/GitHubReference';
import { LinkedInReference } from './components/common/logosRefs/LinkedInReference';
import { QuestionMarkReference } from './components/common/logosRefs/QuestionMarkReference';
import { BodyHeader } from './components/common/bodyElements/BodyHeader';
import { LoadPdfArea } from './components/common/bodyElements/LoadPdfArea';
import { FormPart } from './components/common/bodyElements/FormPart';
import { InfoPdfArea } from './components/common/bodyElements/InfoPdfArea';

function App() {

  const [isPdfLoaded, setIsPdfLoaded] = useState(() => false);
  const [isSlicingAllowed, setisSlicingAllowed] = useState(() => ({"aria-disabled": true}));

  return (
    <div className="App">
      <div className="Header">
        < QuestionMarkReference />
        < LinkedInReference link={"https://www.linkedin.com/in/juraj-zovinec/"} />
        < GitHubReference link={"https://github.com/Jurajzovinec/drawing-slicer"} />
      </div>
      <div className="Body">
        <BodyHeader text={"Welcome to Drawing Slicer !"} />
        <div className="user-interface">
          {
            !isPdfLoaded ? <div className="load-pdf-area-container">
                <LoadPdfArea buttonText={"Or navigate me !"} dragAndDropText={"Drag and drop your PDF drawing here."} />
              </div> : null
          }
          {
            isPdfLoaded ? <div className="info-pdf-area-container">
                <InfoPdfArea isPdfSinglePage={"YES"} pdfInputFormat={"A4"} />
              </div> : null
          }
          <div className="form-container" {...isSlicingAllowed}>
            <FormPart ScaleButtonText={"Scale before slice ? "} SliceButtonText={"Slice drawing"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
