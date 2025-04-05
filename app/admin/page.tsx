import dynamic from "next/dynamic";

const App = dynamic(() => import("./app"),);

const AdminPage = () => {
    return (
        <App />
    );
};


export default AdminPage;    