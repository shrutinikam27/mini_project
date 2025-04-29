import { Create, required, SimpleForm ,  TextInput } from "react-admin";
,

export const Coursecreate = () => {
    return(
    <Create>
        <SimpleForm >
            <TextInput source="title" Validate={[required()]} label="Title"/>
            <TextInput source="imageSrc" Validate={[required()]} label="Image"/>
        </SimpleForm>        
     </Create>
    )
};