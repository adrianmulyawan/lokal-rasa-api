import express from 'express';
import { 
  addNewCategory,
  deleteCategory,
  editCategory,
  findCategory,
  showAllCategories 
} from '../controllers/category.controller';

const router = express.Router();

router.get('/api/v1/category/show', showAllCategories);
router.post('/api/v1/category/add', addNewCategory);
router.get('/api/v1/category/find/:slug', findCategory);
router.put('/api/v1/category/edit/:slug', editCategory);
router.delete('/api/v1/category/delete/:slug', deleteCategory);

export default router;