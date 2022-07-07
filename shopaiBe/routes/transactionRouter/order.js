const router = require("express").Router();

const OrderController = require("../../controllers/Transaction/OrderController");
const { AuthenticationPublic } = require("../../middleware/authentication");
const { validate, viewValidateError } = require("../../middleware/bodyValidation/OrderValidator");

router.get(
    "/browse",
    AuthenticationPublic,
    OrderController.browse
);

router.post(
    "/order_public",
    validate("public"), viewValidateError,
    AuthenticationPublic,
    OrderController.orderPublic
);

router.post(
    "/order_prescript",
    validate("prescript"), viewValidateError,
    AuthenticationPublic,
    OrderController.orderPrescription
);

module.exports = router;