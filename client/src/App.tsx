import React, { useState } from 'react';
import './App.css';
import { BarLoader } from 'react-spinners';
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
import { DownloadButtonSlicedPdf } from './components/common/interfaceButtons/DownloadButtonSlicedPdf';
import getDownloadFileFromAWS from './lib/getDownloadFromAWS';


function App() {

  const [isPdfConfirmed, setIsPdfConfirmed] = useState<boolean>(() => false);
  const [pdfNumberOfPages, setPdfNumberOfPages] = useState<string | undefined>(() => undefined);
  const [pdfFormat, setPdfFormat] = useState<string | undefined>(() => undefined);

  const [isErrorInfoModalOpen, setIsErrorInfoModalOpen] = useState<boolean>(() => false);
  const [infoModalMessage, setInfoModalMessage] = useState<string | undefined>(() => undefined);

  const [isQuestionMarkInfoModalOpen, setIsQuestionMarkInfoModalOpen] = useState<boolean>(() => false);

  const [loadedPdfFile, setLoadedPdfFile] = useState<undefined | File>(() => undefined);
  const [loadedPdfFileName, setloadedPdfFileName] = useState<undefined | string>(() => undefined);
  const [isSlicedPdfReadyOnAWS, setIsSlicedPdfReadyOnAWS] = useState<boolean>(() => false);

  const [isAppLoading, setIsAppLoading] = useState<boolean>(() => false);

  const toggleErrorInfoModal = () => setIsErrorInfoModalOpen(!isErrorInfoModalOpen);
  const toggleQuestionMarkInfoModal = () => setIsQuestionMarkInfoModalOpen(!isQuestionMarkInfoModalOpen);

  function RestartApp() {
    setIsPdfConfirmed(false);
    setPdfNumberOfPages(undefined);
    setPdfFormat(undefined);
    setLoadedPdfFile(undefined);
    setloadedPdfFileName(undefined);
    setIsSlicedPdfReadyOnAWS(false)
  }

  return (
    <div className="App">

      <div className="Header">
        < QuestionMarkReference
          setIsQuestionMarkInfoModalOpen={(value: boolean) => setIsQuestionMarkInfoModalOpen(value)}
        />
        < LinkedInReference link={"https://www.linkedin.com/in/juraj-zovinec/"} />
        < GitHubReference link={"https://github.com/Jurajzovinec/drawing-slicer"} />
      </div>

      <div className="Body">

        <div className="body--header">
          <BodyHeader text={"Welcome to Drawing Slicer"} />
          <div className="body--header--barloader">
            <BarLoader color={"yellow"} width={500} height={1} loading={isAppLoading} />
          </div>
        </div>

        <div className="body--userinterface">
          {
            !isPdfConfirmed ?
              <div className="userinterface--loadpdfarea-container">
                <LoadPdfArea
                  setIsPdfConfirmed={(value: boolean) => setIsPdfConfirmed(value)}
                  setPdfNumberOfPages={(value: string) => setPdfNumberOfPages(value)}
                  setPdfFormat={(value: string) => setPdfFormat(value)}
                  setInfoModalMessage={(value: string | undefined) => setInfoModalMessage(value)}
                  setIsErrorInfoModalOpen={(value: boolean) => setIsErrorInfoModalOpen(value)}
                  setLoadedPdfFile={(value: any) => setLoadedPdfFile(value)}
                  setloadedPdfFileName={(value: any) => setloadedPdfFileName(value)}
                  setIsAppLoading={(value: boolean) => setIsAppLoading(value)}
                  dragAndDropText={"Drag and drop your PDF drawing here."} />
              </div> : null
          }

          {
            isPdfConfirmed ?
              <div className="userinterface--infopdfarea-container">
                <InfoPdfArea isPdfSinglePage={pdfNumberOfPages} pdfInputFormat={pdfFormat} />
              </div> : null
          }

          <div className="userinterface--form-container" {...!isPdfConfirmed ? { "aria-disabled": true } : {}}>
            <FormPart
              ScaleButtonText={"Scale before slice ? "}
              SliceButtonText={"Slice drawing"}
              LoadedPdfName={loadedPdfFileName}
              setInfoModalMessage={(value: string | undefined) => setInfoModalMessage(value)}
              setIsErrorInfoModalOpen={(value: boolean) => setIsErrorInfoModalOpen(value)}
              setIsSlicedPdfReadyOnAWS={(value: boolean) => setIsSlicedPdfReadyOnAWS(value)}
              setIsAppLoading={(value: boolean) => setIsAppLoading(value)}
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
        <div className="body--footercontrolbuttons-container">
          <div className="footercontrolbuttons-container--restartbutton-container">
            {isPdfConfirmed ?
              <RestartButton ClearStates={() => RestartApp()} ResetButtonText={'Go Again !'} /> : null
            }
          </div>
          <div className="footercontrolbuttons-container--downloadbutton-container">
            {isSlicedPdfReadyOnAWS ?
              <DownloadButtonSlicedPdf
                PreparedSlicedPdf={loadedPdfFileName}
                RestartAppStates={()=>RestartApp()}
                RequestFileFromAws={() => getDownloadFileFromAWS(loadedPdfFileName)}
                DownloadButtonText={"Download sliced pdf"}
                setIsAppLoading={(value: boolean) => setIsAppLoading(value)}
              /> : null

            }
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
