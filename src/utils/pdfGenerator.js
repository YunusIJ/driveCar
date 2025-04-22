import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const generatePDFReceipt = (booking, user, car) => {
  return new Promise((resolve, reject) => {
    try {
      const receiptDir = path.join('receipts');
      if (!fs.existsSync(receiptDir)) {
        fs.mkdirSync(receiptDir);
      }

      const fileName = `receipt-${booking.id}.pdf`;
      const filePath = path.join(receiptDir, fileName);

      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      const paymentDate = new Date();

      doc.fontSize(20).text('🚗 DriveCar Booking Receipt', { align: 'center' });
      doc.moveDown();

      doc.fontSize(14).text(`Booking ID: ${booking.id}`);
      doc.text(`Name: ${user?.firstName || 'N/A'} ${user?.lastName || ''}`);
      doc.text(`Email: ${user?.email || 'N/A'}`);
      doc.text(`Car: ${car.brand} ${car.model} (${car.year})`);
      doc.text(`Booking Date: ${startDate.toDateString()} to ${endDate.toDateString()}`);
      doc.text(`Total Amount Paid: ₦${booking.totalAmount}`);
      doc.text(`Payment Status: ${booking.paymentStatus || 'UNKNOWN'}`);
      doc.text(`Payment Date: ${paymentDate.toLocaleString()}`);

      doc.end();

      writeStream.on('finish', () => {
        resolve(filePath);
      });

      writeStream.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
};

export default generatePDFReceipt;
