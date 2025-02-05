import * as React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export function NavMain({ items, onSidebarItemClick, collapsed }) {
  const [openDropdown, setOpenDropdown] = React.useState(null);
  const [activeItem, setActiveItem] = React.useState(null); // Track active menu item
  const [activeSubItem, setActiveSubItem] = React.useState({}); // Track active sub-items for each parent

  const handleItemClick = (item) => {
    if (item.items && item.items.length > 0) {
      setOpenDropdown(openDropdown === item.title ? null : item.title);
    } else {
      setActiveItem(item.componentName);
      setActiveSubItem({});
      onSidebarItemClick(item.componentName);
    }
  };

  const handleSubItemClick = (parentTitle, subItem) => {
    setActiveSubItem((prev) => ({
      ...prev,
      [parentTitle]: subItem.componentName,
    }));
    setActiveItem(null);
    onSidebarItemClick(subItem.componentName);
  };

  return (
    <nav className="border-none">
      <ul className="w-full flex flex-col px-[5px] text-sm">
        {items.map((item) => (
          <li key={item.title}>
            {/* Parent item button */}
            <button
              onClick={() => handleItemClick(item)}
              className={`${activeItem === item.componentName
                ? "activeDashItem"
                : ""
                } flex w-full justify-start items-center p-2 gap-4 rounded my-[4px] dashItem duration-200`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" /> {/* Icon (always visible) */}
              <span className="flex-grow text-start">{item.title}</span> {/* Always show title */}
              {/* Dropdown arrow for items with sub-items */}
              {item.items && item.items.length > 0 && (
                <span className="ml-auto">
                  {openDropdown === item.title ? (
                    <IoIosArrowUp className="w-4 h-4" />
                  ) : (
                    <IoIosArrowDown className="w-4 h-4" />
                  )}
                </span>
              )}
            </button>

            {/* Sub-items dropdown */}
            {item.items && item.items.length > 0 && openDropdown === item.title && (
              <ul className="pl-9 mx-2">
                {item.items.map((subItem) => (
                  <li key={subItem.title} className="mr-4">
                    <a
                      href={subItem.url}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubItemClick(item.title, subItem);
                      }}
                      className={`${activeSubItem[item.title] === subItem.componentName
                        ? "activeDashItem"
                        : ""
                        } flex w-full justify-start items-center p-2 my-[4px] gap-4 dashItem rounded duration-200 cursor-pointer`}
                    >
                      {subItem.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}