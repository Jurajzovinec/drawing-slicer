from application_library.pdf_slicer_lib import *
import logging
import sys

LOG_FORMAT = "%(asctime)s %(levelname)s %(filename)s %(lineno)s - %(message)s"
logging.basicConfig(filename = "InputTestService.log", level = logging.DEBUG, format = LOG_FORMAT)
logger = logging.getLogger()
logger.info("Input test service initilized.")
logger.info(f"Arguments are {str(sys.argv)}")

def init_arguments():
    
    try:
        input_file = sys.argv[1]
        slice_by_format = "none"
        scale_to_format = "none"
    except Exception as error:
        logger.critical(error)
        print(str(error), flush=True)
        exit(1)
    else:
        return {
                "input_file":input_file, 
                "slice_by_format":slice_by_format,
                "scale_to_format": scale_to_format
                }

def main():

    try:
        pdf_object = PdfSlicer(**init_arguments())

    except Exception as error:
        print(f"Ooops!: {str(error)}", flush=True)
        logger.critical(error)
        exit(1)
    else:
        print({'NumberOfPages':pdf_object.number_of_pages})        
        print({'DrawingFormat':pdf_object.input_drawing_format['drawing_format']})        
        logger.info("Successful input_test_service.py")

if __name__ == "__main__":
    try:
        main()
    except:
        print(str(error), flush=True)
        print(f"Ooops!:, something is wrong with python microservice. Check InputTestService.log file, ErrorMsg: {str(error)}", flush=True)
        logger.critical(str(error))
    