import { Edit, required, SimpleForm, TextInput } from "react-admin";

export const UnitEdit = () => {
    return (
        <Edit>
            <SimpleForm >
                <TextInput source="id"
                    Validate={[required()]}
                    label="id" />
                <TextInput source="imageSrc" Validate={[required()]} label="Image" />
                <TextInput source="title" Validate={[required()]} label="Title" />
            </SimpleForm>
        </Edit>
    )
};