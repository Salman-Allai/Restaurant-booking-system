const Booking = require('../models/Booking');
const Table = require('../models/Table');

const createBooking = async (req, res) => {
  try {
    const { tableId, date, timeSlot, guests, specialRequest } = req.body;

    const table = await Table.findById(tableId);
    if (!table) return res.status(404).json({ message: 'Table not found' });
    if (!table.isAvailable) return res.status(400).json({ message: 'Table is not available' });

    const existing = await Booking.findOne({
      table: tableId,
      date,
      timeSlot,
      status: { $ne: 'cancelled' },
    });
    if (existing) return res.status(400).json({ message: 'Table already booked for this slot' });

    const booking = await Booking.create({
      user: req.user._id,
      table: tableId,
      date,
      timeSlot,
      guests,
      specialRequest,
    });

    await booking.populate('table');

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('table')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('table')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email').populate('table');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'confirmed') {
      return res.status(400).json({ message: 'Cannot cancel a confirmed booking, contact restaurant' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus, cancelBooking };