from application_library.pdf_slicer_lib import *
import logging
import sys

LOG_FORMAT = "%(asctime)s %(levelname)s %(filename)s %(lineno)s - %(message)s"
logging.basicConfig(filename = "SliceService.log", level = logging.DEBUG, format = LOG_FORMAT)
logger = logging.getLogger()
logger.info("Slice service initilized.")
logger.info(f"Arguments are {str(sys.argv)}")

def init_arguments():
    
    try:
        input_file = sys.argv[1]
        scale_to_format = sys.argv[2]
        slice_by_format = sys.argv[3]
    except Exception as error:
        logger.critical(error)
        print(str(error), flush=True)
        exit(1)
    else:
        logger.info(scale_to_format)
        return {
                "input_file":input_file, 
                "slice_by_format":slice_by_format,
                "scale_to_format": scale_to_format
                }

def main():
    
    try:
        pdf_object = PdfSlicer(**init_arguments())
        resultPdfName = pdf_object.main_run()
    except Exception as error:
        print(f"Ooops!: {str(error)}", flush=True)
        logger.critical(error)
        exit(1)
    else:
        print({'Success':'Successful slice_service.py'})        
        print({'ResultPdfName':resultPdfName})        
        logger.info("Successful slice_service.py")

if __name__ == "__main__":
    try:
        main()
    except:
        print(str(error), flush=True)
        print(f"Ooops!, something is wrong with python microservice. Check InputTestService.log file, ErrorMsg: {str(error)}", flush=True)
        logger.critical(str(error))
    
    
    

