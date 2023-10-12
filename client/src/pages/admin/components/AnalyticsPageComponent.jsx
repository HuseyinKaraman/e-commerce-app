import { Col, DatePicker, Row } from "antd";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

// ! we use SocketIO for if a user create order , this order reflect the chart without refreshing page
//* It is used for real time bidirectional communication with the client and the server,
//* and this library socket that I are is going to allow us to build chart dynamically
//* We need to install two circuit data packages, one for the back end and one for for the front end.

const hours = (dateToCompare) => {
    return Array.from({ length: 24 }).map((_, id) => {
        if (id < 12) {
            return { name: `${id + 1} AM`, [dateToCompare]: null };
        } else {
            return { name: `${id - 11} PM`, [dateToCompare]: null };
        }
    });
};

const AdminAnalyticsPageComponent = ({ fetchOrdersForFirstDate, fetchOrdersForSecondDate, socketIOClient }) => {
    const [firstDateToCompare, setFirstDateToCompare] = useState(new Date().toISOString().substring(0, 10));
    var previousDay = new Date();
    previousDay.setDate(previousDay.getDate() - 1);
    const [secondDateToCompare, setSecondDateToCompare] = useState(
        new Date(previousDay).toISOString().substring(0, 10)
    );

    const [dataForFirstSet, setDataForFirstSet] = useState([]);
    const [dataForSecondSet, setDataForSecondSet] = useState([]);

    useEffect(() => {
        const abctrl = new AbortController();
        if (firstDateToCompare !== "") {
            fetchOrdersForFirstDate(abctrl, firstDateToCompare)
                .then((data) => {
                    const orders = hours(firstDateToCompare);
                    let orderSum = 0;
                    data.map((order) => {
                        orderSum += order.orderTotal.cartSubTotal;
                        var date = new Date(order.createdAt).toLocaleString("en-US", {
                            hour: "numeric",
                            hour12: true,
                            timeZone: "UTC",
                        });
                        orders.find((hour) => hour.name === date)[firstDateToCompare] = orderSum;
                        // return { name: date, [firstDateToCompare]: orderSum };
                    });
                    if (data.length > 0) {
                        setDataForFirstSet([...new Map(orders.map((item) => [item["name"], item])).values()]);
                    }
                })
                .catch((er) => console.log(er));
        } else {
            setDataForFirstSet("");
        }

        if (secondDateToCompare !== "") {
            fetchOrdersForSecondDate(abctrl, secondDateToCompare)
                .then((data) => {
                    const orders = hours(secondDateToCompare);
                    let orderSum = 0;
                    data.map((order) => {
                        orderSum += order.orderTotal.cartSubTotal;
                        var date = new Date(order.createdAt).toLocaleString("en-US", {
                            hour: "numeric",
                            hour12: true,
                            timeZone: "UTC",
                        });
                        orders.find((hour) => hour.name === date)[secondDateToCompare] = orderSum;
                        // return { name: date, [secondDateToCompare]: orderSum };
                    });
                    if (data.length > 0) {
                        setDataForSecondSet([...new Map(orders.map((item) => [item["name"], item])).values()]);
                    }
                })
                .catch((er) => console.log(er));
        } else {
            setSecondDateToCompare("");
        }

        return () => abctrl.abort(); // ! It is used for preventing memory memory leakage in our application.
    }, [fetchOrdersForFirstDate, fetchOrdersForSecondDate, firstDateToCompare, secondDateToCompare]);

    useEffect(() => {
        const socket = socketIOClient();
        let today = new Date().toDateString();
        const handler = (newOrder) => {
            var orderDate = new Date(newOrder.createdAt).toLocaleString("en-US", {
                hour: "numeric",
                hour12: true,
                timeZone: "UTC",
            });
            if (new Date(newOrder.createdAt).toDateString() === today) {
                if (today === new Date(firstDateToCompare).toDateString()) {
                    setDataForFirstSet((prev) => {
                        if (prev.length === 0) {
                            return [{ name: orderDate, [firstDateToCompare]: newOrder.orderTotal.cartSubTotal }];
                        }
                        const index = prev.findIndex((item) => item.name === orderDate);
                        if (prev[index].name === orderDate) {
                            prev[index][firstDateToCompare] += newOrder.orderTotal.cartSubTotal;
                            return [...prev];
                        } else {
                            var lastElem = {
                                name: orderDate,
                                [firstDateToCompare]:
                                    prev[index][firstDateToCompare] + newOrder.orderTotal.cartSubTotal,
                            };
                            return [...prev, lastElem];
                        }
                    });
                } else if (today === new Date(secondDateToCompare).toDateString()) {
                    setDataForSecondSet((prev) => {
                        if (prev.length === 0) {
                            return [{ name: orderDate, [secondDateToCompare]: newOrder.orderTotal.cartSubTotal }];
                        }
                        const index = prev.findIndex((item) => item.name === orderDate);
                        if (prev[index].name === orderDate) {
                            console.log(prev[index][secondDateToCompare]);
                            prev[index][secondDateToCompare] += newOrder.orderTotal.cartSubTotal;
                            return [...prev];
                        } else {
                            var lastElem = {
                                name: orderDate,
                                [secondDateToCompare]:
                                    prev[index][secondDateToCompare] + newOrder.orderTotal.cartSubTotal,
                            };
                            return [...prev, lastElem];
                        }
                    });
                }
            }
        };
        socket.on("newOrder", handler);
        return () => socket.off("newOrder", handler);
    }, [firstDateToCompare, secondDateToCompare, socketIOClient]);

    const firstDateHandler = (date, dateString) => {
        setFirstDateToCompare(dateString);
    };
    const secondDateHandler = (_, dateString) => {
        setSecondDateToCompare(dateString);
    };

    return (
        <Row className="w-full md:mt-5">
            <Col className="md:w-1/5 w-full">
                <AdminLinksComponent />
            </Col>
            <Col className="md:w-3/4 w-full md:mt-0 mt-2 max-md:px-5">
                <h1 className="text-2xl my-4 font-bold text-center">
                    Cumulative Revenue {firstDateToCompare} VS {secondDateToCompare}
                </h1>
                {/* <RangePicker className="w-1/2" onChange={onChange} /> */}
                <Row className="justify-between max-w-[500px] md:flex-row mx-auto">
                    <Col>
                        <h3 className="text-[16px] font-semibold">Select First Date To Compare</h3>
                        <DatePicker onChange={firstDateHandler}/>
                    </Col>
                    <Col>
                        <h3 className="text-[16px] font-semibold">Select Second Date To Compare</h3>
                        <DatePicker onChange={secondDateHandler} />
                    </Col>
                </Row>
                <ResponsiveContainer className="w-full max-h-[500px] mt-7 ">
                    <LineChart width={500} height={300}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            label={{ value: "TIME", offset: 50, position: "insideBottomRight" }}
                            allowDuplicatedCategory={false}
                        />
                        <YAxis
                            label={{ value: "REVENUE $", angle: -90, position: "insideLeft" }}
                            allowDuplicatedCategory={false}
                        />
                        <Tooltip />
                        <Legend verticalAlign="top" height={24} />
                        {dataForFirstSet.length > dataForSecondSet.length ? (
                            <>
                                <Line
                                    data={dataForFirstSet}
                                    dataKey={firstDateToCompare}
                                    type="monotone"
                                    stroke="#8884d8"
                                    activeDot={{ r: 8 }}
                                    strokeWidth={2}
                                    connectNulls
                                />
                                <Line
                                    data={dataForSecondSet}
                                    dataKey={secondDateToCompare}
                                    type="monotone"
                                    stroke="#82ca9d"
                                    activeDot={{ r: 8 }}
                                    strokeWidth={2}
                                    connectNulls
                                />
                            </>
                        ) : (
                            <>
                                <Line
                                    data={dataForSecondSet}
                                    dataKey={secondDateToCompare}
                                    type="monotone"
                                    stroke="#82ca9d"
                                    activeDot={{ r: 8 }}
                                    strokeWidth={2}
                                    connectNulls
                                />
                                <Line
                                    data={dataForFirstSet}
                                    dataKey={firstDateToCompare}
                                    type="monotone"
                                    stroke="#8884d8"
                                    activeDot={{ r: 8 }}
                                    strokeWidth={2}
                                    connectNulls
                                />
                            </>
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </Col>
        </Row>
    );
};

export default AdminAnalyticsPageComponent;
