import PyPDF2
import copy
from application_library.pdf_slicer_lib import *

# scale_factor = 1
input_drawing_file = open('C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\VykresA4_1.pdf', "rb")
# input_drawing_file = open('VykresA1_1.pdf', "rb")b n

def slice_service(input_drawing_file, slice_by_format):

    pdf_object = PdfSlicer(input_drawing_file)
    pdf_object.get_page_dimensions()
    pdf_object.determine_input_drawing_format()
    return pdf_object.slice_by_specific_format(slice_by_format)

def scale_service(input_drawing_file, scale_by_format):

    pdf_object = PdfSlicer(input_drawing_file)
    return pdf_object.scale_to_specific_format(scale_by_format)




























""" page_one = pdf_reader.getPage(0)
scaled_page = copy.copy(page_one)
scaled_page.scaleBy(scale_factor)
layouts = generate_layouts(page_one, scaled_page)
writer = PyPDF2.PdfFileWriter()

for each_page in layouts:
    copied_drawing = copy.copy(scaled_page)
    copied_drawing.cropBox.lowerLeft = [
        each_page["absolute_position_x_start"], 
        each_page["absolute_position_y_start"]
    ]
    copied_drawing.cropBox.upperRight = [
        each_page["absolute_position_x_end"],
        each_page["absolute_position_y_end"]
    ]
    if each_page['relative_position_x'] != 0 and each_page['relative_position_x'] != 4:
        h = round(float(copied_drawing.mediaBox.getHeight()) * 0.352777777)
        w = round(float(copied_drawing.mediaBox.getWidth()) * 0.352777777)
        # print(h, w)
    writer.addPage(copied_drawing)

with open('public\\result.pdf', 'wb') as output_result_file:
    writer.write(output_result_file) """
