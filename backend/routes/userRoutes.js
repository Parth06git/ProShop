import express from "express";
import userController from "../controllers/userController.mjs";

const router = express.Router();

router.route("/login").post(userController.login);
router.route("/signup").post(userController.signUp);
router.use(userController.protect);
router.route("/logout").get(userController.logOut);

router
  .route("/profile")
  .get(userController.getUserProfile)
  .patch(userController.updateUserProfile)
  .delete(userController.deleteUserProfile);

router.route("/profile/password").patch(userController.updateUserPassword);

router.route("/").get(userController.getAllUsers);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
