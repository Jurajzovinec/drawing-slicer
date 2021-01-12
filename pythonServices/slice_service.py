from application_library.pdf_slicer_lib import *

input_drawing_file = open('C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\VykresA1_1.pdf', "rb")
# input_drawing_file = open('VykresA1_1.pdf', "rb")b n

def slice_service(input_drawing_file, slice_to_format, **kwargs):
    
    pdf_object = PdfSlicer(input_drawing_file, slice_to_format, kwargs=kwargs)
    return pdf_object.main_run()

#slice_service(input_drawing_file, "a5", scale_to_format = "a1")
#slice_service(input_drawing_file, "a4", scale_to_format = "a2")
#slice_service(input_drawing_file, "a4")