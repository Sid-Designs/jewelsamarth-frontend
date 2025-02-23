import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react"; // Import icons

const SizeSelector = ({ onSizeChange }) => {  // Receive function from parent
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [step, setStep] = useState(1); // Step 1 = Min Range, Step 2 = Max Range
  const [selectedMin, setSelectedMin] = useState(null);
  const [selectedMax, setSelectedMax] = useState(null);

  const minSizeRange = [...Array(10)].map((_, i) => i + 1); // 1 to 10
  const maxSizeRange = [...Array(10)].map((_, i) => i + 15); // 15 to 24

  const handleMinSizeChange = (size) => {
    setSelectedMin(size);
    setStep(2); // Move to Max Range selection
  };

  const handleMaxSizeChange = (size) => {
    setSelectedMax(size);
    setIsSizeDropdownOpen(false); // Close dropdown after selection
    setStep(1); // Reset step for next time

    // Send data to parent
    onSizeChange(`${selectedMin} - ${size}`);
  };

  return (
    <div className="formGroup">
      <label htmlFor="ProdSize">Size</label>
      <div className="customSelect">
        <div
          className="selectTrigger w-[200px] flex justify-between items-center p-2 cursor-pointer"
          onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
          aria-haspopup="true"
          aria-expanded={isSizeDropdownOpen}
        >
          {selectedMin && selectedMax ? `${selectedMin} - ${selectedMax}` : "Select Size"}
          {isSizeDropdownOpen ? <ChevronUp className="pr-2" /> : <ChevronDown className="pr-2" />}
        </div>

        {isSizeDropdownOpen && (
          <div className="selectDropdown mt-2">
            {step === 1 && (
              <>
                <div className="font-semibold p-2 py-3 bg-[var(--accent-color)] text-[var(--background-color)]">Select Min Range</div>
                <div className="flex flex-col space-y-2" style={{ borderTop: "2px solid #efefef" }}>
                  {minSizeRange.map((size) => (
                    <div
                      key={size}
                      className="selectOption p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleMinSizeChange(size)}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="font-semibold p-2 py-3 bg-[var(--accent-color)] text-[var(--background-color)]">Select Max Range</div>
                <div className="flex flex-col space-y-2" style={{ borderTop: "2px solid #efefef" }}>
                  {maxSizeRange
                    .filter((size) => size >= selectedMin) // Ensure max is >= min
                    .map((size) => (
                      <div
                        key={size}
                        className="selectOption p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleMaxSizeChange(size)}
                      >
                        {size}
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeSelector;