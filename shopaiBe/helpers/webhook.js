const { App } = require("../models/index");
const axios = require('axios').default;

class Webhook {
    static itemStockChange(data) {
        axios.post('http://141.136.47.149/stok_change_shopai', {
            data: data
        })
        .then(_ => {
            // console.log("");
        })
        .catch(err => {
            console.log(err,"error webhook decrease");
        });
        // App.findAll({raw : true})
        // .then(data => {
        //     if(data){
        //         for (let el of data) {
        //             console.log(el.stokChange, "shopai")
        //             axios.post(`${el.stockChange}`, {
        //                 data: data
        //             })
        //             .then(_ => {
        //                 // console.log("");
        //             })
        //             .catch(err => {
        //                 console.log(err,"error webhook decrease");
        //             });
        //         }
        //     }
        // })
    }
}

module.exports = Webhook;