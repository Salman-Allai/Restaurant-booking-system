const Table = require('../models/Table');
const Booking = require('../models/Booking');

const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailableTables = async (req, res) => {
  try {
    const { date, timeSlot } = req.query;

    if (!date || !timeSlot) {
      return res.status(400).json({ message: 'Date and timeSlot are required' });
    }

    const bookedTables = await Booking.find({
      date,
      timeSlot,
      status: { $ne: 'cancelled' },
    }).select('table');

    const bookedTableIds = bookedTables.map((b) => b.table.toString());

    const availableTables = await Table.find({
      _id: { $nin: bookedTableIds },
      isAvailable: true,
    });

    res.json(availableTables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity, location, description } = req.body;
    const table = await Table.create({ tableNumber, capacity, location, description });
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!table) return res.status(404).json({ message: 'Table not found' });
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) return res.status(404).json({ message: 'Table not found' });
    res.json({ message: 'Table removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllTables, getAvailableTables, createTable, updateTable, deleteTable };