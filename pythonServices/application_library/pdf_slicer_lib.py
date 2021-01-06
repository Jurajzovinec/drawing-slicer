import PyPDF2
import copy
from .pdf_slicer_exceptions import *

class PdfSlicer:

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
        self.input_pdf_object = self.init_pdf_file(input_file)
        self.first_page_of_pdf_object = self.input_pdf_object.getPage(0)
        self.input_drawing_format = self.determine_input_drawing_format()
        self.determine_number_of_pages()

    def init_pdf_file(self, input_file):
        
        try:
            pdf_file = PyPDF2.PdfFileReader(input_file)
        except OSError:
            raise InvalidInputPdfFile("Input file is not formated as PDF.")
        else:
            return pdf_file

    def get_page_dimensions(self):

        heigth_pdf_page = round(
            float(self.first_page_of_pdf_object.mediaBox.getHeight() * 0.352777777))
        width_pdf_page = round(
            float(self.first_page_of_pdf_object.mediaBox.getWidth() * 0.352777777))
        
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

    def determine_input_drawing_format(self):
        checked_page_object_dimensions = self.get_page_dimensions()
        
        acceptableDeviation = max(checked_page_object_dimensions)*0.002
        try:
            input_drawing_format = next(drawing_format for drawing_format in self.standard_drawing_formats
                                        if max(drawing_format['dimensions']) == max(checked_page_object_dimensions)
                                        and min(drawing_format['dimensions']) == min(checked_page_object_dimensions))
        except StopIteration:
            raise InvalidPdfSizeError(
                f"This is not standard drawing (A0...A8). Input drawing size is {checked_page_object_dimensions}")
        
        return {
            "drawing_format": input_drawing_format['drawing_format'],
            "dimensions": checked_page_object_dimensions}

    def determine_number_of_pages(self):
        if (self.input_pdf_object.getNumPages() != 1):
            raise MultiPageInputPdfError(
                f'Input PDF is not single paged. In order to slice PDF, extract document to single paged files.')

    def scale_to_specific_format(self, format_to_scale):
        scaling_parameters = self.determine_slice_or_scale_method(format_to_scale, "scale")

        if scaling_parameters['name'] == "width-width": 
            vertical_scale_ratio = int(scaling_parameters['vertical_offset'] / self.input_drawing_format['dimensions'][1])
            horizontal_scale_ratio = int(scaling_parameters['horizontal_offset'] / self.input_drawing_format['dimensions'][0])
        else:
            vertical_scale_ratio = int(scaling_parameters['vertical_offset'] / self.input_drawing_format['dimensions'][1])
            horizontal_scale_ratio = int(scaling_parameters['horizontal_offset'] / self.input_drawing_format['dimensions'][0])
        
        scale_ratio = float(vertical_scale_ratio + horizontal_scale_ratio)/2
        
        return scale_ratio

    def slice_by_specific_format(self, format_to_slice):
        
        slicing_parameters = self.determine_slice_or_scale_method(format_to_slice, "slice")

        if slicing_parameters['name'] == "width-width":
            vertical_slices = int(self.input_drawing_format['dimensions'][0] / slicing_parameters['horizontal_offset'])
            horizontal_slices = int(self.input_drawing_format['dimensions'][1] / slicing_parameters['vertical_offset'])
        else:
            vertical_slices = int(self.input_drawing_format['dimensions'][0] / slicing_parameters['vertical_offset'])
            horizontal_slices = int(self.input_drawing_format['dimensions'][1] / slicing_parameters['horizontal_offset'])
        
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

        return output_field

    def determine_slice_or_scale_method(self, manipulation_format, manipulation_method):

        valid_inputs = ["a8", "a7", "a6", "a5", "a4", "a3", "a2", "a1", "a0"]
        valid_manipulation_methods = ["slice", "scale"]

        if not manipulation_method in valid_manipulation_methods:
            raise InvalidManipulationMethod(f"Invalid drawing input. Select one of valid method inputs {valid_manipulation_methods}")
        
        if not manipulation_format in valid_inputs:
            raise InvalidDrawingInputFormat(f"Invalid drawing input. Select one of valid format inputs {valid_inputs}")
        
        if self.input_drawing_format['drawing_format'] == manipulation_format:
            raise InvalidDrawingInputFormat(f"Slicer format equals current format of input PDF.")

        if valid_inputs.index(manipulation_format) > valid_inputs.index(self.input_drawing_format['drawing_format']) and manipulation_method == "slice":
            raise InvalidDrawingInputFormat(f"""Slicing format is larger than current format of input PDF.""")

        if valid_inputs.index(manipulation_format) < valid_inputs.index(self.input_drawing_format['drawing_format']) and manipulation_method == "scale":
            raise InvalidDrawingInputFormat(f"""Scaling format is smaller than current format of input PDF.""")
        
        manipulation_format_dimensions = next(drawing_format for drawing_format in self.standard_drawing_formats
                                        if drawing_format['drawing_format'] == manipulation_format)
        acceptedDeviation = max(self.input_drawing_format['dimensions'])*0.004

        if self.input_drawing_format['dimensions'][0] % manipulation_format_dimensions['dimensions'][0] < acceptedDeviation and manipulation_method == "slice":
            manipulation_parameters = {
                "name":"width-width", 
                "horizontal_offset": manipulation_format_dimensions['dimensions'][0], 
                "vertical_offset": manipulation_format_dimensions['dimensions'][1]
                }
        elif self.input_drawing_format['dimensions'][0] % manipulation_format_dimensions['dimensions'][1] < acceptedDeviation and manipulation_method == "slice":
            manipulation_parameters = {
                "name":"width-height", 
                "horizontal_offset": manipulation_format_dimensions['dimensions'][1], 
                "vertical_offset": manipulation_format_dimensions['dimensions'][0]
                }
        elif manipulation_format_dimensions['dimensions'][0] % self.input_drawing_format['dimensions'][0] < acceptedDeviation and manipulation_method == "scale":
            manipulation_parameters = {
                "name":"width-width", 
                "horizontal_offset": manipulation_format_dimensions['dimensions'][0], 
                "vertical_offset": manipulation_format_dimensions['dimensions'][1]
                }
        elif manipulation_format_dimensions['dimensions'][0] % self.input_drawing_format['dimensions'][1] < acceptedDeviation and manipulation_method == "scale":
            manipulation_parameters = {
                "name":"width-height", 
                "horizontal_offset": manipulation_format_dimensions['dimensions'][1], 
                "vertical_offset": manipulation_format_dimensions['dimensions'][0]
                }
        else:
            raise AcceptedDeviationError(f""" Program has not found right manipulation_method to slice/scale objects. 
                                        Accepted deviation is {acceptedDeviation}, 
                                        manipulation drawing format drawing format is {manipulation_format_dimensions}, 
                                        input drawing format is {self.input_drawing_format}""" )
        
        print(manipulation_parameters)
        return manipulation_parameters
