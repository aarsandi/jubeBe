const router = require("express").Router()
const userRouter = require("../routes/userRouter/User")
const doctorRouter = require("../routes/userRouter/Doctor")
const authRouter = require("../routes/userRouter/Auth")
const patientRouter = require("../routes/patientRouter/Patient")
const precriptionRouter = require("../routes/precriptionRouter/Precription")
const itemRouter = require("../routes/itemRouter/Item")
const cartRouter = require("../routes/transactionRouter/cart")
const orderRouter = require("../routes/transactionRouter/order")
const promoRouter = require("../routes/transactionRouter/promo")

const { setUserNotificiation, setAdminNotificiation } = require('../helpers/firebase')
const { PrescriptionExpiredWatch, OrderExpiredWatch } = require('../helpers/cronjob')

router.use("/user", userRouter)
router.use("/doctor", doctorRouter)
router.use("/auth", authRouter)

router.use("/patient", patientRouter)

router.use("/prescription", precriptionRouter)

router.use("/item", itemRouter)

router.use("/cart", cartRouter)
router.use("/order", orderRouter)
router.use("/promo", promoRouter)


router.get( '/test',  OrderExpiredWatch)

router.get(
    '/',
    async (req, res, next) => {
        try {
            // test notif
            // setUserNotificiation({
            //     userId: 1,
            //     title: "title 1",
            //     message: "message",
            //     category: "register",
            //     role: 'doctor'/'user_eprescription'
            // })
            
            // setAdminNotificiation({
            //     role: "AdminV",
            //     title: "title 1",
            //     message: "message",
            //     category: "Login"
            // })
            res.status(200).json({message: "server running"})
        } catch (err) {
            next(err)
        }
    }
)

module.exports = router