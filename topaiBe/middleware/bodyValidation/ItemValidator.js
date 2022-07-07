const { body, param, validationResult } = require('express-validator')

class ItemValidator {
    static validate(method){
        switch (method) {
            case "updateStock":
                return [
                    body('items', 'item must be array value').isArray(),
                    body('items', 'item cannot be empty').notEmpty(),
                    body('items.*.action', 'action required').notEmpty(),
                    body('items.*.ItemId', 'item id required').notEmpty(),
                    body('items.*.qty', 'quantity required').notEmpty(),
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

module.exports=ItemValidator;