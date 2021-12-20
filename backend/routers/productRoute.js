import express from "express";
import { products } from "../controllers/productController.js";

const router = express.Router();

router.post("/product/new", products.createProduct);
router.get("/products", products.getAllProducts);
router.put("/product/:id", products.updateProduct);
router.delete("/product/:id", products.deleteProduct);
router.get("/product/:id", products.getProductDetails);

export default router;
