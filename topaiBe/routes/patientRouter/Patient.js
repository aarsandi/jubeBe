const router = require("express").Router();

const PatientController = require("../../controllers/Patient/PatientController");
const { AuthenticationDoctor } = require("../../middleware/authentication");
const { validate, viewValidateError } = require("../../middleware/bodyValidation/PatientValidator");

router.get("/browse", AuthenticationDoctor, PatientController.browse);
router.get("/read/:id", AuthenticationDoctor, PatientController.read);
router.post(
    "/add",    
    validate("add_patient"), viewValidateError,
    AuthenticationDoctor,
    PatientController.addPatient
);

module.exports = router;