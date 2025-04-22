import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generatePDFReceipt = (booking, user, car) => {
  return new Promise((resolve, reject) => {
    const receiptPath = path.join('receipts', `receipt-${booking.id}.pdf`);
    const doc = new PDFDocument();

    const stream = fs.createWriteStream(receiptPath);
    doc.pipe(stream);

    doc.fontSize(20).text('DriveCar Booking Receipt', { align: 'center' }).moveDown();
    doc.fontSize(14).text(`Booking ID: ${booking.id}`);
    doc.text(`Name: ${user.firstName} ${user.lastName}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Car: ${car.brand} ${car.model} (${car.year})`);
    doc.text(`Booking Date: ${booking.startDate} to ${booking.endDate}`);
    doc.text(`Total Amount Paid: ₦${booking.totalAmount}`);
    doc.text(`Payment Status: ${booking.paymentStatus === 'PAID' ? '✅ PAID' : '❌ PENDING'}`);
    doc.text(`Payment Date: ${booking.updatedAt.toLocaleString()}`);

    doc.end();

    stream.on('finish', () => resolve(receiptPath));
    stream.on('error', reject);
  });
};


export default generatePDFReceipt;
