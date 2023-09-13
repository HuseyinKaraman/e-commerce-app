const ObjectId = require("mongodb").ObjectId

const orders = Array.from({length: 22}).map((_, idx) => {
    let day = 25
    if(idx < 10) {
        var hour = "0" + idx
        var subtotal = 100
    } else if(idx > 16 && idx < 21) {
        var hour = idx
        var subtotal = 100 + 12*idx
    } else {
        var hour = idx
        var subtotal = 100
    }
    return {
        user: new ObjectId("6488a4d8dcf924b931694650"),
        orderTotal: {
            itemsCount: 3,
            cartSubTotal: subtotal
        },
        cartItems: [
            {
                name: "Tablet name",
                price: 30,
                image: {path: "/images/tablets-category.png"},
                quantity: 3,
                count: 12
            },
            {
                name: "Monitor Name",
                price: 10,
                image: {path: "/images/monitors-category.png"},
                quantity: 1,
                count: 10
            }
        ],
        paymentMethod: "PayPal",
        isPaid: false,
        isDelivered: false,
        createdAt: `2023-04-${day}T${hour}:12:36.490+00:00`
    }
})

module.exports = orders
