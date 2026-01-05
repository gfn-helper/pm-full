import { object, string } from 'yup';

const userSignupValidator = object({
  name: string().min(1).required(),
  email: string().email().required(),
  password: string().min(6).required(),
});

const userLoginValidator = object({
  email: string().email().required(),
  password: string().min(6).required(),
});

export { userSignupValidator, userLoginValidator };
