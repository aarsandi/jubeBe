const router = require("express").Router()
const Redis = require("ioredis");

const redis = new Redis();

router.get( '/test',  async (req, res, next) => {
    try {
        // const dataRes = await redis.get('name')
        
        res.status(200).json({
            message: "success",
            data: dataRes
        })
    } catch (err) {
        res.status(400).json({
            err
        })
    }
})

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
            res.status(200).json({message: "server orkes running"})
        } catch (err) {
            next(err)
        }
    }
)

module.exports = router