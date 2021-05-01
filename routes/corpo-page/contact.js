const { Router } = require('express');
const { sendEmail } = require('../../controllers/corpo-page/contact');

const router = Router();

// obtener reviews
router.post('/', sendEmail);

module.exports = router;