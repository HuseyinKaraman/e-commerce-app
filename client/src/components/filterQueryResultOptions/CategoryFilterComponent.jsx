import { Checkbox, Col, Row } from "antd";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";

const CategoryFilterComponent = ({ setCategoriesFromFilter }) => {
    const { categories } = useSelector((state) => state.category);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const myRefs = useRef([]);

    const selectCategory = (e, category, idx) => {
        setCategoriesFromFilter((items) => {
            return { ...items, [category.name]: e.target.checked };
        });

        var selectedMainCategory = category.name.split("/")[0];
        var allCategories = myRefs.current.map((_, id) => {
            return { name: categories[id].name, idx: id };
        });

        var indexesOfMainCategory = allCategories.reduce((acc, item) => {
            var cat = item.name.split("/")[0];
            if (cat === selectedMainCategory) {
                acc.push(item.idx);
            }
            return acc;
        }, []);

        if (e.target.checked) {
            setSelectedCategories((old) => [...old, "cat"]);
            myRefs.current.map((item, idx) => {
                if (!indexesOfMainCategory.includes(idx)) {
                    item.input.disabled = true;
                    return "";
                }
                return "";
            });
        } else {
            setSelectedCategories((old) => {
                var a = [...old];
                a.pop();
                if (a.length === 0) { // todo: changeable
                    window.location.href = "/product-list";
                }
                return a;
            });
        }
    };

    return (
        <div className="flex flex-col">
            <p className="font-bold mb-1">Category</p>
            <Checkbox.Group className="w-full">
                <Row>
                    {categories.map((category, idx) => (
                        <Col span={24} className="my-1" key={idx}>
                            <Checkbox
                                value={`A-${idx}`}
                                name={`A-${idx}`}
                                id={`attribute-id-${idx}`}
                                onChange={(e) => {
                                    selectCategory(e, category, idx);
                                }}
                                className="w-full text-green-600"
                                ref={(el) => (myRefs.current[idx] = el)}
                                disabled={myRefs.current[idx]?.input.disabled && selectedCategories.length > 0}
                            >
                                {category.name}
                            </Checkbox>
                        </Col>
                    ))}
                </Row>
            </Checkbox.Group>
        </div>
    );
};

export default CategoryFilterComponent;
