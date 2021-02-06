import React, { useState } from 'react';
import './App.css';
import { GitHubReference } from './components/common/logosRefs/GitHubReference';
import { LinkedInReference } from './components/common/logosRefs/LinkedInReference';
import { QuestionMarkReference } from './components/common/logosRefs/QuestionMarkReference';
import { BodyHeader } from './components/common/bodyElements/BodyHeader';
import { LoadPdfArea } from './components/common/bodyElements/LoadPdfArea';
import { FormPart } from './components/common/bodyElements/FormPart';
import { InfoPdfArea } from './components/common/bodyElements/InfoPdfArea';
import { ErrorInfoModal } from './components/modals/ErrorInfoModal';
import { RestartButton } from './components/common/interfaceButtons/RestartButton';
import { QuestionMarkInfoModal } from './components/modals/QuestionMarkInfoModal';

function App() {

  const [isPdfConfirmed, setIsPdfConfirmed] = useState<boolean>(() => false);
  const [pdfNumberOfPages, setPdfNumberOfPages] = useState<string | undefined>(() => undefined);
  const [pdfFormat, setPdfFormat] = useState<string | undefined>(() => undefined);

  const [isErrorInfoModalOpen, setIsErrorInfoModalOpen] = useState<boolean>(() => false);
  const [infoModalMessage, setInfoModalMessage] = useState<string | undefined>(() => undefined);

  const [isQuestionMarkInfoModalOpen, setIsQuestionMarkInfoModalOpen] = useState<boolean>(() => false);

  const [loadedPdfFile, setLoadedPdfFile] = useState<undefined | File>(() => undefined);

  const toggleErrorInfoModal = () => setIsErrorInfoModalOpen(!isErrorInfoModalOpen);
  const toggleQuestionMarkInfoModal = () => setIsQuestionMarkInfoModalOpen(!isQuestionMarkInfoModalOpen);

  function RestartApp() {
    setIsPdfConfirmed(false);
    setPdfNumberOfPages(undefined);
    setPdfFormat(undefined);
    setLoadedPdfFile(undefined);
  }

  return (
    <div className="App">

      <div className="Header">
        < QuestionMarkReference 
            setIsQuestionMarkInfoModalOpen={(value:boolean) => setIsQuestionMarkInfoModalOpen(value)}
        />
        < LinkedInReference link={"https://www.linkedin.com/in/juraj-zovinec/"} />
        < GitHubReference link={"https://github.com/Jurajzovinec/drawing-slicer"} />
      </div>

      <div className="Body">
        <BodyHeader text={"Welcome to Drawing Slicer !"} />
        <div className="user-interface">
          {
            !isPdfConfirmed ?
              <div className="load-pdf-area-container">
                <LoadPdfArea
                  setIsPdfConfirmed={(value: boolean) => setIsPdfConfirmed(value)}
                  setPdfNumberOfPages={(value: string) => setPdfNumberOfPages(value)}
                  setPdfFormat={(value: string) => setPdfFormat(value)}
                  setInfoModalMessage={(value: string | undefined) => setInfoModalMessage(value)}
                  setIsErrorInfoModalOpen={(value: boolean) => setIsErrorInfoModalOpen(value)}
                  setLoadedPdfFile={(value: any) => setLoadedPdfFile(value)}
                  buttonText={"Or navigate me !"}
                  dragAndDropText={"Drag and drop your PDF drawing here."} />
              </div> : null
          }
          {
            isPdfConfirmed ?
              <div className="info-pdf-area-container">
                <InfoPdfArea isPdfSinglePage={pdfNumberOfPages} pdfInputFormat={pdfFormat} />
              </div> : null
          }

          <div className="form-container" {...!isPdfConfirmed ? { "aria-disabled": true } : {}}>
            <FormPart
              ScaleButtonText={"Scale before slice ? "}
              SliceButtonText={"Slice drawing"}
              LoadedPdfData={loadedPdfFile}
              setInfoModalMessage={(value: string | undefined) => setInfoModalMessage(value)}
              setIsErrorInfoModalOpen={(value: boolean) => setIsErrorInfoModalOpen(value)}
            />
          </div>
        </div>

        <div>
          <ErrorInfoModal
            isShown={isErrorInfoModalOpen}
            infoMessage={infoModalMessage}
            onClose={toggleErrorInfoModal}
          />
        </div>
        <div>
          <QuestionMarkInfoModal
            isShown={isQuestionMarkInfoModalOpen}
            onClose={toggleQuestionMarkInfoModal}
          />
        </div>
        <div className="restart-button-container">
          {isPdfConfirmed ?
            <RestartButton ClearStates={() => RestartApp()} ResetButtonText={'Go Again !'} /> : null
          }
        </div>

      </div>

    </div>
  );
}

export default App;
