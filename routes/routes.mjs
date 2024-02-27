import {Router} from 'express';
import workout from './workout.mjs'

const router = Router();

router.use('/workout/', workout);

export default router;