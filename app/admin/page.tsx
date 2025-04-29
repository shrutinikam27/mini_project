"use client";

import { getIsAdmin } from "lib/admin";
import dynamic from "next/dynamic";

const App = dynamic(() => import("./app"), { ssr: false });

const AdminPage = () => {
    if (!getIsAdmin) {
        redirect("/")
    }
    return (
        <App />
    );
}; 


export default AdminPage;    
