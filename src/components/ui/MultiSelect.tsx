"use client";

import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from "lucide-react";
import type React from "react";

import { useState, useRef, useEffect } from "react";

export interface MultiSelectProps<T extends { id: string; name: string }> {
  options: T[];
  selectedValues: T[];
  onChange: (selected: T[]) => void;
  placeholder?: string;
}
export function MultiSelect<T extends { id: string; name: string }>({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options",
}: MultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropDirection, setDropDirection] = useState<"down" | "up">("down");
  const containerRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => ({
        id: option.value,
        name: option.label,
      })
    );

    onChange(selectedOptions as T[]);
  };

  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      onChange([]);
    } else {
      onChange(options);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const checkPosition = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 300 && spaceAbove > spaceBelow) {
        setDropDirection("up");
      } else {
        setDropDirection("down");
      }
    };

    checkPosition();
    window.addEventListener("resize", checkPosition);
    window.addEventListener("scroll", checkPosition);

    return () => {
      window.removeEventListener("resize", checkPosition);
      window.removeEventListener("scroll", checkPosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (selectRef.current) {
      Array.from(selectRef.current.options).forEach((option) => {
        option.selected = selectedValues.some(
          (selectedValue) => selectedValue.id === option.id
        );
      });
    }
  }, [selectedValues]);

  const areAllSelected = selectedValues.length === options.length;

  return (
    <div className="relative" ref={containerRef}>
      <select
        ref={selectRef}
        multiple
        className="sr-only dark:bg-gray-900"
        onChange={handleSelectChange}
        aria-hidden="true"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full dark:bg-gray-900 px-3 h-12 py-2 border border-gray-500 rounded-md bg-white text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className={selectedValues.length === 0 ? "text-gray-400" : ""}>
          {selectedValues.length === 0
            ? placeholder
            : selectedValues.length === 1
            ? selectedValues[0].name
            : areAllSelected
            ? "All Regions selected"
            : `${selectedValues.length} regions selected`}
        </span>
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </div>

      {/* Custom dropdown */}
      {isOpen && (
        <div
          className={`absolute z-10 w-full bg-white dark:bg-gray-900 border border-gray-300 rounded-md shadow-lg max-h-67 overflow-auto ${
            dropDirection === "up" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          <div className="sticky top-0 bg-white dark:bg-gray-900 p-2 border-b border-gray-200 z-10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search regions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8! pr-2! py-1! border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
              <SearchIcon className="absolute left-2 top-1/3 transform -translate-y-1/3 h-4 w-4 text-gray-400" />
            </div>
            <button
              type="button"
              onClick={handleSelectAll}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm font-medium text-blue-600"
            >
              {areAllSelected ? "Deselect All" : "Select All"}
            </button>
          </div>

          {filteredOptions.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">
              No matching regions found
            </div>
          ) : (
            <div className="py-1">
              {filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer"
                  onClick={() => {
                    const newSelected = selectedValues.some(
                      (selectedValue) => selectedValue.id === option.id
                    )
                      ? selectedValues.filter((v) => v.id !== option.id)
                      : [...selectedValues, option];

                    onChange(newSelected);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.some(
                      (selectedValue) => selectedValue.id === option.id
                    )}
                    onChange={() => {}}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="ml-2 text-sm">{option.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
