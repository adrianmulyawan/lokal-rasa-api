import express from 'express';

import { 
  showRegion, 
  addNewRegion, 
  showDetailRegion,
  updateRegion,
  deleteRegion
} from '../controllers/region.controller';

const router = express.Router();

router.get('/api/v1/region/show', showRegion);
router.post('/api/v1/region/add', addNewRegion);
router.get('/api/v1/region/detail/:slug', showDetailRegion);
router.put('/api/v1/region/edit/:slug', updateRegion);
router.delete('/api/v1/region/delete/:slug', deleteRegion);

export default router;