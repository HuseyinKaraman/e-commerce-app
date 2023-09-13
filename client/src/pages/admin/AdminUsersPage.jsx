import UsersPageComponent from "./components/UsersPageComponent";
import axios from "axios";

const fetchUserDetails = async (abctrl) => {
    const { data } = await axios.get("/api/users", {
        signal: abctrl.signal,
    });
    return data;
};

const deleteUser = async (userId) => {
    const res = await axios.delete(`/api/users/${userId}`);
    return res;
};
const AdminUserPage = () => {
    return <UsersPageComponent fetchUserDetails={fetchUserDetails} deleteUser={deleteUser} />;
};

export default AdminUserPage;
