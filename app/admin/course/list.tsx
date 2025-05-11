import { Datagrid, List , TextField , ReferenceField} from "react-admin";


export const CourseList= () => {
    return(
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id"/>
            <TextField source="title"/>
            <TextField source="imageSrc"/>
            <ReferenceField source="coureseId" reference="courses"/>
            <TextField source="order"/>
        </Datagrid>        
     </List>
    )
};