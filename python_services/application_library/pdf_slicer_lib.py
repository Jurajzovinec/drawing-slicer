import PyPDF2
import copy
import string
import random
import io

from .pdf_slicer_exceptions import *


class PdfSlicer:

    def __init__(self, input_file, slice_by_format=None, scale_to_format=None, filename=None, test_mode=False):
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
        self.input_file_name = self.determine_input_file_name(
            input_file, filename)
        self.input_pdf_object = self.init_pdf_file(input_file)
        self.slice_by_format = self.validate_slice_by_format(slice_by_format)
        self.scale_to_format = self.validate_scale_to_format(scale_to_format)

        self.first_page_of_pdf_object = self.input_pdf_object.getPage(0)
        self.input_drawing_format = self.determine_input_drawing_format()
        self.number_of_pages = self.determine_number_of_pages()
        self.test_mode = test_mode

    # Slice Function
    def main_run(self):
        
        if self.scale_to_format:
            self.scale_to_specific_format(self.scale_to_format)
        if self.slice_by_format:
            return self.generate_sliced_pdf(self.slice_by_specific_format(self.slice_by_format))

    def validate(self):
        
        return {
            'status': 'OK',
            'filename': self.input_file_name,
            'numberOfPages': self.number_of_pages,
            'drawingFormat': self.input_drawing_format['drawing_format']
        }

    # Validation Functions
    def determine_input_file_name(self, input_file, filename):
        
        if filename:
            return filename
        else:
            return input_file

    def init_pdf_file(self, input_file):

        try:
            pdf_file = PyPDF2.PdfFileReader(input_file, strict=False)
        except:
            raise InvalidInputPdfFile("Invalid PDF file.")
        else:
            return pdf_file
        

    def validate_scale_to_format(self, scale_to_format):

        valid_inputs = [drawing_format_dict['drawing_format']
                        for drawing_format_dict in self.standard_drawing_formats]

        if scale_to_format == None:
            return None
        elif scale_to_format not in valid_inputs:
            raise InvalidScalingFormat(
                f'Please select one of valid scale format inputs from list {valid_inputs}. Received input is {scale_to_format}')
        else:
            return scale_to_format

    def validate_slice_by_format(self, input_slice_by_format):

        valid_inputs = [drawing_format_dict['drawing_format']
                        for drawing_format_dict in self.standard_drawing_formats]

        if input_slice_by_format == None:
            return None
        elif input_slice_by_format not in valid_inputs:
            raise InvalidSlicingFormat(
                f'Please select one of valid slice format inputs from list {valid_inputs}. Received input is {input_slice_by_format}')
        else:
            return input_slice_by_format

    def test_output_format(self, tested_page, expected_format):

        tested_page_dimensions = (round(float(tested_page.cropBox.getHeight(
        )) * 0.352777777), round(float(tested_page.cropBox.getWidth()) * 0.352777777))
        expected_dimensions = next(
            drawing_format for drawing_format in self.standard_drawing_formats if drawing_format['drawing_format'] == expected_format)['dimensions']
        accepted_deviation = max(expected_dimensions)*0.01

        if abs(max(expected_dimensions) - max(tested_page_dimensions)) > accepted_deviation:
            raise ResultPDFSizeFailure(
                f'Output format failed in pdf size test. Expected format is {expected_format} with dimensions: {expected_dimensions}. Result dimensions are {tested_page_dimensions} and accepted deviation is {accepted_deviation}.')

    # Logical functions
    def get_this_page_dimensions(self):

        width_pdf_page = round(
            float(self.first_page_of_pdf_object.mediaBox.getWidth()))
        heigth_pdf_page = round(
            float(self.first_page_of_pdf_object.mediaBox.getHeight()))

        return [width_pdf_page, heigth_pdf_page]

    def recursive_size_validation_test(self, repetions, current_width, current_height):

        multiply_constant = 0.352777777
        current_width = current_width * multiply_constant
        current_height = current_height * multiply_constant
        checked_page_object_dimensions = [current_width, current_height]
        acceptableDeviation = max(checked_page_object_dimensions)*0.004

        if repetions != 0:
            try:
                input_drawing_format = next(drawing_format for drawing_format in self.standard_drawing_formats
                                            if abs(max(drawing_format['dimensions']) - max(checked_page_object_dimensions)) < acceptableDeviation
                                            and abs(min(drawing_format['dimensions']) - min(checked_page_object_dimensions)) < acceptableDeviation)
            except StopIteration:
                return self.recursive_size_validation_test(repetions-1, current_width, current_height)
            else:
                if checked_page_object_dimensions[0] > checked_page_object_dimensions[1]:
                    return {
                        "drawing_format": input_drawing_format['drawing_format'],
                        "dimensions": [max(input_drawing_format['dimensions']), min(input_drawing_format['dimensions'])]
                    }
                else:
                    return {
                        "drawing_format": input_drawing_format['drawing_format'],
                        "dimensions": [min(input_drawing_format['dimensions']), max(input_drawing_format['dimensions'])]
                    }
        else:
            raise InvalidPdfSizeError(
                f"This is not standard ISO drawing (A0...A8). Input drawing size is {checked_page_object_dimensions}")

    def determine_input_drawing_format(self):

        # [width, height]
        checked_page_object_dimensions = self.get_this_page_dimensions()

        return self.recursive_size_validation_test(3, checked_page_object_dimensions[0], checked_page_object_dimensions[1])

    def determine_number_of_pages(self):
        if (self.input_pdf_object.getNumPages() != 1):
            raise MultiPageInputPdfError(
                f'Input PDF is not single paged. In order to slice PDF, extract document to single paged files. Input PDF has {str(self.input_pdf_object.getNumPages())} pages.')
        else:
            return "1"

    def scale_to_specific_format(self, format_to_scale):

        scaled_to_dimensions = next(
            drawing_format for drawing_format in self.standard_drawing_formats if drawing_format['drawing_format'] == format_to_scale)
        scale_ratio = max(
            scaled_to_dimensions['dimensions'])/max(self.input_drawing_format['dimensions'])
        self.first_page_of_pdf_object.scaleBy(scale_ratio)
        self.input_drawing_format = self.determine_input_drawing_format()

        return scale_ratio

    def get_page_area(self, page_object):
        h = round(float(page_object.mediaBox.getHeight()))
        w = round(float(page_object.mediaBox.getWidth()))
        return [w * h, w, h]

    def slice_by_specific_format(self, slice_by_format):

        slicing_parameters = self.determine_slice_method(slice_by_format)

        output_field = []

        for x in range(int(slicing_parameters['horizontal_slices'])):
            for y in range(int(slicing_parameters['vertical_slices'])):
                relative_position_x = x
                relative_position_y = y
                absolute_position_x_start = (
                    x) * slicing_parameters['horizontal_offset']
                absolute_position_y_start = (
                    y) * slicing_parameters['vertical_offset']
                absolute_position_x_end = (
                    x+1) * slicing_parameters['horizontal_offset']
                absolute_position_y_end = (
                    y+1) * slicing_parameters['vertical_offset']
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

    def determine_slice_method(self, slicing_format):

        valid_inputs = [drawing_format_dict['drawing_format']
                        for drawing_format_dict in self.standard_drawing_formats]
        valid_inputs.reverse()

        if not slicing_format in valid_inputs:
            raise InvalidDrawingInputFormat(
                f"Invalid drawing input. Select one of valid format inputs {valid_inputs}")

        if self.input_drawing_format['drawing_format'] == slicing_format:
            raise InvalidDrawingInputFormat(
                f"Slicer format equals current format of input PDF.")

        if valid_inputs.index(slicing_format) > valid_inputs.index(self.input_drawing_format['drawing_format']):
            raise InvalidDrawingInputFormat(
                f"""Slicing format is larger than current format of input PDF.""")

        manipulation_format_dimensions = next(drawing_format for drawing_format in self.standard_drawing_formats
                                              if drawing_format['drawing_format'] == slicing_format)
        accepted_deviation = min(self.input_drawing_format['dimensions'])*0.002

        comparing_dimensions = {
            "input_drawing_width": self.input_drawing_format['dimensions'][0],
            "max_dim_slice_format": max(manipulation_format_dimensions['dimensions']),
            "min_dim_slice_format": min(manipulation_format_dimensions['dimensions'])
        }

        if (max([comparing_dimensions['input_drawing_width'], comparing_dimensions['max_dim_slice_format']])) % (min([comparing_dimensions['input_drawing_width'], comparing_dimensions['max_dim_slice_format']])) < accepted_deviation:

            manipulation_parameters = {
                "slicing_method": "landscape",
                "dimensions": manipulation_format_dimensions['dimensions'],
                "horizontal_slices":  float(((self.input_drawing_format['dimensions'][0]) / max(manipulation_format_dimensions['dimensions']))),
                "vertical_slices":  float(((self.input_drawing_format['dimensions'][1]) / min(manipulation_format_dimensions['dimensions']))),
                "horizontal_offset": max(manipulation_format_dimensions['dimensions']),
                "vertical_offset": min(manipulation_format_dimensions['dimensions'])
            }

        elif (max([comparing_dimensions['input_drawing_width'], comparing_dimensions['min_dim_slice_format']])) % (min([comparing_dimensions['input_drawing_width'], comparing_dimensions['min_dim_slice_format']])) < accepted_deviation:

            manipulation_parameters = {
                "slicing_method": "portrait",
                "dimensions": manipulation_format_dimensions['dimensions'],
                "horizontal_slices":  float(((self.input_drawing_format['dimensions'][0]) / min(manipulation_format_dimensions['dimensions']))),
                "vertical_slices":  float(((self.input_drawing_format['dimensions'][1]) / max(manipulation_format_dimensions['dimensions']))),
                "horizontal_offset": min(manipulation_format_dimensions['dimensions']),
                "vertical_offset": max(manipulation_format_dimensions['dimensions'])
            }

        else:
            raise AcceptedDeviationError(
                f"Program has not found right manipulation_method to slice/scale objects. Accepted deviation is {accepted_deviation},   manipulation drawing format drawing format is {manipulation_format_dimensions['drawing_format']}, input drawing format is {self.input_drawing_format['drawing_format']}.")

        return manipulation_parameters

    def pdf_name_generator(self, size=6, chars=string.ascii_uppercase + string.digits):
        return ''.join(random.choice(chars) for _ in range(size))

    def generate_sliced_pdf(self, input_layout_field):

        writer = PyPDF2.PdfFileWriter()

        for each_page in input_layout_field:
            copied_drawing = copy.copy(self.first_page_of_pdf_object)
            copied_drawing.cropBox.lowerLeft = [
                each_page["absolute_position_x_start"]/0.352777777, each_page["absolute_position_y_start"]/0.352777777]
            copied_drawing.cropBox.upperRight = [
                each_page["absolute_position_x_end"]/0.352777777, each_page["absolute_position_y_end"]/0.352777777]
            writer.addPage(copied_drawing)


        if self.test_mode:

            result_pdf_name = (
                f"unit_test_output_files/{self.pdf_name_generator()}.pdf")

            with open(result_pdf_name, 'wb') as output_result_file:
                writer.write(output_result_file)

            resulted_tested_pdf_file = PyPDF2.PdfFileReader(result_pdf_name)

            with open(result_pdf_name, 'rb') as output_result_file_test:
                for page_number in range(resulted_tested_pdf_file.getNumPages()):
                    self.test_output_format(resulted_tested_pdf_file.getPage(
                        page_number), self.slice_by_format)

            return {"file_stream": output_result_file_test, "filename": result_pdf_name}

        else:

            output_filestream = io.BytesIO()
            result_pdf_name = (f"{self.pdf_name_generator()}.pdf")
            writer.write(output_filestream)

            resulted_tested_pdf_file = PyPDF2.PdfFileReader(output_filestream)

            for page_number in range(resulted_tested_pdf_file.getNumPages()):
                self.test_output_format(resulted_tested_pdf_file.getPage(
                    page_number), self.slice_by_format)

            return {"file_stream": output_filestream, "filename": result_pdf_name}
