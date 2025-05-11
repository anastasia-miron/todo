import React, { useEffect, useState } from "react";
import { ProfileModel, RegionsModel } from "../typings/models";
import { useFormik } from "formik";
import { volunteerPageSchema } from "../schemas";
import { MapIcon } from "lucide-react";
import { MultiSelect } from "./ui/MultiSelect";
import { RegionSelectModal } from "./RegionSelectionModal";

interface Props {
  value: ProfileModel;
  availableRegions: RegionsModel[];
  open: boolean;
  onClose: () => unknown;
  onSubmit: (data: ProfileModel) => Promise<unknown>;
}
const AVAILABILITY_OPTIONS = [
  "Full-time",
  "Evenings",
  "Weekends",
  "Flexible",
  "24/24",
];

const EditVolunteerProfile: React.FC<Props> = (props) => {
  const { value, onClose, onSubmit, open, availableRegions } = props;

  const {
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    dirty,
    isValid,
    isSubmitting,
    errors,
  } = useFormik({
    initialValues: value,
    validationSchema: volunteerPageSchema,
    onSubmit,
  });

  const [selectedRegions, setSelectedRegions] = useState<RegionsModel[]>(
    value.regions || []
  );
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [showAllSelected, setShowAllSelected] = useState(false);

  const handleRegionsChange = (regions: RegionsModel[]) => {
    setSelectedRegions(regions);
  };

  useEffect(() => {
    if (value.regions) {
      setFieldValue(
        "regions",
        selectedRegions.map((region) => region)
      );
    }
  }, [selectedRegions]);

  const displayedRegions = showAllSelected
    ? selectedRegions
    : selectedRegions.slice(0, 12);

  if (!open) return null;

  return (
    <dialog open className="z-[9991]!">
      <article className="z-[9991]!">
        <form onSubmit={handleSubmit}>
          <label htmlFor="profileImg">Profile Image URL</label>
          <input
            id="profileImg"
            type="url"
            name="profileImg"
            placeholder="http://imgur.com/"
            aria-invalid={errors.profileImg ? "true" : "false"}
            aria-describedby="error-profile-img"
            value={values.profileImg ?? ""}
            onChange={handleChange}
          />
          {errors.profileImg && (
            <small id="error-profile-img">{errors.profileImg}</small>
          )}
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Username"
            aria-invalid={errors.username ? "true" : "false"}
            aria-describedby="error-username"
            value={values.username ?? ""}
            onChange={handleChange}
          />
          {errors.username && (
            <small id="error-username">{errors.username}</small>
          )}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            name="email"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby="error-email"
            placeholder="email@example.com"
            value={values.email ?? ""}
            onChange={handleChange}
          />
          {errors.email && <small id="error-email">{errors.email}</small>}
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="text"
            name="phone"
            aria-invalid={errors.phone ? "true" : "false"}
            aria-describedby="error-phone"
            placeholder="070000000"
            value={values.phone ?? ""}
            onChange={handleChange}
          />
          {errors.phone && <small id="error-phone">{errors.phone}</small>}
          <label htmlFor="skills">Skills</label>
          <input
            id="skills"
            type="text"
            name="skills"
            aria-invalid={errors.skills ? "true" : "false"}
            aria-describedby="error-skills"
            placeholder="Skills"
            value={values.skills ?? ""}
            onChange={handleChange}
          />
          {errors.skills && <small id="error-skills">{errors.skills}</small>}

          <label htmlFor="availability">Availability</label>
          <select
            id="availability"
            name="availability"
            aria-invalid={errors.availability ? "true" : "false"}
            aria-describedby="error-availability"
            value={values.availability ?? ""}
            onChange={handleChange}
          >
            {errors.availability && (
              <small id="error-availability">{errors.availability}</small>
            )}
            <option value="">Select availability</option>
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Regions
            </label>
            <div className="space-y-2">
              <MultiSelect<RegionsModel>
                options={availableRegions}
                selectedValues={selectedRegions}
                onChange={setSelectedRegions}
                placeholder="Select regions"
              />

              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <MapIcon className="w-4 h-4" />
                <span>Select Regions on Map</span>
              </button>

              {displayedRegions.length > 0 && (
                <div className="mt-2">
                  <div className="text-sm font-medium mb-1">
                    Selected Regions:
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto p-1">
                    {displayedRegions.map((region) => (
                      <span
                        key={region.id}
                        className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700"
                      >
                        {region.name}
                      </span>
                    ))}
                    {!showAllSelected && displayedRegions.length > 6 && (
                      <span
                        onClick={() => setShowAllSelected(true)}
                        className="px-2 py-1 text-xs rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                      >
                        +{selectedRegions.length - 12} more
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
                </div>
              )}
            </div>
          </div>

          <footer className="flex flex-col mt-3">
            <button
              aria-busy={isSubmitting}
              disabled={!dirty || !isValid}
              type="submit"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="outline contrast"
            >
              Close
            </button>
          </footer>
        </form>
      </article>

      <RegionSelectModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        selectedRegions={selectedRegions}
        onRegionsChange={handleRegionsChange}
        allRegions={availableRegions}
      />
    </dialog>
  );
};

export default EditVolunteerProfile;
