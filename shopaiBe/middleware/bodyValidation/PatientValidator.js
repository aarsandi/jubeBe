const { body, param, validationResult } = require('express-validator')

class PatientValidator {
    static validate(method){
        switch (method) {
            case "add_patient":
                return [
                    body('nik', 'NIK Field cannot be empty').notEmpty().isString(),
                    body('fullname', 'Fullname Field cannot be empty').notEmpty().isString(),

                    body('berat','Weight Field cannot be empty').notEmpty(),
                    body('tinggi','Height Field cannot be empty').notEmpty(),
                    body('tensi', 'Tension Field cannot be empty').notEmpty(),
                    body('saturasi', 'Saturation Field cannot be empty').notEmpty(),
                    body('suhu', 'Temperature Field cannot be empty').notEmpty(),

                    body('dob', 'date of birth field must be date format').isDate(),
                    body('gender', 'gender field cannot be empty').notEmpty(),

                    body('berat','Weight Field must be numeric').isNumeric(),
                    body('tinggi','Height Field must be numeric').isNumeric(),
                    body('tensi', 'Tension Field must be numeric').isNumeric(),
                    body('saturasi', 'Saturation Field must be numeric').isNumeric(),
                    body('suhu', 'Temperature Field must be numeric').isNumeric(),

                    body('phoneNumber', 'Phone Number Field cannot be empty').notEmpty().isString(),
                    body('address', 'Address Field cannot be empty').notEmpty().isString(),
                    body('addressGeo', 'addressGeo Field cannot be empty').notEmpty().isString(),
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

module.exports=PatientValidator;