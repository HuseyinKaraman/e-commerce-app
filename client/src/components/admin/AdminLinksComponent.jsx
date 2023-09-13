import { BarChartOutlined, HomeOutlined, LogoutOutlined, ShopOutlined, UserOutlined, WechatOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useLocation, } from "react-router-dom";
import { logout } from "../../redux/slicer/user/services";
import { useDispatch } from "react-redux";


function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}


const AdminLinksComponent = () => {
  const dispatch = useDispatch();

  const items = [
    getItem(<Link to="/admin/orders">Orders</Link>, "/admin/orders", <HomeOutlined />),
    getItem(<Link to="/admin/products">Products</Link>, "/admin/products", <ShopOutlined />),
    getItem(<Link to="/admin/users">Users</Link>, "/admin/users", <UserOutlined />),
    getItem(<Link to="/admin/chats">Chats</Link>, "/admin/chats", <WechatOutlined />),
    getItem(<Link to="/admin/analytics">Analytics</Link>, "/admin/analytics", <BarChartOutlined />),
    getItem(<Link onClick={()=>dispatch(logout())}>Logout</Link>, "/admin/logout", <LogoutOutlined />),
  ];

  const {pathname} = useLocation();

  return (
    <div className="md:max-w-[300px] my-4">
      <Menu selectedKeys={[pathname]} items={items} className="!border-none mr-auto" />
    </div>
  );
};

export default AdminLinksComponent;
