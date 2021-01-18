from application_library.pdf_slicer_lib import *
import logging
import sys

LOG_FORMAT = "%(asctime)s %(levelname)s %(filename)s %(lineno)s - %(message)s"
logging.basicConfig(filename = "TestInputService.log", level = logging.DEBUG, format = LOG_FORMAT)
logger = logging.getLogger()
logger.info("Test Slice_service initilized.")
logger.info(f"Arguments are {str(sys.argv)}")

if __name__ == "__main__":
    input_drawing_file = sys.argv[1]
    slice_to_format = "a8"
    kwargs = {}
    try:
        kwargs = sys.argv[3]
        logger.info(kwargs)
    except Exception as error:
        logger.critical(error)       
    try:
        pdf_object = PdfSlicer(input_drawing_file, slice_to_format, kwargs=kwargs)
        pdf_object.main_run()
    except Exception as error:
        logger.critical(error)

