import { Button, Input, Collapse, Form } from "antd";

const { Panel } = Collapse;

const AdminChatRoomComponent = () => {

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
    <Collapse className="w-[360px]" size="small">
      <Panel header={<strong>Chat With John Doe</strong>} key="1">
        <div className="">
          <div className="chat-header">
            <h6>Let'a Chat - Online</h6>
          </div>
          <div className="chat-form px-3 w-full">
            <div className="chat-msg overflow-auto  max-h-[350px]">
              <p className="mb-2">Chat history</p>

              {/**** Chat template */}
              <p className="rounded-full  p-3 ml-4 font-medium bg-sky-600 my-1 text-black">
                <b className="text-white mr-2 font-semibold">John Doe wrote:</b>Hello,world! This is a toast message
              </p>
              <p>
                <b>Support wrote:</b> Hello,world! This is a toast message
              </p>
              <p className="rounded-full  p-3 ml-4 font-medium bg-sky-600 my-1 text-black">
                <b className="text-white mr-2 font-semibold">John Doe wrote:</b>Hello,world! This is a toast message
              </p>
              <p>
                <b>Support wrote:</b> Hello,world! This is a toast message
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
      </Panel>
    </Collapse>
  );
};

export default AdminChatRoomComponent;
