import { Router } from 'express';

const router = new Router();

router.get('/:id', (req, res) => {
    res.send(JSON.stringify({
        duration: 45000
    }))
});

export default router;