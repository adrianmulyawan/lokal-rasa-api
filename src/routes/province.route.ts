import express from 'express';
import { 
  addManyProvinces,
  addOneProvince,
  deleteProvince,
  detailProvince,
  provinceListRecipes,
  showProvince,
  updateProvince
} from '../controllers/province.controller';

const router = express.Router();

router.get('/api/v1/province/show', showProvince);
router.post('/api/v1/province/addManyProvince', addManyProvinces);
router.post('/api/v1/province/addOneProvince', addOneProvince);
router.put('/api/v1/province/edit/:slug', updateProvince);
router.get('/api/v1/province/detail/:slug', detailProvince);
router.get('/api/v1/province/recipe/list', provinceListRecipes);
router.delete('/api/v1/province/delete/:slug', deleteProvince);

export default router;