const { body, param, validationResult } = require('express-validator')

class CartValidator {
    static validate(method){
        switch (method) {
            case "add":
                return [
                    body('qty', 'Qty cannot be empty').notEmpty(),
                ];
            case "editQty":
                return [
                    body('qty', 'Qty cannot be empty').notEmpty(),
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

module.exports=CartValidator;