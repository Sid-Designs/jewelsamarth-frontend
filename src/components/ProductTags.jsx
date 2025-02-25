import { useState, useEffect } from "react";

const ProductTags = ({ selectedTags, setSelectedTags }) => {
  const availableTags = [
    "Jewelry",
    "Earrings",
    "Pendants",
    "Bands",
    "Bracelets",
    "Nose Pins",
    "Cufflinks",
    "Rings",
    "Women's Jewelry",
    "Men's Jewelry",
    "Accessories",
    "Fashion",
    "Catalog",
    "Inventory",
    "Pearl Earrings",
    "Pearl Pendants",
    "Rudraksha Earrings",
    "Rudraksha Pendants",
    "Silver Earrings",
    "Sheer Band",
    "Valentine's Jewelry",
    "Silver Bracelet",
    "Silver Nose Pin",
    "Silver Cufflink",
    "Silver Pendant",
    "Silver Mangalsutra",
    "Gemstone Jewelry",
    "Gold Jewelry",
    "Diamond Jewelry",
    "Handcrafted Jewelry",
    "Luxury Jewelry",
    "Everyday Wear"
  ];
  const [inputValue, setInputValue] = useState("");
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const rankedTags = rankTags(inputValue);

  function rankTags(query) {
    if (!query) return availableTags.filter(tag => !selectedTags.includes(tag));

    return availableTags
      .filter(tag => !selectedTags.includes(tag))
      .map(tag => ({
        tag,
        score: tag.toLowerCase().startsWith(query.toLowerCase()) ? 2 :
          tag.toLowerCase().includes(query.toLowerCase()) ? 1 : 0
      }))
      .filter(tagObj => tagObj.score > 0) // Remove non-matching results
      .sort((a, b) => b.score - a.score) // Sort by relevance
      .map(tagObj => tagObj.tag);
  }

  const handleTagClick = (tag) => {
    setSelectedTags([...selectedTags, tag]);
    setInputValue("");
    setIsTagDropdownOpen(false);
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (!isTagDropdownOpen) return;

    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) => (prev < rankedTags.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : rankedTags.length - 1));
    } else if (e.key === "Enter") {
      if (highlightedIndex !== -1 && rankedTags.length > 0) {
        handleTagClick(rankedTags[highlightedIndex]);
      }
    }
  };

  useEffect(() => {
    setHighlightedIndex(0); // Reset highlight on new input
  }, [inputValue]);

  return (
    <div className="formGroup">
      <label htmlFor="ProdTags">Product Tags</label>
      <div className="tagsInputContainer">
        <div className="tagsList">
          {selectedTags.map((tag) => (
            <div key={tag} className="tagChip">
              {tag}
              <button onClick={() => removeTag(tag)}>×</button>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add tags..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsTagDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsTagDropdownOpen(false), 100)}
          onKeyDown={handleKeyDown}
        />
        {isTagDropdownOpen && rankedTags.length > 0 && (
          <div className="tagsDropdown">
            {rankedTags.map((tag, index) => (
              <div
                key={tag}
                className={`tagOption ${highlightedIndex === index ? "highlighted" : ""}`}
                onMouseDown={() => handleTagClick(tag)}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTags;
