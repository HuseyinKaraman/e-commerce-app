import axios from "axios";
import UserOrderDetailsPageComponent from "./components/UserOrderDetailsPageComponent";
import { useDispatch, useSelector } from "react-redux";
import { loadScript } from "@paypal/paypal-js";

const client_id = "AdFCgrsyXexXwJ9OO4-hz6MlsNUQmSvOb8KaAKTxz922KxlWvBLrKQPY1RMznv1PDWVqPO18as_BpFOi";

const getOrder = async (orderId) => {
    const { data } = await axios.get("/api/orders/user/" + orderId);
    return data;
};

const loadPaypalScript = async (cartSubtotal, cartItems,id,updateStateAfterOrder) => {
    loadScript({
        "client-id": client_id,
    })
        .then((paypal) => {
            paypal.Buttons(buttons(cartSubtotal, cartItems,id,updateStateAfterOrder)).render("#paypal-container-element");
        })
        .catch((err) => {
            console.error("failed to load the PayPal JS SDK script", err);
        });
};

const buttons = (cartSubtotal, cartItems,id,updateStateAfterOrder) => {
    return {
        createOrder: (data, actions) => {
            return actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            value: cartSubtotal,
                            breakdown: {
                                item_total: {
                                    currency_code: "USD",
                                    value: cartSubtotal,
                                },
                            },
                        },
                        items: cartItems.map((product) => {
                            return {
                                name: product.name,
                                unit_amount: {
                                    currency_code: "USD",
                                    value: product.price,
                                },
                                quantity: product.quantity,
                            };
                        }),
                    },
                ],
            });
        },
        onCancel: onCancelHandler,
        onApprove:  (data, actions) => {
            return actions.order.capture().then((orderData) => {
                var transaction = orderData.purchase_units[0].payments.captures[0];
                if (transaction.status === "COMPLETED" && Number(transaction.amount.value) === Number(cartSubtotal)) {
                    updateOrder(id).then(data=> {
                        if (data.isPaid) {
                            updateStateAfterOrder(data.paidAt);
                        }
                    }).catch(error => console.log(error));
                }
            })
        },
        onError: onErrorHandler,
    };
};

const onCancelHandler = () => {
    console.log("onCancelHandler");
};
const onErrorHandler = () => {
    console.log("onErrorHandler");
};


const updateOrder = async (orderId) => {
    const { data } = await axios.put("/api/orders/paid/" + orderId);
    return data;
};

const UserOrderDetailsPage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    return (
        <UserOrderDetailsPageComponent
            dispatch={dispatch}
            user={user}
            getOrder={getOrder}
            loadPaypalScript={loadPaypalScript}
        />
    );
};

export default UserOrderDetailsPage;
