import { Router } from 'express';
import userController from '../controller/user.js'

const router1 = Router();

router1.post('/login',userController.postLogin)
router1.post('/register',userController.postRegister)



export default  router1