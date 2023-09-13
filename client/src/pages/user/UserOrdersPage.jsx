import axios from "axios";
import UserOrdersPageComponent from "./components/UserOrdersPageComponent";

const getOrders = async () => {
  const { data } = await axios.get("/api/orders");
  return data;
};


const UserOrdersPage = () => {
    return <UserOrdersPageComponent getOrders={getOrders}/>;
};

export default UserOrdersPage;
