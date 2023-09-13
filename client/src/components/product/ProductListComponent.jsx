import { Button, Card, Rate } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const ProductListComponent = ({product}) => {

  return (
    <Card
      hoverable
      cover={<img alt="" src={product.images[0] ? product.images[0].path : ""} crossOrigin="anonymous" />}
      className="md:max-w-[calc(50%_-_10px)] lg:max-w-[calc(33%_-_10px)]"
      size="small"
    >
      <h2 className="text-xl font-semibold">{product.name}</h2>
      <p className="my-2">{product.description}</p>
      <Rate disabled value={product.rating} className="text-[14px]" /> ({product.count})
      <div className="flex justify-between">
        <p className="font-semibold text-xl mt-auto">{product.price}$</p>
        <Link to={`/product-details/${product._id}`}>
          <Button type="primary" danger className="mt-2">
            See Product
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ProductListComponent;