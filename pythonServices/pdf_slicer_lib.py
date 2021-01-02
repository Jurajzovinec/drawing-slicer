def get_page_area(page_object):
    h = round(float(page_object.mediaBox.getHeight()))
    w = round(float(page_object.mediaBox.getWidth()))
    return [w * h, w, h]


def generate_layouts(input_object, scaled_object):

    input_dims = get_page_area(input_object)
    scaled_dims = get_page_area(scaled_object)

    if not (input_dims[0] / scaled_dims[0]).is_integer() and not (scaled_dims[0] / input_dims[0]).is_integer():
        raise TypeError("The layouts will not fit into input pdf")
    output_field = []

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

    for each in output_field:
        print(each)

    return output_field
