const { Router } = require('express');
const { obtenerReviews } = require('../controllers/reviews');


const router = Router();

// obtener reviews
router.get('/', obtenerReviews);

module.exports = router;
