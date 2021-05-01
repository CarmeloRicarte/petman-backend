const { Router } = require('express');
const { obtenerReviews } = require('../../controllers/corpo-page/reviews');


const router = Router();

// obtener reviews
router.get('/', obtenerReviews);

module.exports = router;
