import express from 'express';
import { deleteStep, updateStep, uploadStep } from '../controllers/step.controller';
import { upload } from '../middlewares/multer'

const router = express.Router();

router.post('/api/v1/step/addStepCook', upload, uploadStep);
router.put('/api/v1/step/edit/:id', upload, updateStep);
router.delete('/api/v1/step/delete/:id', deleteStep);

export default router;