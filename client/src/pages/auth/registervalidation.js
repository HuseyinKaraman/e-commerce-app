import * as yup from "yup";

const validations = yup.object({
  name: yup.string().min(4, "Name must be at least 4 characters").required("Name is required!"),
  lastName: yup.string().min(4, "Last Name must be at least 4 characters").required("Last Name is required!"),
  email: yup.string().email("email must be a valid").required("email is required!"),
  password: yup
    .string()
    .min(7, "Password  must be least 7 characters")
    .matches(/[0-9]/, 'Password requires a number')
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol")
    .required("Password is required!"),
//    passwordConfirm: yup.string().oneOf([yup.ref("password"),null],"Both password should match!").required("Repeat Password is required!")
//   passwordConfirm: yup
//     .string()
//     .test("passwords-match", "Passwords must match", function (value) {
//       const password = document.querySelector("input[id='register-form_password']").value;
//       return password === value;
//     })
//     .required("Repeat Password is required!"),
});

export default validations;

/** .matches(/[0-9]/, 'Password requires a number')
    .matches(/[a-z]/, 'Password requires a lowercase letter')
    .matches(/[A-Z]/, 'Password requires an uppercase letter')
    .matches(/[^\w]/, 'Password requires a symbol'),
 */
