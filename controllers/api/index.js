const router = require('express').Router();
const userRoutes = require('./userRoutes');
// change line 6 and project routes to reflect blogs
const projectRoutes = require('./projectRoutes');

router.use('/users', userRoutes);
router.use('/projects', projectRoutes);

module.exports = router;
