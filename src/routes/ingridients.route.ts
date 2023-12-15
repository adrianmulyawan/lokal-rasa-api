import express from 'express';
import { 
  addIngridients,
  addSingleIngridients,
  deleteIngridient,
  editIngridients,
  showIngridients 
} from '../controllers/ingridients.controller';

const router =  express.Router();

router.get('/api/v1/ingridient/show', showIngridients);
router.post('/api/v1/ingridient/add', addIngridients);
router.post('/api/v1/ingridient/single/add', addSingleIngridients);
router.put('/api/v1/ingridient/edit/:id', editIngridients);
router.delete('/api/v1/ingridient/delete/:id', deleteIngridient);

export default router;