import express from "express";
import { showFoods, addNewFood, showDetailFood, findRecipe, updateFoodRecipe } from "../controllers/food.controller";
import { upload } from "../middlewares/multer";

const router = express.Router();

router.get('/api/v1/food/show', showFoods);
router.post('/api/v1/food/add', upload, addNewFood);
router.get('/api/v1/food/detail/:slug', showDetailFood);
router.get('/api/v1/food/search', findRecipe);
router.put('/api/v1/food/edit/:slug', upload, updateFoodRecipe);

export default router;