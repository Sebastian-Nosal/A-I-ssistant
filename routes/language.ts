import { Router } from 'express';
import languageController from "../controller/language.js";

const language = Router();

language.get('/:code',languageController.get)
language.post('/',languageController.post)

export default language