import PyPDF2

input_drawing_file = open('public\VykresA4.pdf', "rb")

pdf_reader = PyPDF2.PdfFileReader(input_drawing_file)

print('hello world')