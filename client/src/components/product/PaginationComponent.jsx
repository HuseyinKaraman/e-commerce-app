import { Pagination } from "antd";
import { useNavigate } from "react-router-dom";

const PaginationComponent = ({ categoryName, searchQuery, paginationLinksNumber, pageNum }) => {
    const navigate = useNavigate();

    const category = categoryName ? `category/${categoryName}/` : "";
    const search = searchQuery ? `search/${searchQuery}/` : "";
    const url = `/product-list/${category}${search}`;

    return (
        <Pagination
            defaultCurrent={pageNum}
            total={5 * paginationLinksNumber}
            pageSize={paginationLinksNumber}
            showQuickJumper
            showSizeChanger={false}
            className="mt-4"
            onChange={(e) => navigate(`${url}${e}`)}
        />
    );
};

export default PaginationComponent;
