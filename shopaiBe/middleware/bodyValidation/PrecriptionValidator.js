const { body, param, validationResult } = require('express-validator')

class PrecriptionValidator {
    static validate(method){
        switch (method) {
            case "create_precription":
                return [
                    // patient object
                    body('PatientId', 'Patient id required').notEmpty(),

                    // items array
                    body('items', 'item must be array value').isArray(),
                    body('items.*.ItemId', 'items.ItemId required').notEmpty(),
                    body('items.*.frequency', 'item frequency required').notEmpty().isString(),
                    body('items.*.doseQty', 'item dose quantity required').notEmpty(),
                    body('items.*.orderQty', 'item order quantity required').notEmpty(),
                    body('items.*.unit', 'item unit required').notEmpty(),

                    // concoction array
                    body('concoction', 'concoction must be array value').isArray(),                    
                    body('concoction.*.name', 'concoction optional required').notEmpty().isString(),
                    body('concoction.*.optional', 'concoction optional required').notEmpty().isString(),
                    body('concoction.*.doseQty', 'concoction doseQty required').notEmpty(),
                    body('concoction.*.qtyInText', 'concoction qtyInText required').notEmpty(),
                    body('concoction.*.qty', 'concoction quantity required').notEmpty(),
                    body('concoction.*.frequency', 'concoction frequency required').notEmpty(),

                    body('concoction.*.items', 'item concoction must be array value').isArray(),
                    body('concoction.*.items', 'item concoction cannot be empty').notEmpty(),
                    body('concoction.*.items.*.ItemId', 'item id in concoction required').notEmpty(),
                    body('concoction.*.items.*.doseQty', 'item dose quantity in concoction required').notEmpty(),
                    body('concoction.*.items.*.unit', 'item unit in concoction required').notEmpty(),
                ];
            default:
                return [];
        };
    }

    static viewValidateError(req,res,next) {
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            let results=[],output=[];
            errors.array().forEach((item)=>{
                if(!results.includes(item.param)){
                    results.push(item.param);
                    output.push(item);
                }
            });
            res.status(400).json({
                message:output.find((item)=>item).msg
            });
        }else{
            next();
        }
    }

}

module.exports=PrecriptionValidator;