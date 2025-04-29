"use client";

import { Admin, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import { CourseList } from "./course/list";
import { Coursecreate } from "./course/create";
import { CourseEdit } from "./course/edit";
import { Unitcreate } from "./unit/create";

const dataProvider = simpleRestProvider("/api");


const  App = () => {
    return (
        <Admin dataProvider={dataProvider}>
           <Resource
              name="courses"
              list={CourseList}
              create={Coursecreate}
              edit={CourseEdit}
              recordRepresentation="title"
           />
           <Resource
              name="units"
              list={UnitList}
              create={Unitcreate}
              edit={CourseEdit}
              recordRepresentation="title"
           />
        </Admin>
    );
};
 
export default App;