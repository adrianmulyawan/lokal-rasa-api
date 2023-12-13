import express from "express";
import { showFoods, addNewFood } from "../controllers/food.controller";
import { upload } from "../middlewares/multer";

const router = express.Router();

router.get('/api/v1/food/show', showFoods);
router.post('/api/v1/food/add', upload, addNewFood);

export default router;