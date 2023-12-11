import express from 'express';

import { showRegion, addNewRegion, showDetailRegion } from '../controllers/region.controller';

const router = express.Router();

router.get('/api/v1/region/show', showRegion);
router.post('/api/v1/region/add', addNewRegion);
router.get('/api/v1/region/detail/:slug', showDetailRegion);

export default router;