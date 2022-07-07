const cron=require("node-cron");
const { OrderExpiredWatch, PrescriptionExpiredWatch } = require('./helpers/cronjob')


class Cronjob {
    static StartingCron(){
        // run every 1 minute
        cron.schedule('*/5 * * * *', () => {
            OrderExpiredWatch()
        });

        cron.schedule('*/5 * * * *', () => {
            PrescriptionExpiredWatch()
        });
    }

}

module.exports=Cronjob;