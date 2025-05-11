import { Nunito } from "node_modules/next/font/google";
import { Create, NumberInput, ReferenceField, required, SimpleForm, TextInput } from "react-admin";

export const UnitCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="title" validate={[required()]} label="Title" />
                <TextInput source="description" validate={[required()]} label="Description" />
                <ReferenceField source="courseId" reference="courses" />
                <NumberInput source="order" validate={[required()]} label="Order" />
            </SimpleForm>
        </Create>
    );
};
