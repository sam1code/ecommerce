const router = require("express").Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSpecificProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizRoles } = require("../middleWare/Auth");

router.get("/products", getAllProducts);
router.post(
  "/admin/products/new",
  isAuthenticatedUser,
  authorizRoles("admin"),
  createProduct
);
router
  .put(
    "/admin/products/:id",
    isAuthenticatedUser,
    authorizRoles("admin"),
    updateProduct
  )
  .get("/products/:id", getSpecificProduct)
  .delete(
    "/admin/products/:id",
    isAuthenticatedUser,
    authorizRoles("admin"),
    deleteProduct
  );

router.put("/review", isAuthenticatedUser, createProductReview);

router.get("/reviews", getProductReviews);
router.delete("/reviews", isAuthenticatedUser, deleteReview);

module.exports = router;
