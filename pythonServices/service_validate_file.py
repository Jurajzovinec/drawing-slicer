from application_library.pdf_slicer_lib import *
from aws_s3_services.aws_s3_download_file import *
import logging
import sys

"""
LOG_FORMAT = "%(asctime)s %(levelname)s %(filename)s %(lineno)s - %(message)s"
logging.basicConfig(filename = "public/InputTestService.log", level = logging.DEBUG, format = LOG_FORMAT)
logger = logging.getLogger()
logger.info("Input test service initilized.")
logger.info(f"Arguments are {str(sys.argv)}")
"""

def init_arguments():
    
    try:
        input_file = download_from_aws_s3(sys.argv[1])['file_stream']
        slice_by_format = "none"
        scale_to_format = "none"
    except Exception as error:
        # logger.critical(error)
        raise error
        exit(1)
    else:
        return {
                "input_file":input_file, 
                "slice_by_format":slice_by_format,
                "scale_to_format": scale_to_format,
                "filename": sys.argv[1]
                }

def main():

    try:
        pdf_object = PdfSlicer(**init_arguments())
    except Exception as error:
        # logger.critical(error)
        raise error
        exit(1)
    else:
        print({'NumberOfPages':pdf_object.number_of_pages}, flush=True)        
        print({'DrawingFormat':pdf_object.input_drawing_format['drawing_format']}, flush=True)
        print({'Filename':sys.argv[1]}, flush=True)
        # logger.info("Successful input_test_service.py")

if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(str(error), flush=True)
        print(f"Ooops!:, something is wrong with python microservice. Check InputTestService.log file, ErrorMsg: {str(error)}", flush=True)
        # logger.critical(str(error))
    