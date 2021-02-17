from application_library.pdf_slicer_lib import *
from aws_s3_services.aws_s3_download_file import *
from aws_s3_services.aws_s3_upload_file import *
import logging
import sys


LOG_FORMAT = "%(asctime)s %(levelname)s %(filename)s %(lineno)s - %(message)s"
logging.basicConfig(filename = "SliceService.log", level = logging.DEBUG, format = LOG_FORMAT)
logger = logging.getLogger()
logger.info("Slice service initilized.")
logger.info(f"Arguments are {str(sys.argv)}")

def init_arguments():
    
    try:

        input_file = download_from_aws_s3(sys.argv[1])
        scale_to_format = sys.argv[2]
        slice_by_format = sys.argv[3]
        
    except Exception as error:
        logger.critical(error)
        print(str(error), flush=True)
        exit(1)
    else:
        logger.info(scale_to_format)
        return {
                "input_file":input_file['file_stream'], 
                "slice_by_format":slice_by_format,
                "scale_to_format": scale_to_format,
                "filename": input_file['filename']
                }

def main():
    
    try:
        pdf_object = PdfSlicer(**init_arguments())
        logger.info(init_arguments())
        result_pdf_object = pdf_object.main_run()
        upload_to_aws_s3(result_pdf_object)
    except Exception as error:
        print(f"Ooops!: {str(error)}", flush=True)
        logger.critical(error)
        exit(1)
    else:
        print({'Success':'Successful slice_service.py'})        
        print({'ResultPdfName':result_pdf_object['filename']})        
        logger.info("Successful slice_service.py")

if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(str(error), flush=True)
        print(f"Ooops!, something is wrong with python microservice. Check InputTestService.log file, ErrorMsg: {str(error)}", flush=True)
        logger.critical(str(error))
    
    
    

