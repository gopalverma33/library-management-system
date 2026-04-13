function calculateFine(dueDate, returnDate) {
  const today = new Date();
  const effectiveReturnDate = returnDate ? new Date(returnDate) : today;
  const due = new Date(dueDate);

  // Compare using calendar dates only to avoid time-of-day rounding issues.
  due.setHours(0, 0, 0, 0);
  effectiveReturnDate.setHours(0, 0, 0, 0);

  if (effectiveReturnDate > due) {
    const diffTime = effectiveReturnDate - due;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * 10; // ₹10 per day fine
  }
  return 0;
}

module.exports = calculateFine;