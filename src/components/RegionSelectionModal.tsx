"use client";

import { useState, useEffect } from "react";
import { MoldovaOnlyMap } from "./MoldovaMap";
import { RegionsModel } from "../typings/models";

interface RegionSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRegions: RegionsModel[];
  onRegionsChange: (regions: RegionsModel[]) => void;
  allRegions: RegionsModel[];
}

export function RegionSelectModal({
  isOpen,
  onClose,
  selectedRegions,
  onRegionsChange,
  allRegions,
}: RegionSelectModalProps) {
  const [localSelectedRegions, setLocalSelectedRegions] =
    useState<RegionsModel[]>(selectedRegions);
  const [showAllSelected, setShowAllSelected] = useState(false);

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelectedRegions(selectedRegions);
    } else {
      setLocalSelectedRegions([]);
    }
  }, [isOpen, selectedRegions]);

  const handleSave = () => {
    onRegionsChange(localSelectedRegions);
    onClose();
  };

  function handleRegionSelect(code: string, lat: number, lng: number) {
    // toggle in our list
    setLocalSelectedRegions((rs) =>
      rs.includes(code) ? rs.filter((r) => r !== code) : [...rs, code]
    );
  }

  const handleSelectAll = () => {
    if (localSelectedRegions.length === allRegions.length) {
      // If all are selected, deselect all
      setLocalSelectedRegions([]);
    } else {
      // Otherwise select all
      setLocalSelectedRegions([...allRegions]);
      // Keep the current primary region if it exists
    }
  };

  const areAllSelected = localSelectedRegions.length === allRegions.length;

  const displayedRegions =
    showAllSelected 
      ? localSelectedRegions
      : localSelectedRegions.slice(0, 12);

  if (!isOpen) return null;

  return (
    <dialog open={isOpen} className="z-[9992]!">
      <article className="z-[9992]!">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Click on regions in the map to select or deselect them.
            </p>
            <button
              onClick={handleSelectAll}
              className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
            >
              {areAllSelected ? "Deselect All" : "Select All"}
            </button>
          </div>

          <div className="h-[400px] mt-4 rounded-md overflow-hidden border border-gray-300">
            <MoldovaOnlyMap
              mode="selection"
              onRegionSelect={handleRegionSelect}
              selectedRegions={localSelectedRegions}
              availableRegions={allRegions}
            />
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">
              Selected Regions ({localSelectedRegions.length})
            </h3>
            {localSelectedRegions.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No regions selected. Click on the map to select regions.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto p-1">
                {displayedRegions.map((region) => (
                  <span
                    key={region.id}
                    className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700"
                  >
                    {region.name}
                  </span>
                ))}
                {!showAllSelected &&
                  localSelectedRegions.length > 12 && (
                    <span
                      onClick={() => setShowAllSelected(true)}
                      className="px-2 py-1 text-xs rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      +{localSelectedRegions.length - 12} more
                    </span>
                  )}
                {showAllSelected && (
                  <span
                    onClick={() => setShowAllSelected(false)}
                    className="px-2 py-1 text-xs rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    X
                  </span>
                )}
              </div>
            )}
            {localSelectedRegions.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Click on a region to set it as your primary region.
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Save Regions
          </button>
        </div>
      </article>
    </dialog>
  );
}
