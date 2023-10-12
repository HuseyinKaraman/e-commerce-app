import { Button, Form, Input } from "antd";
import { CloseCircleOutlined, MessageOutlined } from "@ant-design/icons";
import "./chats.css";

import socketIOClient from "socket.io-client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const UserChatComponent = () => {
    const formRef = React.useRef(null);
    const [socket, setSocket] = useState(false);
    const [chat, setChat] = useState([]);
    const [messageReceived, setMessageReceived] = useState(false);
    const [chatConnectionInfo, setChatConnectionInfo] = useState(false);
    const [reconnect, setReconnect] = useState(false);

    const userInfo = useSelector((state) => state.user.userInfo);

    useEffect(() => {
        if (!userInfo.isAdmin) {
            setReconnect(false);
            const socket = socketIOClient();
            socket.on("no admin", () => {
                setChat((chat) => {
                    return [...chat, { admin: "no admin here now" }];
                });
            });
            socket.on("server sends message from admin to client", (msg) => {
                setChat((chat) => {
                    return [...chat, { admin: msg }];
                });
                setMessageReceived(true);
                const chatMessages = document.querySelector(".chat-msg");
                chatMessages.scrollTop = chatMessages.scrollHeight;
            });
            setSocket(socket);
            socket.on("admin closed chat", () => {
                setChat([]);
                setChatConnectionInfo("Admin closed chat,type something and submit to reconnect");
                setReconnect(true);
            });
            return () => socket.disconnect();
        }
    }, [userInfo.isAdmin,reconnect]);

    const clientSubmitChatMsg = async (values) => {
        setChatConnectionInfo("");
        setMessageReceived(false);
        const msg = values.chatmsg?.trim();
        if (msg === "" || msg === null || msg === false || !msg) {
            return;
        }
        socket.emit("client sends message", msg);
        setChat((prev) => {
            return [...prev, { client: msg }];
        });
        setTimeout(() => {
            formRef.current?.resetFields();
            const chatMessages = document.querySelector(".chat-msg");
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 200);
    };

    return !userInfo.isAdmin ? (
        <>
            <input id="check" type="checkbox" />
            <label htmlFor="check" className="chat-btn">
                <MessageOutlined className="align-middle pb-1 comment" />
                <CloseCircleOutlined className="align-middle pb-1 close" />
                {messageReceived && <span className="p-[6px] rounded-full bg-red-600 absolute left-0 top-0"></span>}
            </label>

            <div className="chat-wrapper">
                <div className="chat-header">
                    <h6>Let'a Chat - Online</h6>
                </div>
                <div className="chat-form px-3 w-full">
                    <div className="chat-msg overflow-auto  max-h-[300px]">
                        <p>{chatConnectionInfo}</p>
                        {/**** Chat template */}
                        {chat.map((item, id) => (
                            <div key={id} className="mb-1">
                                {item.client && (
                                    <p>
                                        <b>You wrote:</b>
                                        {item.client}
                                    </p>
                                )}
                                {item.admin && (
                                    <p className="rounded-full  p-3 ml-4 font-medium bg-sky-600 my-2 text-black">
                                        <b className="text-white mr-2 font-semibold">Support wrote:</b>
                                        {item.admin}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <Form name="chatmsg-form" layout="vertical" onFinish={clientSubmitChatMsg} ref={formRef}>
                        <Form.Item name="chatmsg">
                            <Input.TextArea
                                rows={2}
                                id="clientChatMsg"
                                className="form-control !resize-none"
                                placeholder="Your Text Message"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" type="primary" className="block ml-auto !bg-green-700">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    ) : null;
};

export default UserChatComponent;
