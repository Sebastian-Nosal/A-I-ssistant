import { Router } from 'express';
import authController from "../controller/auth.js"

const router1 = Router();

router1.get('/register/u2f',authController.getRegisterU2f)
router1.post('/register/u2f',authController.postRegisterU2f)

router1.get('/login/u2f',authController.getLoginU2f)
router1.post('/login/u2f',authController.postLoginU2f)

router1.post('/register/PIN',authController.setPin)
router1.post('/login/PIN',authController.checkPin)

router1.post('/register/mail',authController.setMail)
router1.post('/login/mail',authController.checkMail)

export default  router1