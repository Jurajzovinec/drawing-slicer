import PyPDF2
import copy
from .pdf_slicer_exceptions import *

class Pdf_slicer:

    def __init__(self, input_file):
        self.standard_drawing_formats = [
            {"drawing_format": "a0", "dimensions": [841, 1189]},
            {"drawing_format": "a1", "dimensions": [594, 841]},
            {"drawing_format": "a2", "dimensions": [420, 594]},
            {"drawing_format": "a3", "dimensions": [297, 420]},
            {"drawing_format": "a4", "dimensions": [210, 297]},
            {"drawing_format": "a5", "dimensions": [148, 210]},
            {"drawing_format": "a6", "dimensions": [105, 148]},
            {"drawing_format": "a7", "dimensions": [74, 105]},
            {"drawing_format": "a8", "dimensions": [52, 74]},
        ]
        self.input_pdf_object = PyPDF2.PdfFileReader(input_file)
        self.first_page_of_pdf_object = self.input_pdf_object.getPage(0)
        self.input_drawing_format = self.determine_input_drawing_format()
        self.determine_number_of_pages()

    def get_page_dimensions(self):

        heigth_pdf_page = round(
            float(self.first_page_of_pdf_object.mediaBox.getHeight() * 0.352777777))
        width_pdf_page = round(
            float(self.first_page_of_pdf_object.mediaBox.getWidth() * 0.352777777))
        print(
            f'Drawings dimensions are {width_pdf_page} mm and {heigth_pdf_page} mm.')
        return [heigth_pdf_page, width_pdf_page]

    def generate_layouts_positions(input_object, scaled_object):

        input_dims = get_page_area(input_object)
        scaled_dims = get_page_area(scaled_object)

        how_many_will_fit_weight = int(scaled_dims[1]/input_dims[1])
        how_many_will_fit_height = int(scaled_dims[2]/input_dims[2])

        for x in range(how_many_will_fit_weight):
            for y in range(how_many_will_fit_height):
                relative_position_x = x
                relative_position_y = y
                absolute_position_x_start = (x) * input_dims[1]
                absolute_position_y_start = (y) * input_dims[2]
                absolute_position_x_end = (x+1) * input_dims[1]
                absolute_position_y_end = (y+1) * input_dims[2]
                fitted_pdf_object = {
                    "relative_position_x": relative_position_x,
                    "relative_position_y": relative_position_y,
                    "absolute_position_x_start": absolute_position_x_start,
                    "absolute_position_y_start": absolute_position_y_start,
                    "absolute_position_x_end": absolute_position_x_end,
                    "absolute_position_y_end": absolute_position_y_end
                }
                output_field.append(fitted_pdf_object)

        return output_field

    def scale_page_object(input_scale_drawing):
        valid_inputs = ["a1, a2, a3, a4, a5, a6, a7, a8"]
        if not input_scale_drawing in valid_inputs:
            raise InvalidDrawingInputFormat(
                f"Invalid drawing input. Select one of valid inputs {valid_inputs}")
        if self.input_drawing_format['drawing_format'] == input_scale_drawing:
            raise InvalidDrawingInputFormat(
                f"Scaled format equals current format of input PDF.")
        scaled_page = copy.copy(page_object)
        return scaled_page.scaleBy(scale_factor)

    def determine_input_drawing_format(self):
        checked_page_object_dimensions = self.get_page_dimensions()
        print(checked_page_object_dimensions)
        acceptableDeviation = max(checked_page_object_dimensions)*0.002
        try:
            input_drawing_format = next(drawing_format for drawing_format in self.standard_drawing_formats
                                        if max(drawing_format['dimensions']) == max(checked_page_object_dimensions)
                                        and min(drawing_format['dimensions']) == min(checked_page_object_dimensions))
        except StopIteration:
            raise InvalidPdfSizeError(
                f"This is not standard drawing (A0...A8). Input drawing size is {checked_page_object_dimensions}")
        print(
            f"Input drawing is in {input_drawing_format['drawing_format']} format.")

        return {
            "drawing_format": input_drawing_format['drawing_format'],
            "dimensions": checked_page_object_dimensions}

    def determine_number_of_pages(self):
        if (self.input_pdf_object.getNumPages() != 1):
            raise MultiPageInputPdfError(
                f'Input PDF is not single paged. In order to slice PDF, extract document to single paged files.')

    def slice_by_specific_format(self, format_to_slice):
        valid_inputs = ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8"]
        
        if not format_to_slice in valid_inputs:
            raise InvalidDrawingInputFormat(f"Invalid drawing input. Select one of valid inputs {valid_inputs}")
        
        if self.input_drawing_format['drawing_format'] == format_to_slice:
            raise InvalidDrawingInputFormat(f"Slicer format equals current format of input PDF.")

        if valid_inputs.index(format_to_slice) < valid_inputs.index(self.input_drawing_format['drawing_format']):
            raise InvalidDrawingInputFormat(f"""Slicer format is smaller then current format of input PDF.""")
        
        slice_format_dimensions = next(drawing_format for drawing_format in self.standard_drawing_formats
                                       if drawing_format['drawing_format'] == format_to_slice)
        acceptedDeviation = max(self.input_drawing_format['dimensions'])*0.004

        if self.input_drawing_format['dimensions'][0] % slice_format_dimensions['dimensions'][0] < acceptedDeviation:
            slicing_parameters = {"name":"width-width", 
                            "horizontal_offset": slice_format_dimensions['dimensions'][0], 
                            "vertical_offset": slice_format_dimensions['dimensions'][1]}
        elif self.input_drawing_format['dimensions'][0] % slice_format_dimensions['dimensions'][1] < acceptedDeviation:
            slicing_parameters = {"name":"width-height", 
                            "horizontal_offset": slice_format_dimensions['dimensions'][1], 
                            "vertical_offset": slice_format_dimensions['dimensions'][0]}
        else:
            raise AcceptedDeviationError(f""" Program has not found right method to slice objects. 
                                        Accepted deviation is {acceptedDeviation}, 
                                        slicing drawing format is {slice_format_dimensions}, 
                                        sliced(input) format is {self.input_drawing_format}""" )
        
        if slicing_parameters['name'] == "width-width":
            vertical_slices = int(self.input_drawing_format['dimensions'][0] / slice_format_dimensions['dimensions'][0])
            horizontal_slices = int(self.input_drawing_format['dimensions'][1] / slice_format_dimensions['dimensions'][1])
        else:
            vertical_slices = int(self.input_drawing_format['dimensions'][0] / slice_format_dimensions['dimensions'][1])
            horizontal_slices = int(self.input_drawing_format['dimensions'][1] / slice_format_dimensions['dimensions'][0])
        
        output_field = []
        for x in range(vertical_slices):
            for y in range(horizontal_slices):
                relative_position_x = x
                relative_position_y = y
                absolute_position_x_start = (x) * slicing_parameters['horizontal_offset']
                absolute_position_y_start = (y) * slicing_parameters['vertical_offset']
                absolute_position_x_end = (x+1) * slicing_parameters['horizontal_offset']
                absolute_position_y_end = (y+1) * slicing_parameters['vertical_offset']
                fitted_pdf_object = {
                    "relative_position_x": relative_position_x,
                    "relative_position_y": relative_position_y,
                    "absolute_position_x_start": absolute_position_x_start,
                    "absolute_position_y_start": absolute_position_y_start,
                    "absolute_position_x_end": absolute_position_x_end,
                    "absolute_position_y_end": absolute_position_y_end
                }
                output_field.append(fitted_pdf_object)

        for each in output_field:
            print(each)

        return output_field

        
