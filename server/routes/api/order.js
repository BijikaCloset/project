const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Bring in Models & Helpers
const Order = require("../../models/order");
const Cart = require("../../models/cart");
const auth = require("../../middleware/auth");
const mailgun = require("../../services/mailgun");
const taxConfig = require("../../config/tax");

router.post("/add", auth, (req, res) => {
  const cart = req.body.cartId;
  const total = req.body.total;
  const user = req.user._id;

  const order = new Order({
    cart,
    user,
    total,
  });

  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }

    Order.findById(order._id)

      .populate("cart user", "-password")
      .exec((err, doc) => {
        if (err) {
          return res.status(400).json({
            error: "Your request could not be processed. Please try again.",
          });
        }

        Cart.findById(doc.cart._id)
          .populate({
            path: "products.product",
            populate: {
              path: "brand",
            },
          })
          .exec(async (err, data) => {
            if (err) {
              return res.status(400).json({
                error: "Your request could not be processed. Please try again.",
              });
            }

            const order = {
              _id: doc._id,
              created: doc.created,
              user: doc.user,
              total: doc.total,
              products: data.products,
            };

            const message = {
              subject: `Order Confirmation ${order._id}`,
              text:
                `Hi ${order.user.firstName}! Thank you for your order!. \n\n` +
                `We've received your order and will contact you as soon as your package is shipped. \n\n`,
            };

            // await mailgun.sendEmail(

            //   order.user.email,
            //   'order-confirmation',
            //   'smtp.mailgun.org',
            //   order
            // );7

            // console.log(doc.user)

            const output = `
						<p>Order Confirmation</p>
						<h3>Order Details</h3>
						<p> Your Order is confirmed </p>
						<h3>Details</h3>
            <p>${message.subject}</p>
            <p> ${order.products} </p>
            `;

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
              host: "smtp.google.com",
              port: 587,
              secure: false, // true for 465, false for other ports
              requireTLS: true,
              service: "gmail",
              auth: {
                user: "bijika.ordermanage@gmail.com", // generated ethereal user
                pass: "xwjabxwxafyrtfrh", // generated ethereal password
              },
            });

            // setup email data with unicode symbols
            let mailOptions = {
              from: '"Order COnfirmation"', // sender address
              to: [`${doc.user.email}`, "bijika.official@gmail.com"], // list of receivers
              subject: message.subject, // Subject line
              text: message.text, // plain text body
              html: output, // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
                console.log("there is error");
              } else {
                console.log("Message sent: %s", info.messageId);
                console.log(
                  "Preview URL: %s",
                  nodemailer.getTestMessageUrl(info)
                );

                //  foundUser.querys.push(newquery);
                //   foundUser.save();
              }
            });

            res.status(200).json({
              success: true,
              message: `Your order has been placed successfully!`,
              order: { _id: doc._id },
            });
          });
      });
  });
});

// fetch all orders api
router.get("/list", auth, (req, res) => {
  const user = req.user._id;
  const isAdmin = req.user.role;

  Order.find(isAdmin === "ROLE_ADMIN" ? null : { user })
    .populate({
      path: "cart",
      // populate: {
      //   path: 'cart.products',
      //   populate: {
      //     path: 'products.product',
      //     populate: {
      //       path: 'product.brand'
      //     }
      //   }
      // }
    })
    .exec((err, docs) => {
      if (err) {
        return res.status(400).json({
          error: "Your request could not be processed. Please try again.",
        });
      }

      if (docs.length > 0) {
        const newDataSet = [];
        docs.map((doc) => {
          Cart.findById(doc.cart._id)
            .populate({
              path: "products.product",
              populate: {
                path: "brand",
              },
            })
            .exec((err, data) => {
              if (err) {
                return res.status(400).json({
                  error:
                    "Your request could not be processed. Please try again.",
                });
              }

              const order = {
                _id: doc._id,
                total: doc.total,
                created: doc.created,
                products: data.products,
              };

              newDataSet.push(order);

              if (newDataSet.length === docs.length) {
                res.status(200).json({
                  orders: newDataSet,
                });
              }
            });
        });
      } else {
        res.status(404).json({
          message: `You have no orders yet!`,
        });
      }
    });
});

// fetch order api
router.get("/:orderId", auth, (req, res) => {
  const orderId = req.params.orderId;
  const user = req.user._id;

  Order.findOne({ _id: orderId, user })
    .populate({
      path: "cart",
    })
    .exec((err, doc) => {
      if (err) {
        return res.status(400).json({
          error: "Your request could not be processed. Please try again.",
        });
      }

      if (!doc) {
        return res.status(404).json({
          message: `Cannot find order with the id: ${orderId}.`,
        });
      }

      Cart.findById(doc.cart._id)
        .populate({
          path: "products.product",
          populate: {
            path: "brand",
          },
        })
        .exec((err, data) => {
          if (err) {
            return res.status(400).json({
              error: "Your request could not be processed. Please try again.",
            });
          }

          let order = {
            _id: doc._id,
            total: doc.total,
            totalTax: doc.totalTax,
            created: doc.created,
            products: data.products,
          };

          order = caculateTaxAmount(order);

          res.status(200).json({
            order,
          });
        });
    });
});

// calculate order tax amount
const caculateTaxAmount = (order) => {
  const taxRate = taxConfig.stateTaxRate;

  order.totalTax = 0;

  order.products.map((item) => {
    if (item.product.taxable) {
      const price = Number(item.product.price).toFixed(2);
      const taxAmount = Math.round(price * taxRate * 100) / 100;
      item.priceWithTax = parseFloat(price) + parseFloat(taxAmount);

      order.totalTax += taxAmount;
    }
  });

  order.totalWithTax = order.total + order.totalTax;

  return order;
};

module.exports = router;
