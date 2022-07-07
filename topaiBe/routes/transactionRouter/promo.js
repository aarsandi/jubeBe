const router = require("express").Router();

const PromoControlloer = require("../../controllers/Transaction/PromoControlloer");
const { AuthenticationPublic } = require("../../middleware/authentication");

router.get("/browse", AuthenticationPublic, PromoControlloer.browse);
router.get("/read/:id", AuthenticationPublic, PromoControlloer.read);
router.post("/claim", AuthenticationPublic, PromoControlloer.claim);

module.exports = router;