const {
  registerUser,
  loginUser,
  logout,
  forgetPassword,
  resetPassword,
  getUserDetail,
  updateUserPassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizRoles } = require("../middleWare/Auth");

const router = require("express").Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.post("/password/forgot", forgetPassword);
router.put("/password/reset/:token", resetPassword);
router.get("/me", isAuthenticatedUser, getUserDetail);
router.put("/password/update", isAuthenticatedUser, updateUserPassword);
router.put("/me/update", isAuthenticatedUser, updateProfile);
router.get(
  "/admin/users",
  isAuthenticatedUser,
  authorizRoles("admin"),
  getAllUsers
);
router
  .get(
    "/admin/user/:id",
    isAuthenticatedUser,
    authorizRoles("admin"),
    getSingleUser
  )
  .put(
    "/admin/user/:id",
    isAuthenticatedUser,
    authorizRoles("admin"),
    updateUser
  )
  .delete(
    "/admin/user/:id",
    isAuthenticatedUser,
    authorizRoles("admin"),
    deleteUser
  );

module.exports = router;
