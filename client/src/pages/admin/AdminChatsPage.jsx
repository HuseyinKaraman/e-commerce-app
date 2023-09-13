import { Col, Row } from "antd";
import AdminChatRoomComponent from "../../components/admin/AdminChatRoomComponent";
import AdminLinksComponent from "../../components/admin/AdminLinksComponent";

const AdminChatsPage = () => {
  return (
    <Row className="w-full md:mt-5">
      <Col className="md:w-1/5 w-full">
        <AdminLinksComponent />
      </Col>
      <Col className="md:w-3/4 w-full md:mt-0 mt-2 max-md:px-5">
        <h1 className="text-3xl my-4 font-bold">Chat</h1>
        <div className="flex gap-2 flex-wrap">
          <AdminChatRoomComponent />
          <AdminChatRoomComponent />
        </div>
      </Col>
    </Row>
  );
};

export default AdminChatsPage;
