const router = require("express").Router();

const AuthController = require("../../controllers/User/AuthController");
const VerificationController = require("../../controllers/User/VerificationController");
const { sendEmailRegister } = require("../../middleware/emailVerification/sendEmailRegistration");
const { sendEmailForgetPass } = require("../../middleware/emailVerification/sendEmailForgetPass");

const { validate, viewValidateError } = require("../../middleware/bodyValidation/AuthValidator");

// upload file to cloud
const { Multer } = require("../../middleware/Multer")

// auth
router.post("/register_public",
    validate("register_public"), viewValidateError,
    AuthController.registerPublic,
    sendEmailRegister
);
router.post("/register_doctor",
    Multer.single('file'),
    validate("register_doctor"), viewValidateError,
    AuthController.registerDoctor,
    sendEmailRegister
);
router.post("/user/forget_password",
    AuthController.forgetPasswordPublic,
    sendEmailForgetPass
);
router.post("/doctor/forget_password",
    AuthController.forgetPasswordDoctor,
    sendEmailForgetPass
);

// web
router.post(
    "/login_public",
    validate("login"), viewValidateError,
    AuthController.loginPublic
);
router.post(
    "/login_doctor",
    validate("login"), viewValidateError,
    AuthController.loginDoctor
);
router.post(
    "/loginByRefCode",
    validate("loginRefCode"),
    viewValidateError,
    AuthController.loginByRefCode
);

router.post(
    "/mobile/login_public",
    validate("login"), viewValidateError,
    AuthController.loginPublicMobile
);
router.post(
    "/mobile/login_doctor",
    validate("login"), viewValidateError,
    AuthController.loginDoctorMobile
);
router.post(
    "/mobile/loginByRefCode",
    validate("loginRefCode"),
    viewValidateError,
    AuthController.loginByRefCodeMobile
);

// router.patch("/logout", AuthController.logout);

// verifikasi
router.get("/verify/:jwttoken", VerificationController.verifyUser);

module.exports = router;