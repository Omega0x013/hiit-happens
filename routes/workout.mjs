import { Router } from 'express';

const router = new Router();

router.get('/:id', (req, res) => {
    res.send(JSON.stringify({
        duration: 12000,
        name: "Example Workout"
    }))
});

export default router;