import { Input, Select, Badge, Dropdown, Space } from "antd";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCartOutlined, DownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slicer/user/services";
import { getCategories } from "../redux/slicer/category/services";
import { useEffect, useState } from "react";

const { Option } = Select;
const { Search } = Input;

const HeaderComponent = () => {
    const dispatch = useDispatch();
    const itemsCount = useSelector((state) => state.cart.itemsCount);
    const { userInfo } = useSelector((state) => state.user);
    const { categories } = useSelector((state) => state.category);
    const [searchCategoryToggle, setSearchCategoryToggle] = useState("All");

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    const selectBefore = (
        <Select
            defaultValue={searchCategoryToggle}
            className="bg-blue-500 rounded-full border-l-0 min-w-[100px] text-left"
            size="large"
            onChange={(e) => setSearchCategoryToggle(e)}
        >
            <Option value={"All"} key={"All"}>
                All
            </Option>
            {categories.map((category, idx) => (
                <Option value={category.name} key={idx}>
                    {category.name}
                </Option>
            ))}
        </Select>
    );

    const items = [
        {
            label: <Link to="/user">My profile</Link>,
            key: "1",
        },
        {
            label: (
                <Link to="/user/my-orders" className="text-white">
                    My orders
                </Link>
            ),
            key: "2",
        },
        {
            label: (
                <Link className="text-white" onClick={() => dispatch(logout())}>
                    Logout
                </Link>
            ),
            key: "3",
        },
    ];

    const onSearch = (value) => {
        if (value.trim()) {
            if (searchCategoryToggle === "All") {
                navigate(`/product-list/search/${value}`);
            } else {
                navigate(`/product-list/category/${searchCategoryToggle.replaceAl("/", ",")}/search/${value}`);
            }
        } else if (searchCategoryToggle !== "All") {
            navigate(`/product-list/category/${searchCategoryToggle.replaceAll("/", ",")}`);
        } else {
            navigate(`/product-list`);
        }
    };

    return (
        <div className="border-b mb-0.5">
            <header className="flex md:items-center items-start md:flex-row flex-col px-1 md:px-4 gap-y-2 py-2 md:gap-x-4">
                <div className="menu__left flex items-center justify-between md:justify-normal flex-row w-full">
                    <div className="logo mr-4">
                        <Link to="/">
                            <h2 className="font-bold text-[30px]">Shopping</h2>
                        </Link>
                    </div>
                    <div className="header-search flex flex-1 max-w-[600px]">
                        <Search
                            size="large"
                            addonBefore={selectBefore}
                            placeholder="Search in shop..."
                            onSearch={onSearch}
                            className="rounded-full w-full"
                        />
                    </div>
                </div>
                <div className="menu-links flex justify-between md:justify-end md:ml-auto md:gap-x-5 font-semibold w-full md:max-w-[36px] md:min-w-fit">
                    {userInfo?.isAdmin ? (
                        <Badge count={1} offset={[0, -2]} color="red" size="small" className="my-auto">
                            <NavLink
                                to="/admin/orders"
                                className={({ isActive }) => (isActive ? "active menu-link" : "menu-link")}
                            >
                                <span className="text-[16px]">Admin</span>
                            </NavLink>
                        </Badge>
                    ) : userInfo?.name && !userInfo?.isAdmin ? (
                        <Dropdown menu={{ items, selectable: true }}>
                            <Space className="!gap-x-1 cursor-pointer">
                                <span>{`${userInfo.name} ${userInfo.lastName}`}</span>
                                <DownOutlined className="text-xs mb-1" />
                            </Space>
                        </Dropdown>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className={({ isActive }) => (isActive ? "active menu-link" : "menu-link")}
                            >
                                <span className="text-[16px]">Login</span>
                            </NavLink>
                            <NavLink
                                to="/register"
                                className={({ isActive }) => (isActive ? "active menu-link" : "menu-link")}
                            >
                                <span className="text-[16px]">Register</span>
                            </NavLink>
                        </>
                    )}
                    <Badge count={itemsCount} offset={[-8, 2]} color="geekblue" size="small" className="my-auto">
                        <NavLink to="/cart" className={({ isActive }) => (isActive ? "active menu-link" : "menu-link")}>
                            <span className="text-[17px] text-center">Cart</span>
                            <ShoppingCartOutlined className="text-[20px] ml-1 mt-[6px]" />
                        </NavLink>
                    </Badge>
                </div>
            </header>
        </div>
    );
};

export default HeaderComponent;
