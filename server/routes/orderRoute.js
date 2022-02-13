const {
  newOrder,
  getSingleOrder,
  getMyOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/OrderController");
const { isAuthenticatedUser, authorizRoles } = require("../middleWare/Auth");

const router = require("express").Router();

router.post("/order/new", isAuthenticatedUser, newOrder);

router.get("/order/:id", isAuthenticatedUser, getSingleOrder);

router.get("/orders", isAuthenticatedUser, getMyOrder);

router.get(
  "/admin/orders",
  isAuthenticatedUser,
  authorizRoles("admin"),
  getAllOrders
);

router.put(
  "/admin/order/:id",
  isAuthenticatedUser,
  authorizRoles("admin"),
  updateOrder
);

router.delete(
  "/admin/order/:id",
  isAuthenticatedUser,
  authorizRoles("admin"),
  deleteOrder
);

module.exports = router;
