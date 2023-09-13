import React from "react";
import { Link } from "react-router-dom";
import { Carousel } from "antd";

const ProductCarouselComponent = ({ bestsellers }) => {
    return (
        <>
            {bestsellers?.length > 0 ? (
                <Carousel className="mb-5">
                    {bestsellers.map((product,idx)=>(
                      <div className="relative" key={idx}>
                      <img
                          src={product.images ? product.images[0].path : null}
                          alt={product.name}
                          className="h-[300px] w-full object-cover"
                          crossOrigin="anonymous"
                      />
                      <div className="text text-center absolute text-yellow-50 bottom-8 z-50 w-full ">
                          <Link to={`/product-details/${product._id}`} className=" hover:text-orange-500">
                              <h2 className="text-2xl font-serif">Bestseller in {product.category} Category</h2>
                          </Link>
                          <p className="">{product.description}</p>
                      </div>
                  </div>
                    ))}
                </Carousel>
            ) : null}
        </>
    );
};

export default ProductCarouselComponent;
