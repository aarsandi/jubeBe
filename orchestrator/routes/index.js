const router = require("express").Router()
const Redis = require("ioredis");
const axios = require('axios')

const redis = new Redis();

router.get( '/test',  (req, res, next) => {

    redis.get('product').then(data => {
        if(data) {
            res.status(200).json({
                message: "success",
                data: JSON.parse(data)
            })
            
        }else{
            axios.get('http://141.136.47.149/management/products' , { headers: {"Authorization" : `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJiZWFyZXIiLCJzdWIiOjE0MiwiaWF0IjoxNjU4NDEwNDA5LCJleHAiOjE2NTkwMTUyMDl9.xlYBVrLRAf39tx1VrxSP7XVkl-JPhfOp2h15tR9kSdA`} })
            .then(({ data }) => {
                if(data) {
                    redis.set('product', JSON.stringify(data.data))
                    res.status(200).json({
                        message: "success",
                        data: data.data
                    })
                }else{
                    res.status(404).json({
                        message: "data not found"
                    })
                }
            })
            .catch((error) => {
                res.status(404).json({
                    message: "data not found"
                })
            });
        }
    })
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