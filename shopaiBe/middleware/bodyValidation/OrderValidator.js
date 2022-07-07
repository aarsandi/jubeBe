const { body, param, validationResult } = require('express-validator')

class OrderValidator {
    static validate(method){
        switch (method) {
            case "public":
                return [
                    // items array
                    body('items', 'item must be array value').isArray(),
                    body('items', 'item cannot be empty').notEmpty(),
                    body('items.*.ItemId', 'item id required').notEmpty(),
                    body('items.*.qty', 'item quantity required').notEmpty(),
                    body('items.*.unit', 'item unit required').notEmpty(),
                    body('pickup_method', 'pickup method invalid value').notEmpty().isString().custom((value) => ['delivery', 'non_delivery'].includes(value)),
                ];
            case "prescript":
                return [
                    body('pickup_method', 'pickup method invalid value').notEmpty().isString().custom((value) => ['delivery', 'non_delivery'].includes(value)),
                    body('PrescriptionId', 'prescription id required').notEmpty()
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

module.exports=OrderValidator;