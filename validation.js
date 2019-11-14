const Joi=require('joi');

const register=data=>{
    const schema={
        name:Joi.string().min(4).required(),
        email:Joi.string().min(6).required().email(),
        password:Joi.string().min(6).required(),
        latitude:Joi.required(),
        longitude:Joi.required()
    }
    return Joi.validate(data,schema)   
}

const login=(data)=>{
    const schema={
        email:Joi.string().min(6).required().email(),
        password:Joi.string().min(6).required()
    }
    return Joi.validate(data,schema)   
}

module.exports={register,login};