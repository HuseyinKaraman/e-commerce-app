import * as yup from "yup";

const validations = yup.object({
  name: yup.string().min(4, "Product Name must be at least 4 characters").required(),
  description: yup.string().min(10, "Description must be at least 10 characters").required(),
  count: yup.number().min(1, "Stock minumum must be 1").max(99,"Stock maximum must be 99").required(),
  price: yup.number().min(10, "Price minumum must be 1 $").max(2500,"Price maximum must be 2500 $").required(),
  newAttribute : yup.array(
    yup.object({
      key: yup.string().required("Key is required"),
      value: yup.string().required("value is required"),
    })
  )
});

export default validations;
