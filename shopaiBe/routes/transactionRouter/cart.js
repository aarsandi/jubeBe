const router = require("express").Router();

const CartController = require("../../controllers/Transaction/CartController");
const { AuthenticationPublic } = require("../../middleware/authentication");

router.get("/browse", AuthenticationPublic, CartController.browse);
router.post("/add", AuthenticationPublic, CartController.add);
router.put("/editQty/:id", AuthenticationPublic, CartController.editQty);
router.delete("/remove/:id", AuthenticationPublic, CartController.remove);

module.exports = router;