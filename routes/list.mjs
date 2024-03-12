import { Router } from 'express';

const router = new Router();

router.get('/:uid', (req, res) => {
    // Send a temporary response to any request
    res.send(JSON.stringify([
        "abc"
    ]));
});

export default router;