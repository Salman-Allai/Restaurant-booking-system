const express = require('express');
const router = express.Router();
const { getAllTables, getAvailableTables, createTable, updateTable, deleteTable } = require('../controllers/tableController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllTables);
router.get('/available', getAvailableTables);
router.post('/', protect, adminOnly, createTable);
router.put('/:id', protect, adminOnly, updateTable);
router.delete('/:id', protect, adminOnly, deleteTable);

module.exports = router;