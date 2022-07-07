const router = require("express").Router();

const DoctorController = require("../../controllers/User/DoctorController");
const { sendEmailApproved } = require("../../middleware/emailVerification/sendEmailApproved");
const { AuthenticationDoctor } = require("../../middleware/authentication");

// admin 
router.get("/admin/browse", DoctorController.browse);
router.patch("/admin/approveDoctor/:id", DoctorController.approveDoctor, sendEmailApproved);

// site
router.get("/profile", AuthenticationDoctor, DoctorController.profile);
router.patch("/edit", AuthenticationDoctor, DoctorController.edit);
router.patch("/setting", AuthenticationDoctor, DoctorController.setting);
router.patch("/change_password", AuthenticationDoctor, DoctorController.changePassword);

module.exports = router;