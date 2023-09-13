import { Button, Form, Input } from "antd";
import { CloseCircleOutlined, MessageOutlined } from "@ant-design/icons";
import "./chats.css";

const UserChatComponent = () => {
  const onFinish = async (values) => {
    console.log(values);
    // try {
    //   const res = await fetch(process.env.REACT_APP_SERVER_URL+"/api/auth/register", {
    //     method: "POST",
    //     body: JSON.stringify(values),
    //     headers: { "Content-type": "application/json; charset=UTF-8" },
    //   });
    //   console.log(res);
    //   if (res.status === 200) {
    //     // message.success("User is successfully register!");
    //     navigate("/login");
    //     setLoading(false);
    //   }else{
    //     // message.error(res.statusText);
    //   }
    // } catch (error) {
    //     // message.error("error");
    // }
  };

  return (
    <>
      <input id="check" type="checkbox" />
      <label htmlFor="check" className="chat-btn">
        <MessageOutlined className="align-middle pb-1 comment" />
        <CloseCircleOutlined className="align-middle pb-1 close" />
        <span className="p-[6px] rounded-full bg-red-600 absolute left-0 top-0"></span>
      </label>

      <div className="chat-wrapper">
        <div className="chat-header">
          <h6>Let'a Chat - Online</h6>
        </div>
        <div className="chat-form px-3 w-full">
          <div className="chat-msg overflow-auto  max-h-[300px]">
            <p className="mb-2">Chat history</p>

            {/**** Chat template */}
            <p>
              <b>You wrote:</b> Hello,world! This is a toast message
            </p>
            <p className="rounded-full  p-3 ml-4 font-medium bg-sky-600 my-2 text-black">
              <b className="text-white mr-2 font-semibold">Support wrote:</b>Hello,world! This is a toast message
            </p>
          </div>

          <Form name="chatmsg-form" layout="vertical" onFinish={onFinish}>
            <Form.Item name="chatmsg">
              <Input.TextArea rows={2} id="clientChatMsg" className="form-control !resize-none" placeholder="Your Text Message" />
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
  );
};

export default UserChatComponent;
