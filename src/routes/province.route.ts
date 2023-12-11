import express from 'express';
import { 
  addManyProvinces,
  showProvince
} from '../controllers/province.controller';

const router = express.Router();

router.get('/api/v1/province/show', showProvince);
router.post('/api/v1/province/addManyProvince', addManyProvinces)

export default router;