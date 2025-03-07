import React, { useState } from 'react';

const Payments = () => {
  const [payments, setPayments] = useState([
    { heading: "Payments 1", text: "example@upi" }
  ]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newHeading, setNewHeading] = useState("");
  const [newUPIID, setNewUPIID] = useState("");

  const handleAddPayment = () => {
    if (newHeading.trim() && newUPIID.trim()) {
      const updatedPayments = [...payments, { heading: newHeading, text: newUPIID }];
      setPayments(updatedPayments);

      // Send to backend
      console.log("Sending to backend:", updatedPayments);

      // Close popup
      setIsPopupOpen(false);
      setNewHeading("");
      setNewUPIID("");
    }
  };

  return (
    <>
      {/* Display Existing Payments */}
      {payments.map((payment, index) => (
        <div
          key={index}
          className="flex justify-center items-center w-full py-12 sideCnt px-12 mb-8"
        >
          <div className="flex flex-col gap-4 w-full">
            <div>
              <h1 className="text-xl font-bold">{payment.heading}</h1>
              <p className="py-4">{payment.text}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Add Payment Button */}
      <button
        onClick={() => setIsPopupOpen(true)}
        className="w-fit btnshd bg-[var(--accent-color)] text-[var(--background-color)] px-4 py-2 rounded-[20px] hover:bg-[var(--primary-color)]"
      >
        Add Payment
      </button>

      {/* Popup for Adding Payment */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Payment</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission
                handleAddPayment();
              }}
            >
              {/* Payment Method Name */}
              <input
                type="text"
                value={newHeading}
                maxLength={30}
                onChange={(e) => setNewHeading(e.target.value)}
                className="border w-full p-2 rounded mb-4"
                placeholder="Enter Payment Method Name (e.g., UPI)"
                required // Input must be filled
              />

              {/* UPI ID Input */}
              <input
                type="text"
                value={newUPIID}
                onChange={(e) => setNewUPIID(e.target.value)}
                className="border w-full p-2 rounded mb-4"
                placeholder="Enter UPI ID (e.g., example@upi)"
                required // Input must be filled
              />

              <div className="flex justify-end gap-4">
                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-[var(--accent-color)] text-white px-4 py-2 rounded hover:bg-[var(--primary-color)]"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Payments;
