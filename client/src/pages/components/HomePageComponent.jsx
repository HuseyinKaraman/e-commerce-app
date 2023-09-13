import ProductCarouselComponent from "../../components/ProductCarouselComponent";
import CategoryCardComponent from "../../components/CategoryCardComponent";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";

import MetaComponent from "../../components/MetaComponent";

const HomePageComponent = ({ categories, getBestSellers }) => {
    const [mainCategories, setMainCategories] = useState([]);
    const [bestsellers, setBestsellers] = useState([]);

    useEffect(() => {
        getBestSellers()
            .then((data) => setBestsellers(data))
            .catch((er) => console.log(er.response.data.message ? er.response.data.message : er.response.data));
        setMainCategories((cat) => categories.filter((item) => !item.name.includes("/")));
    }, [categories, getBestSellers]);

    return (
        <>
            <MetaComponent />
            <div className="mx-auto">
                <ProductCarouselComponent bestsellers={bestsellers} />
                <Row gutter={[16, 24]} className="px-10 md:px-16 xl:px-36 mt-10">
                    {mainCategories.map((category, idx) => (
                        <Col className="w-full sm:w-1/2 lg:w-1/3" key={idx}>
                            <CategoryCardComponent category={category} idx={idx} />
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    );
};

export default HomePageComponent;
