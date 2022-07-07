const router = require("express").Router();

const ItemController = require("../../controllers/Item/ItemController");
const { validate, viewValidateError } = require("../../middleware/bodyValidation/ItemValidator");

router.get("/browse", ItemController.browse);
router.get("/read/:id", ItemController.read);
router.get("/browseByCat", ItemController.browseByCat);
router.get("/browseCat", ItemController.browseCategory);

// update stock
router.patch(
    "/updateStock",    
    validate("updateStock"), viewValidateError,
    ItemController.updateStok
);

module.exports = router;