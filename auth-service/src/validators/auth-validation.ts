import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Kullanıcı adı boş olamaz",
    "string.min": "Kullanıcı adı en az 3 karakter olmalıdır",
    "any.required": "Kullanıcı adı zorunludur",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Geçerli bir email adresi giriniz",
    "any.required": "Email alanı zorunludur",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Şifre en az 6 karakter olmalıdır",
    "any.required": "Şifre alanı zorunludur",
  }),
  fullname: Joi.string().required().messages({
    "string.empty": "Ad Soyad boş olamaz",
    "any.required": "Ad Soyad zorunludur",
  }),
  bio: Joi.string().allow("").optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Geçerli bir email adresi giriniz",
    "any.required": "Email zorunludur",
  }),
  password: Joi.string().required().messages({
    "any.required": "Şifre zorunludur",
  }),
});
