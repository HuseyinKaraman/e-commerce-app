import { Button, Input, Collapse, Form } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const { Panel } = Collapse;

const AdminChatRoomComponent = ({
    chatRoomMsg,
    roomIndex,
    socket,
    socketUser,
    setMessageRecieved,
}) => {
    const formRef = React.useRef(null);
    const dispatch = useDispatch();
    const [rerender, setRerender] = useState(false);
    const chatMessages = document.querySelector(`.chat-msg${socketUser}`);
    const [message, setMessage] = useState([]);

    const closeConnection = () => {
        socket.emit("admin closes chat", socketUser);
    };

    useEffect(() => {
        if (message.length === 0) {
            setMessage([...chatRoomMsg]);
        } else {
            setMessage((chat) => {
                return [...chat, chatRoomMsg[chatRoomMsg.length - 1]];
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatRoomMsg]);

    const adminSubmitChatMsg = async (values) => {
        let msg = values.chatmsg?.trim();
        if (msg === "" || msg === null || msg === false || !msg) {
            return;
        }

        // chatRoomMsg= [...chatRoomMsg, { admin: msg }]; //! Why not
        setMessage((chat) => {
            return [...chat, { admin: msg }];
        });
        socket.emit("admin sends message", { user: socketUser, message: msg });

        setRerender(!rerender);
        dispatch(setMessageRecieved(false));
        setTimeout(() => {
            formRef.current?.resetFields();
            if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 200);
    };

    useEffect(() => {
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
    }, [chatMessages]);

    return (
        <Collapse className="w-[360px]" size="small">
            <Panel
                header={<strong>Chat With {socketUser} - Online</strong>}
                key={roomIndex}
                extra={<CloseCircleOutlined onClick={() => closeConnection()} className="text-red-600 text-2xl" />}
            >
                <div className="">
                    <div className="chat-form px-3 w-full">
                        <div className={`chat-msg${socketUser} overflow-auto  max-h-[350px]`}>
                            {message.map((msg, idx) => (
                                <div key={idx}>
                                    {msg.client && (
                                        <p className="rounded-2xl  p-3 font-medium bg-sky-600 my-1 text-black">
                                            <b>{socketUser}:</b>
                                            <span className="text-white mx-2 font-semibold">{msg.client}</span>
                                        </p>
                                    )}
                                    {msg.admin && (
                                        <p className="rounded-2xl font-medium p-2 mb-1 bg-slate-400 text-black">
                                            <b>Support wrote:</b> <span className="text-white mx-2">{msg.admin}</span>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <Form name="chatmsg-form" layout="vertical" onFinish={adminSubmitChatMsg} ref={formRef}>
                            <Form.Item name="chatmsg">
                                <Input.TextArea
                                    autoFocus={true}
                                    rows={2}
                                    id={`clientChatMsg${roomIndex}`}
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
            </Panel>
        </Collapse>
    );
};

export default AdminChatRoomComponent;
