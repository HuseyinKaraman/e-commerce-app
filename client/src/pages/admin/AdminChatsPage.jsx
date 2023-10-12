import { Col, Row } from "antd";
import AdminChatRoomComponent from "../../components/admin/AdminChatRoomComponent";
import AdminLinksComponent from "../../components/admin/AdminLinksComponent";
import { setMessageRecieved } from "../../redux/slicer/chat/chatSlicer";
import { useSelector } from "react-redux";

const AdminChatsPage = () => {
    const { chatRooms, socket } = useSelector((state) => state.adminChat);

    return (
        <Row className="w-full md:mt-5">
            <Col className="md:w-1/5 w-full">
                <AdminLinksComponent />
            </Col>
            <Col className="md:w-3/4 w-full md:mt-0 mt-2 max-md:px-5">
                <h1 className="text-3xl my-4 font-bold">Chat</h1>
                <div className="flex gap-2 flex-wrap">
                    {Object.entries(chatRooms).map((chatRoom, index) => (
                        <AdminChatRoomComponent
                            key={index}
                            socket={socket}
                            roomIndex={index + 1}
                            socketUser={chatRoom[0]}
                            chatRoomMsg={chatRoom[1]}
                            setMessageRecieved={setMessageRecieved}
                        />
                    ))}
                </div>
            </Col>
        </Row>
    );
};

export default AdminChatsPage;
