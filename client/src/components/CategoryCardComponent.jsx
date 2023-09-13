import { Button, Card } from "antd";
import { Link } from "react-router-dom";

const CategoryCardComponent = ({ category, idx }) => {

  return (
    <Card hoverable cover={<img alt={category} src={category.image ?? null} crossOrigin="anonymous" />} className="max-w-[500px] mx-auto">
      <h2 className="text-xl font-semibold">{category.name}</h2>
      <p className="my-2">{category.description}</p>
      <Link to={`/product-list/category/${category.name}`}>
        <Button type="primary">Go to Category</Button>
      </Link>
    </Card>
  );
};

export default CategoryCardComponent;
