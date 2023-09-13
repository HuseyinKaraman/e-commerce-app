import { Select } from "antd";

const SortOptionsComponent = ({ setSortOption }) => {
    return (
        <Select
            placeholder="SORT BY"
            className="sort-option rounded-full border-l-0 w-full"
            size="middle"
            onChange={(e) => setSortOption(e)}
        >
            <Select.Option value="price_1">Price: Low To High</Select.Option>
            <Select.Option value="price_-1">Price: High To Low</Select.Option>
            <Select.Option value="rating_-1">Customer Rating</Select.Option>
            <Select.Option value="name_1">Name: A-Z</Select.Option>
            <Select.Option value="name_-1">Name: Z-A</Select.Option>
        </Select>
    );
};

export default SortOptionsComponent;
