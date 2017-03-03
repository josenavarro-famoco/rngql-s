import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    name: process.env.NAME,
  });
});

export default router;
