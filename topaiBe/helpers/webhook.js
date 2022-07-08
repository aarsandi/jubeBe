const { App } = require("../models/index");
const axios = require('axios').default;

class Webhook {
    static itemStockChange(data) {
        axios.post('http://141.136.47.149/stok_change_topai', {
            data: data
        })
        .then(_ => {
            // console.log("");
        })
        .catch(err => {
            console.log(err,"error webhook decrease");
        });
        // console.log(data, "topai")
        // App.findAll({raw : true})
        // .then(data => {
        //     if(data){
        //         for (let el of data) {
        //             axios.post(el.stockChange, {
        //                 data: data
        //             })
        //             .then(_ => {
        //                 // console.log("");
        //             })
        //             .catch(_ => {
        //                 console.log("error webhook decrease");
        //             });
        //         }
        //     }
        // })
    }
}

module.exports = Webhook;