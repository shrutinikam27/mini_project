import { Nunito } from "node_modules/next/font/google";
import { Create, NumberInput, ReferenceField, required, SimpleForm ,  TextInput } from "react-admin";
,

export const Unitcreate = () => {
    return(
    <Create>
        <SimpleForm >
            <TextInput source="title" Validate={[required()]} label="Title"/>
            <TextInput source="description" Validate={[required()]} label="description"/>
            <ReferenceField
               source="coureseId"
               reference="courses"/>

               <NumberInput
               source="order"
               validate={{required ()}}
               label="Order"/>
        </SimpleForm>        
     </Create>
    )
};