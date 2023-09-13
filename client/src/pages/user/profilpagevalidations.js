import * as yup from "yup";

const validations = yup.object({
  name: yup.string().min(4, "Name must be at least 4 characters"),
  lastName: yup.string().min(4, "Last Name must be at least 4 characters"),
  phoneNumber: yup.string().length(10),
  address: yup.string().min(10).notRequired(),
  country: yup.string().min(3),
  city: yup.string().min(3),
  state: yup.string().min(3),
  zipCode: yup.string().min(5),
  password: yup
    .string()
    .required("Password is required!")
    .min(7, "Password  must be least 7 characters")
    // .matches(/[0-9]/, 'Password requires a number')
    // .matches(/[a-z]/, "Password requires a lowercase letter")
    // .matches(/[A-Z]/, "Password requires an uppercase letter")
    // .matches(/[^\w]/, "Password requires a symbol")

});

export default validations;
