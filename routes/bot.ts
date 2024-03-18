import { Router } from 'express';
import EnglischController from '../controller/EnglishAI.js'
import  BotController  from '../controller/bots.js';
import MathController from '../controller/mathAI.js';
import CodeController from '../controller/code.js'
import NewsController from '../controller/news.js'

const router1 = Router();

router1.post('/TOMASZ/',EnglischController.handle)

router1.get('/',BotController.getAllBots);
router1.post('/',BotController.addNewBot);

router1.post('/JANUSZ/',CodeController.handle)

router1.post('/ELZBIETA/',MathController.handle)

router1.post('/KINGA/',NewsController.handle)

export default router1