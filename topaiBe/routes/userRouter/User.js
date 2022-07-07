const router = require("express").Router();

const UserController = require("../../controllers/User/UserController");

const { AuthenticationPublic } = require("../../middleware/authentication");

router.get("/admin/browse", UserController.browse);

router.get("/profile", AuthenticationPublic, UserController.profile);
router.patch("/edit", AuthenticationPublic, UserController.edit);
router.patch("/setting", AuthenticationPublic, UserController.setting);
router.patch("/change_password", AuthenticationPublic, UserController.changePassword);

module.exports = router;