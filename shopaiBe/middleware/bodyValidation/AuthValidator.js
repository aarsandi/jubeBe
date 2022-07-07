const { body, param, validationResult } = require('express-validator')

class AuthValidator {
    static validate(method){
        switch (method) {
            case "register_public":
                return [
                    body('username', 'Username Field cannot be empty').notEmpty().isString(),
                    body('email', 'Email Field cannot be empty').notEmpty().isString(),
                    body('email', 'Invalid email format').isEmail(),
                    body('password','Password Field cannot be empty').notEmpty(),
                    body("password",'Password should be combination of one uppercase, one lower case, one digit and min 8, max 20 char long')
                        .isString()
                        .isLength({ min: 8, max: 20 })
                        .not()
                        .isLowercase()
                        .not()
                        .isUppercase()
                        .not()
                        .isNumeric(),
                    body('phoneNumber', 'Phonenumber Field cannot be empty').notEmpty().isString(),

                    body('address', 'Address Field cannot be empty').notEmpty(),
                    body('addressGeo', 'geo Field cannot be empty').notEmpty(),

                    body('fullname', 'Fullname Field cannot be empty').notEmpty().isString()
                ];
            case "register_doctor":
                return [
                    body('email', 'Email Field cannot be empty').notEmpty().isString(),
                    body('email', 'Invalid email format').isEmail(),
                    body('sipNumber', 'SIP Number Field cannot be empty').notEmpty().isString(),
                    body('phoneNumber', 'Phonenumber Field cannot be empty').notEmpty().isString(),

                    body('practiceAddress', 'Address Field cannot be empty').notEmpty(),
                    body('practiceAddressGeo', 'Address geo Field cannot be empty').notEmpty(),

                    body('fullname', 'Fullname Field cannot be empty').notEmpty().isString(),                    
                ];
            case "login":
                return [
                    body('username', 'Username Field cannot be empty').notEmpty().isString(),
                    body('password','Password Field cannot be empty').notEmpty().isString()
                ];
            case "loginRefCode":
                return [
                    body('refCode', 'Ref Code Field cannot be empty').notEmpty().isString(),
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

module.exports=AuthValidator;