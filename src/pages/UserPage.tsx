import React, { useLayoutEffect, useState } from "react";
import Avatar from "../components/Avatar";
import "./UserPage.css";
import apiService from "../services/api.service";
import { ProfileModel } from "../typings/models";
import useAbortSignal from "../hooks/useAbortSignal";
import { useParams } from "react-router";
import Rating from "../components/Rating";
import ReviewList from "../components/ReviewList";
import useRefreshTrigger from "../hooks/useRefreshTrigger";
import { VolunteerRegionsMap } from "../components/RegionMoldovaMap";

const UserPage: React.FC = () => {
  const { id } = useParams();
  const { trigger, mutate } = useRefreshTrigger();
  const [profile, setProfile] = useState<ProfileModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const signal = useAbortSignal();

  useLayoutEffect(() => {
    (async () => {
      setIsLoading(true);
      const response = await apiService.get<ProfileModel>(`/profile/${id}`, {
        signal,
      });
      if (signal.aborted) return;
      setIsLoading(false);
      if (response.success) {
        setProfile(response.data);
      }
    })();
  }, [trigger, id]);

  if (isLoading) {
    return <article aria-busy="true" />;
  }

  if (!profile) {
    return <article>Server Error</article>;
  }

  return (
    <>
      <article className="user">
        <header>
          <div className="user__header">
            <Avatar user={profile} className="user__avatar" />
            <div className="user__info">
              <div className="user__label">Name</div>
              <div>{profile.username}</div>
              <div className="user__label">Type</div>
              <div>{profile.type}</div>
            </div>
          </div>
        </header>
        <section className="user__details">
          <div className="user__label">Rating</div>
          <Rating value={profile.rating} readOnly />
          {profile.phone && (
            <>
              <div className="user__label">Phone</div>
              <div>
                <a href={`tel:${profile.phone}`}>{profile.phone}</a>
              </div>
            </>
          )}
          {profile.email && (
            <>
              <div className="user__label">Email</div>
              <div>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </div>
            </>
          )}
          {profile.needs && (
            <>
              <div className="user__label">Needs</div>
              <div>{profile.needs}</div>
            </>
          )}
          {profile.location && (
            <>
              <div className="user__label">Location</div>
              <div>{profile.location}</div>
            </>
          )}
          {profile.availability && (
            <>
              <div className="user__label">Availability</div>
              <div>{profile.availability}</div>
            </>
          )}
          {profile.skills && (
            <>
              <div className="user__label">Skills</div>
              <div>{profile.skills}</div>
            </>
          )}
        </section>
      </article>
   
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
