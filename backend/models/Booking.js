const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      enum: [
        '12:00 PM', '1:00 PM', '2:00 PM',
        '3:00 PM', '4:00 PM', '5:00 PM',
        '6:00 PM', '7:00 PM', '8:00 PM',
        '9:00 PM', '10:00 PM',
      ],
    },
    guests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: 1,
      max: 20,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    specialRequest: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

bookingSchema.index({ table: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
