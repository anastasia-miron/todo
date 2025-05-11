import React, { useEffect, useLayoutEffect, useState } from "react";
import Avatar from "../components/Avatar";
import "./UserPage.css";
import apiService from "../services/api.service";
import { ProfileModel, RegionsModel } from "../typings/models";
import { useParams } from "react-router";
import Rating from "../components/Rating";
import ReviewList from "../components/ReviewList";
import useRefreshTrigger from "../hooks/useRefreshTrigger";
import { BriefcaseIcon, CalendarIcon, MailIcon, MapIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { MoldovaOnlyMap } from "../components/MoldovaMap";

const UserPage: React.FC = () => {
  const { id } = useParams();
  const { trigger, mutate } = useRefreshTrigger();
  const [profile, setProfile] = useState<ProfileModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [volunteerRegions, setVolteerRegions] = useState<RegionsModel[]>([]);
  const [showAllRegions, setShowAllRegions] = useState(false);
  const [regions, setRegions] = useState<RegionsModel[]>([]);

  useLayoutEffect(() => {
    const ctrlProfie = new AbortController();
    const ctrlRegions = new AbortController();
    (async () => {
      setIsLoading(true);
      const response = await apiService.get<ProfileModel>(`/profile/${id}`, {
        signal: ctrlProfie.signal,
      });
      if (ctrlProfie.signal.aborted) return;
      if (response.success) {
        setProfile(response.data);
        if (response.data.regions) {
          setVolteerRegions(response.data.regions || []);
        }
      }
      setIsLoading(false);
    })();

    (async () => {
      setIsLoading(true);
      const response = await apiService.get<RegionsModel[]>(`/regions`, {
        signal: ctrlRegions.signal,
      });
      if (ctrlRegions.signal.aborted) return;
      if (response.success) {
        setRegions(response.data);
      }
      setIsLoading(false);
    })();
    return () => ctrlRegions.abort();
  }, [trigger, id]);

  const toggleMap = () => {
    setShowMap((showMap) => {
      if (!showMap && profile?.regions) {
        setVolteerRegions(profile?.regions);
      } else {
        setVolteerRegions([]);
      }

      return !showMap;
    });
  };

  const toggleRegionsDisplay = () => {
    setShowAllRegions(!showAllRegions);
  };


  useEffect(() => {
    if (profile?.regions) {
      setVolteerRegions(profile.regions);
    }
  }, [profile]);


  if (isLoading) {
    return <article aria-busy="true" />;
  }

  if (!profile) {
    return <article>Server Error</article>;
  }

  return (
    <>
      <article className="user flex flex-col">
        <div className="relative">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <Avatar user={profile!} className="profile__avatar" />
            <div className="flex flex-col gap-2 sm:text-left">
              <div className="flex items-center gap-2">
                <h2 className="text-xl m-0! font-semibold">{profile.username}</h2>
                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 capitalize">
                  {profile.type}
                </span>
                <span
                  className="flex items-center"
                  title={`${profile.isVerified ? "Verified" : "Not Verified"}`}
                >
                  <span
                    className={`w-4 h-4 ${profile.isVerified ? " bg-green-500" : "bg-gray-500"
                      } text-white rounded-full flex items-center justify-center`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3 h-3"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                </span>
              </div>
              <Rating value={profile.rating} readOnly />
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 sm:mt-0">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>
                  <b>Phone: </b>
                  <a href={`tel:${profile.phone}`}>{profile.phone}</a>
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <MailIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>
                  <b>Email: </b>
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </span>
              </div>

              {profile.type === "volunteer" && profile.availability && (
                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>
                    <b>Availability: </b>{profile.availability}
                  </span>
                </div>
              )}

              {profile.type === "volunteer" && profile.skills && (
                <div className="flex items-center gap-2 text-gray-600">
                  <BriefcaseIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>
                    <b>Skills:</b> {profile.skills}
                  </span>
                </div>
              )}

              {profile.type === "beneficiary" && profile.needs && (
                <div className="flex items-center gap-2 text-gray-600">
                  <BriefcaseIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>
                    <b>Needs:</b> {profile.needs}
                  </span>
                </div>
              )}

              {profile.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPinIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>
                    <b>Location:</b> {profile.location}
                  </span>
                </div>
              )}

              {/* Regions section - only show for volunteers */}
              {profile.type === "volunteer" &&
                profile.regions &&
                profile.regions.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <b>Available Regions:</b>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={toggleMap}
                          className="p-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                        >
                          {showMap ? "Hide Map" : "Show Map"}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(showAllRegions
                        ? profile?.regions
                        : profile?.regions.slice(0, 3)
                      ).map((region) => (
                        <span
                          key={region.id}
                          className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700"
                        >
                          {region.name}
                        </span>
                      ))}
                      {!showAllRegions && profile?.regions.length > 3 && (
                        <span
                          onClick={toggleRegionsDisplay}
                          className="px-2 py-0.5 text-xs cursor-pointer hover:bg-gray-400 rounded-full bg-gray-100 text-gray-700"
                        >
                          +{profile.regions.length - 3} more
                        </span>
                      )}
                      {showAllRegions && (
                        <span
                          onClick={toggleRegionsDisplay}
                          className="px-2 py-0.5 text-xs cursor-pointer hover:bg-gray-400 rounded-full bg-gray-100 text-gray-700"
                        >
                          X
                        </span>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

      </article>

      {profile.type === "volunteer" && profile.regions && showMap && (
        <div className="mt-4 border h-[350px] border-gray-200 rounded-md overflow-hidden">
          <MoldovaOnlyMap
            mode="show"
            selectedRegions={volunteerRegions}
            availableRegions={regions}
          />
        </div>
      )}

      {profile.reviews.length > 0 && (
        <div className="user__reviews">
          <h2>User Reviews</h2>
          <ReviewList
            reviews={profile.reviews}
            onDelete={mutate}
            onUpdate={mutate}
          />
        </div>
      )}
    </>
  );
};

export default UserPage;
