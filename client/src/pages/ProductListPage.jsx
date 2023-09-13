import ProductListPageComponent from "./components/ProductListPageComponent";
import { useSelector } from "react-redux";
import axios from "axios";

let filtersUrl = "";


const proceedFilters = (filters)=> {
    // filtersUrl = "&price=60&rating=1,2,3&category=a,b,c,&attrs=color-red-blue,size-1TB-2TB"
    filtersUrl = "";
    Object.keys(filters).map((key,index)=>{
        if (key ==="price") {
            filtersUrl += `&price=${filters[key]}`
        }else if (key ==="rating"){
            let cat = "";
            Object.keys(filters[key]).map((key2,index2)=>{
                if (filters[key][key2]) cat += `${key2},`
                return "";
            })
            filtersUrl += `&rating=` + cat;
        }
        else if (key==="category"){
            let cat = "";
            Object.keys(filters[key]).map((key3,index3)=>{
                if (filters[key][key3]) cat += `${key3},`
                return "";
            })
            filtersUrl += `&category=` + cat;
        }else if (key === "attrs"){
            if (filters[key].length >0) {
                let val = filters[key].reduce((acc,item)=>{
                    let itemKey = item.key;
                    let itemVal = item.values.join("-");
                    return acc+ itemKey+"-"+itemVal+","; 
                },"");
                filtersUrl += "&attrs="+ val;
            }
        }
        return "";
    })
    return filtersUrl;
}


const getProducts = async (filters={}, pageNumParam=null,sortOption="", categoryName="", searchQuery="") => {
    filtersUrl = proceedFilters(filters);   
    const search = searchQuery ? `search/${searchQuery}/` : "";
    const category = categoryName ? `category/${categoryName}/` : "";
    const url= `/api/products/${category}${search}?pageNum=${pageNumParam}${filtersUrl}&sort=${sortOption}`

    const { data } = await axios.get(url);
    return data;
};

const ProductListPage = () => {
    const { categories } = useSelector((state) => state.category);

    return <ProductListPageComponent getProducts={getProducts} categories={categories} />;
};

export default ProductListPage;
