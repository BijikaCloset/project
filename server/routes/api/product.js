const express = require("express");
const router = express.Router();

// Bring in Models & Helpers
const Product = require("../../models/product");
const Brand = require("../../models/brand");
const Category = require("../../models/category");
const auth = require("../../middleware/auth");
const role = require("../../middleware/role");
const fileUpload = require("../../middleware/fileupload");

router.post(
  "/add",
  fileUpload.single("image"),
  auth,
  role.checkRole(role.ROLES.Admin),
  (req, res) => {
    // console.log(req.body);
    // const sku = req.body.sku;
    // const name = req.body.name;
    // const description = req.body.description;
    // const quantity = req.body.quantity;
    // const price = req.body.price;
    // const taxable = req.body.taxable;
    // const brand = req.body.brand;
    // const image = req.body.image;
    // const key = req.file.key;

    // console.log(key);
    // console.log("i am image yoooooooo", image);

    const file = req.file;
    console.log(file);

    // if (!sku) {
    //   return res.status(400).json({ error: "You must enter sku." });
    // }

    // if (!description || !name) {
    //   return res
    //     .status(400)
    //     .json({ error: "You must enter description & name." });
    // }

    // if (!quantity) {
    //   return res.status(400).json({ error: "You must enter a quantity." });
    // }

    // if (!price) {
    //   return res.status(400).json({ error: "You must enter a price." });
    // }

    // fileUpload(req, res, (error) => {
    //   // console.log( 'requestOkokok', req.file );
    //   // console.log( 'error', error );
    //   console.log("inside fileUpload", req.file);
    //   if (error) {
    //     console.log("errors", error);
    //     res.json({ error: error });
    //   } else {
    //     // If File not found
    //     if (req.file === undefined) {
    //       console.log("Error: No File Selected!");
    //       res.json("Error: No File Selected");
    //     } else {
    //       // If Success
    //       const imageName = req.file.key;
    //       const imageLocation = req.file.location; // Save the file name into database into profile model
    //       res.json({
    //         image: imageName,
    //         location: imageLocation,
    //       });
    //     }
    //   }
    // });

    // Product.findOne({ sku }, (err, existingProduct) => {
    //   if (err) {
    //     return res.status(400).json({
    //       error: "Your request could not be processed. Please try again.",
    //     });
    //   }

    //   if (existingProduct) {
    //     return res.status(400).json({ error: "This sku is already in use." });
    //   }

    //   // console.log(
    //   //   sku,
    //   //   name,
    //   //   description,
    //   //   quantity,
    //   //   price,
    //   //   taxable,
    //   //   brand,
    //   //   image
    //   // );

    //   const product = new Product({
    //     sku,
    //     name,
    //     description,
    //     quantity,
    //     price,
    //     taxable,
    //     brand,
    //     image,
    //   });

    //   // console.log(product);

    //   product.save((err, data) => {
    //     // console.log(data);
    //     if (err) {
    //       return res.status(400).json({
    //         error: "Your request could not be processed. Please try again.",
    //       });
    //     }

    //     res.status(200).json({
    //       success: true,
    //       message: `Product has been added successfully!`,
    //       product: data,
    //     });
    //   });
    // });
  }
);

// fetch product api
router.get("/item/:slug", (req, res) => {
  const slug = req.params.slug;

  Product.findOne({ slug })
    .populate("brand")
    .exec((err, data) => {
      console.log(data);
      if (err) {
        return res.status(400).json({
          error: "Your request could not be processed. Please try again.",
        });
      }

      if (!data) {
        return res.status(404).json({
          message: "No product found.",
        });
      }

      res.status(200).json({
        product: data,
      });
    });
});

// fetch all products api
router.get("/list", (req, res) => {
  console.log("hello i am getting");
  Product.find({})
    .populate("brand", "name")
    .exec((err, data) => {
      cosole.log(data, "I am products");
      if (err) {
        return res.status(400).json({
          error: "Your request could not be processed. Please try again.",
        });
      }
      res.status(200).json({
        products: data,
      });
    });
});

// fetch all products by category api
router.get("/list/category/:slug", (req, res) => {
  const slug = req.params.slug;

  Category.findOne({ slug: slug }, "products -_id")
    .populate("products")
    .exec((err, data) => {
      console.log(data, "I am products");
      if (err) {
        return res.status(400).json({
          error: "Your request could not be processed. Please try again.",
        });
      }

      if (!data) {
        return res.status(404).json({
          message: "No products found.",
        });
      }

      res.status(200).json({
        products: data ? data.products : data,
      });
    });
});

// fetch all products by brand api
router.get("/list/brand/:slug", (req, res) => {
  const slug = req.params.slug;

  Brand.find({ slug }, (err, brand) => {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }

    if (brand.length <= 0) {
      return res.status(404).json({
        message: `Cannot find brand with the slug: ${slug}.`,
      });
    }

    Product.find({ brand: brand[0]._id })
      .populate("brand", "name")
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: "Your request could not be processed. Please try again.",
          });
        }
        res.status(200).json({
          products: data,
        });
      });
  });
});

router.get("/list/select", auth, (req, res) => {
  Product.find({}, "name", (err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }

    res.status(200).json({
      products: data,
    });
  });
});

router.delete(
  "/delete/:id",
  auth,
  role.checkRole(role.ROLES.Admin),
  (req, res) => {
    Product.deleteOne({ _id: req.params.id }, (err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Your request could not be processed. Please try again.",
        });
      }

      res.status(200).json({
        success: true,
        message: `Product has been deleted successfully!`,
        product: data,
      });
    });
  }
);

module.exports = router;
