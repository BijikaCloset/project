// Bring in Models & Helpers
const User = require("../../models/user");
const Payment = require("../../models/payment");
const Product = require("../../models/product");
const auth = require("../../middleware/auth");
const role = require("../../middleware/role");

const express = require("express");
const { RateReview } = require("@material-ui/icons");
const router = express.Router();
const async = require("async");

// fetch all users api
router.get("/list", auth, role.checkRole(role.ROLES.Admin), (req, res) => {
  User.find({}, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
    res.status(200).json({
      users: data,
    });
  });
});

router.get("/", auth, (req, res) => {
  const user = req.user._id;

  User.findById(user, { password: 0, _id: 0 }, (err, user) => {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }

    res.status(200).json({
      user,
    });
  });
});

router.put("/", auth, (req, res) => {
  const user = req.user._id;
  const update = req.body.profile;
  const query = { _id: user };

  User.findOneAndUpdate(
    query,
    update,
    {
      new: true,
    },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "Your request could not be processed. Please try again.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Your profile is successfully updated!",
        user,
      });
    }
  );
});

router.post("/successBuy", auth, (req, res) => {
  let history = [];
  let transaction = {};

  req.body.cartItems.forEach((item) => {
    history.push({
      dateOfPurchase: Date.now(),
      name: item.name,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      paymantId: req.body.paymentData.paymentID,
    });
  });

  // console.log(history)

  transaction.user = {
    id: req.user._id,
    name: req.user.firstName,
    email: req.user.email,
  };

  transaction.data = req.body.paymentData;
  transaction.product = history;

  User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { history: history } },
    { new: true },
    (err, user) => {
      if (err) return res.json({ success: false, err });

      const payment = new Payment(transaction);
      // console.log(payment);
      payment.save((err, doc) => {
        if (err) return res.json({ success: false, err });

        //3. Increase the amount of number for the sold information

        //first We need to know how many product were sold in this transaction for
        // each of products

        let products = [];
        doc.product.forEach((item) => {
          products.push({ id: item.id, quantity: item.quantity });
        });

        // first Item    quantity 2
        // second Item  quantity 3

        async.eachSeries(
          products,
          (item, callback) => {
            Product.update(
              { _id: item.id },
              {
                $inc: {
                  sold: item.quantity,
                },
              },
              { new: false },
              callback
            );
          },
          (err) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).json({
              success: true,
              cart: user.cart,
              cartDetail: [],
            });
          }
        );
      });
    }
  );
});

module.exports = router;
