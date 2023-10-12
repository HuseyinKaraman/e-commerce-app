import AnalyticsPageComponent from "./components/AnalyticsPageComponent";
import axios from "axios";
import socketIOClient from "socket.io-client";

const fetchOrdersForFirstDate = async (abctrl, firstDateToCompare) => {
    const { data } = await axios.get("/api/orders/analysis/" + firstDateToCompare, {
        signal: abctrl.signal, // It is used for preventing memory memory leakage in our application.
    });
    return data;
};

const fetchOrdersForSecondDate = async (abctrl, secondDateToCompare) => {
    const { data } = await axios.get("/api/orders/analysis/" + secondDateToCompare, {
        signal: abctrl.signal, // It is used for preventing memory memory leakage in our application.
    });
    return data;
};

const AdminAnalyticsPage = () => {
    return (
        <AnalyticsPageComponent
            fetchOrdersForFirstDate={fetchOrdersForFirstDate}
            fetchOrdersForSecondDate={fetchOrdersForSecondDate}
            socketIOClient={socketIOClient}
        />
    );
};

export default AdminAnalyticsPage;
