import typing


def grpc_message_to_dict(r) -> dict:
    data = {}
    for field in r.DESCRIPTOR.fields:
        field_data = getattr(r, field.name)
        if hasattr(field_data, 'DESCRIPTOR'):
            field_data = grpc_message_to_dict(field_data)
        try:
            if isinstance(field_data, typing.Iterable) and hasattr(field_data, 'MergeFrom'):
                new_list = []
                for new_field in field_data:
                    if hasattr(new_field, 'DESCRIPTOR'):
                        new_list.append(grpc_message_to_dict(new_field))
                    else:
                        new_list.append(new_field)
                field_data = new_list
        except:
            pass
        data[field.name] = field_data
    return data

