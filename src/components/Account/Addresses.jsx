import React, { useState } from 'react';

const Addresses = () => {
  const [addresses, setAddresses] = useState([{ heading: "Addresses 1", text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit." }]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newHeading, setNewHeading] = useState("");
  const [newAddress, setNewAddress] = useState("");

  const handleAddAddress = () => {
    if (newHeading.trim() && newAddress.trim()) {
      const updatedAddresses = [...addresses, { heading: newHeading, text: newAddress }];
      setAddresses(updatedAddresses);

      // Send to backend
      console.log("Sending to backend:", updatedAddresses);

      // Close popup
      setIsPopupOpen(false);
      setNewHeading("");
      setNewAddress("");
    }
  };

  return (
    <>
      {addresses.map((address, index) => (
        <div className="flex justify-center items-center w-full py-12 sideCnt px-12 mb-8">
          <div className="flex flex-col gap-4 w-full">
            <div key={index}>
              <h1 className="text-xl font-bold">{address.heading}</h1>
              <p className="py-4">{address.text}</p>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => setIsPopupOpen(true)}
        className="w-fit btnshd bg-[var(--accent-color)] text-[var(--background-color)] px-4 py-2 rounded-[20px] hover:bg-[var(--primary-color)]"
      >
        Add Address
      </button>

      {/* Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Address</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission
                handleAddAddress();
              }}
            >
              {/* Heading Input */}
              <input
                type="text"
                value={newHeading}
                maxLength={20}
                onChange={(e) => setNewHeading(e.target.value)}
                className="border w-full p-2 rounded mb-4"
                placeholder="Enter heading"
                required // Enforces input requirement
              />
              {/* Address Textarea */}
              <textarea
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="border w-full p-2 rounded mb-4"
                placeholder="Enter address"
                rows="3"
                required // Enforces input requirement
              ></textarea>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit" // Submit button for the form
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

export default Addresses;
