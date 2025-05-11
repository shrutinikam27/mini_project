import { Edit, required, SimpleForm, TextInput } from "react-admin";

export const CourseEdit = () => {
    return (
        <Edit resource="courses">
            <SimpleForm >
                <TextInput source="id" validate={[required()]} label="id" />
                <TextInput source="imageSrc" validate={[required()]} label="Image" />
                <TextInput source="title" validate={[required()]} label="Title" />
            </SimpleForm>
        </Edit>
    )
};
