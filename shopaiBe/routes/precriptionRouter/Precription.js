const router = require("express").Router();

const PrescriptionController = require("../../controllers/Prescription/PrescriptionController");
const { AuthenticationDoctor } = require("../../middleware/authentication");
const { validate, viewValidateError } = require("../../middleware/bodyValidation/PrecriptionValidator");

router.get("/browse", AuthenticationDoctor, PrescriptionController.browse);
router.get("/read/:id", AuthenticationDoctor, PrescriptionController.read);

router.post(
    "/create",
    validate("create_precription"), viewValidateError,
    AuthenticationDoctor,
    PrescriptionController.create
);

module.exports = router;