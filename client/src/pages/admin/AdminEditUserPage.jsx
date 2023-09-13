import EditUserPageComponent from "./components/EditUserPageComponent";
import axios from "axios";

const updateUserApiRequest = async (userId, values) => {
    const { data } = await axios.put(`/api/users/${userId}`, {
        name: values.name,
        lastName: values.lastName,
        email: values.email,
        isAdmin: values.isAdmin,
    });
    return data;
};

const fetchUser = async (userId) => {
    const { data } = await axios.get(`/api/users/${userId}`);
    return data;
};

const AdminEditUserPage = () => {
    return <EditUserPageComponent fetchUser={fetchUser} updateUserApiRequest={updateUserApiRequest} />;
};

export default AdminEditUserPage;
