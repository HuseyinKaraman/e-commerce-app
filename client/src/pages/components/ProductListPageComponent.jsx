import { Button, List, Spin } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SortOptionsComponent from "../../components/filterQueryResultOptions/SortOptionsComponent";
import PriceFilterComponent from "../../components/filterQueryResultOptions/PriceFilterComponent";
import RatingFilterComponent from "../../components/filterQueryResultOptions/RatingFilterComponent";
import CategoryFilterComponent from "../../components/filterQueryResultOptions/CategoryFilterComponent";
import AttributesFilterComponent from "../../components/filterQueryResultOptions/AttributesFilterComponent";
import ProductListComponent from "../../components/product/ProductListComponent";
import PaginationComponent from "../../components/product/PaginationComponent";

const ProductListPageComponent = ({ getProducts, categories }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [attrsFilter, setAttrsFilter] = useState([]); // collect category attributes fromdb and show on the webpage
    const [attrsFromFilter, setAttrsFromFilter] = useState([]); // collect user filters for category attributes
    const [showResetFiltersButton, setShowResetFiltersButton] = useState(false);

    const [filters, setFilters] = useState({}); // collect all filters
    const [price, setPrice] = useState(300);
    const [ratingsFromFilter, setRatingsFromFilter] = useState({});
    const [categoriesFromFilter, setCategoriesFromFilter] = useState({});
    const [sortOption, setSortOption] = useState("");
    const [paginationLinksNumber, setPaginationLinksNumber] = useState(null);
    const [pageNum, setPageNum] = useState(null);

    const { categoryName } = useParams() || "";
    const { pageNumParam } = useParams() || 1;
    const { searchQuery } = useParams() || "";
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        getProducts(filters, pageNumParam, sortOption, categoryName, searchQuery)
            .then((res) => {
                setProducts(res.products);
                setPaginationLinksNumber(res.paginationLinksNumber);
                setPageNum(res.pageNum);
                setLoading(false);
            })
            .catch(() => {
                setError(true); // OR setError(err.response.data.message ? err.response.data.message : err.response.data);
                setLoading(false);
            });
    }, [getProducts, filters, sortOption, categoryName, searchQuery, pageNumParam]);

    useEffect(() => {
        if (categoryName) {
            let categoryAllData = categories.find((category) => category.name === categoryName.replace(/,/g, "/")); // todo render.com error! for replaceAll
            if (categoryAllData) {
                let mainCategory = categoryAllData.name.split("/")[0];
                let index = categories.findIndex((category) => category.name === mainCategory);
                setAttrsFilter(categories[index].attrs);
            }
        } else {
            setAttrsFilter([]);
        }
    }, [categoryName, categories]);

    useEffect(() => {
        if (Object.entries(categoriesFromFilter).length > 0) {
            setAttrsFilter([]);
            var cat = [];
            var count;
            Object.entries(categoriesFromFilter).forEach(([category, checked]) => {
                if (checked) {
                    let name = category.split("/")[0];
                    cat.push(name);
                    count = cat.filter((x) => x === name).length;
                    if (count === 1) {
                        var index = categories.findIndex((item) => item.name === name);
                        setAttrsFilter((attrs) => [...attrs, ...categories[index].attrs]);
                    }
                }
            });
        }
    }, [categoriesFromFilter, categories]);

    const handleFilters = () => {
        navigate(location.pathname.replace(/\/[0-9]+$/,""))
        setShowResetFiltersButton(true);
        setFilters({
            price: price,
            rating: ratingsFromFilter,
            category: categoriesFromFilter,
            attrs: attrsFromFilter,
        });
    };

    const resetFilters = () => {
        setShowResetFiltersButton(false);
        setFilters({});
        window.location.href = "/product-list";
    };

    return loading ? (
        <Spin tip="Loading products..." className="flex justify-center items-center w-full h-[80vh]" />
    ) : error ? (
        <h1>Error while loading products.Try again later!</h1>
    ) : (
        <div className="flex flex-col sm:flex-row px-[20px] sm:px-3 my-4 md:gap-x-[10px]">
            <div>
                <List className="md:!w-[250px] mr-3">
                    <List.Item className="my-3">
                        <SortOptionsComponent setSortOption={setSortOption} />
                    </List.Item>
                    <List.Item>
                        FILTER:
                        <PriceFilterComponent price={price} setPrice={setPrice} />
                    </List.Item>
                    <List.Item>
                        <RatingFilterComponent setRatingsFromFilter={setRatingsFromFilter} />
                    </List.Item>
                    {!location.pathname.match(/\/category/) && (
                        <List.Item>
                            <CategoryFilterComponent setCategoriesFromFilter={setCategoriesFromFilter} />
                        </List.Item>
                    )}
                    {attrsFilter.length !== 0 && (
                        <List.Item>
                            <AttributesFilterComponent
                                attrsFilter={attrsFilter}
                                setAttrsFromFilter={setAttrsFromFilter}
                            />
                        </List.Item>
                    )}
                    <List.Item>
                        <div className="flex md:justify-start justify-between w-full">
                            <Button type="primary" className="mr-2" onClick={handleFilters}>
                                Filter
                            </Button>
                            {showResetFiltersButton && (
                                <Button type="primary" danger onClick={resetFilters}>
                                    Reset Filters
                                </Button>
                            )}
                        </div>
                    </List.Item>
                </List>
            </div>
            <div className="flex flex-col items-center justify-between">
                <div className="flex gap-y-5 gap-x-[10px] flex-wrap">
                    {products &&
                        products.map((product) => <ProductListComponent key={product._id} product={product} />)}
                </div>
                {paginationLinksNumber > 1 && (
                    <PaginationComponent
                        categoryName={categoryName}
                        searchQuery={searchQuery}
                        paginationLinksNumber={paginationLinksNumber}
                        pageNum={pageNum}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductListPageComponent;
