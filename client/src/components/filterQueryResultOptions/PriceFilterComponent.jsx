import { Slider } from "antd";

const PriceFilterComponent = ({price,setPrice}) => {
  return (
    <div className="w-full">
      <span className="font-bold mr-2">Price no greater than:</span>{price}$
      <Slider max={1000} min={10} step={10} defaultValue={price} onChange={e=>setPrice(e)}/>
    </div>
  );
};

export default PriceFilterComponent;
