const { App } = require("../models/index");
const axios = require('axios').default;

class Webhook {
    static itemStockChange(data) {
        console.log(data, "topai")
        App.findAll({raw : true})
        .then(data => {
            if(data){
                for (let el of data) {
                    axios.post(el.stockChange, {
                        data: data
                    })
                    .then(_ => {
                        // console.log("");
                    })
                    .catch(_ => {
                        console.log("error webhook decrease");
                    });
                }
            }
        })
    }
}

module.exports = Webhook;