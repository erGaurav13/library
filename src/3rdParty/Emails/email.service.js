// services/email.service.js
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendReminder(email, reservation) {
    let subject, text;
    console.log(email,"email")
    if (reservation.type === 'book') {
      subject = `Reminder: Book Pickup - ${reservation.book.title}`;
      text = `Hello,\n\nDon't forget to pick up "${reservation.book.title}" by ${reservation.book.author} tomorrow at the library.\n\nPickup Date: ${reservation.pickupDate.toDateString()}`;
    } else {
      subject = `Reminder: Room Reservation - ${reservation.roomSlot.room.name}`;
      text = `Hello,\n\nYour room reservation for ${reservation.roomSlot.room.name} is scheduled for tomorrow.\n\nTime: ${reservation.roomStart.toLocaleTimeString()} to ${reservation.roomEnd.toLocaleTimeString()}`;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();