const { body, param, validationResult } = require('express-validator')

class UserValidator {
    static validate(method){
        switch (method) {
            case "change_password":
                return [
                    body('password', 'Password Field cannot be empty').notEmpty().isString(),
                    body('new_password','New password Field cannot be empty').notEmpty().isString()
                ];
            case "setting":
                return [
                    body('language', 'Language Field cannot be empty').notEmpty().isString(),
                    body('push_notification','Push Notification Field cannot be empty').notEmpty().isString(),
                    body('dark_theme','Dark Theme Field cannot be empty').notEmpty().isString()
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

module.exports=UserValidator;