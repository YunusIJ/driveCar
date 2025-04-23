// src/utils/pdfGenerator.js
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Ensure the receipts folder exists
const RECEIPT_DIR = path.resolve('receipts');
if (!fs.existsSync(RECEIPT_DIR)) {
  fs.mkdirSync(RECEIPT_DIR);
}

const generatePDFReceipt = (booking, user, car) => {
  return new Promise((resolve, reject) => {
    const receiptName = `receipt-${booking.id}.pdf`;
    const filePath = path.join(RECEIPT_DIR, receiptName);

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(20).text('🚗 DriveCar Booking Receipt', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Booking ID: ${booking.id}`);
    doc.text(`Name: ${user?.firstName || 'N/A'} ${user?.lastName || 'N/A'}`);
    doc.text(`Email: ${user?.email || 'N/A'}`);
    doc.text(`Car: ${car?.brand || 'N/A'} ${car?.model || ''} (${car?.year || ''})`);
    doc.text(`Booking Date: ${new Date(booking.startDate).toDateString()} to ${new Date(booking.endDate).toDateString()}`);
    doc.text(`Total Amount Paid: ₦${booking.totalAmount}`);
    doc.text(`Payment Status: ${booking.paymentStatus}`);
    doc.text(`Payment Date: ${new Date().toLocaleString()}`);

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};

export default generatePDFReceipt;
