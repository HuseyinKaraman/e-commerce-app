import * as yup from "yup";

const validations = yup.object({
  email: yup.string().email("email must be a valid").required("email is required!"),
  password: yup
    .string()
    .min(7, "Password  must be least 7 characters")
    .required("Password is required!"),
});

export default validations;
