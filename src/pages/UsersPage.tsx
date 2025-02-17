import React, { useLayoutEffect, useState } from "react";
import Avatar from "../components/Avatar";
import "./ProfilePage.css"
import apiService from "../services/api.service";
import { ProfileModel } from "../typings/models";
import useAbortSignal from "../hooks/useAbortSignal";
import { useParams } from "react-router";
import Rating from "../components/Rating";

const UserPage: React.FC = () => {
    const {username} = useParams();
    const [profile, setProfile] = useState<ProfileModel | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const signal = useAbortSignal();

    useLayoutEffect(() => {
        (async () => {
            setIsLoading(true);
            const response = await apiService.get<ProfileModel>(`/profile/${username}`, { signal });
            if (signal.aborted) return;
            setIsLoading(false);
            if (response.success) {
                setProfile(response.data);
            }
        })()
    }, []);

    if (isLoading) {
        return (<article aria-busy="true" />)
    }

    if (!profile) {
        return (<article>Server Error</article>)
    }

    return (
        <div className="profile">
            <header>
                <div className="grid">
                    <Avatar user={profile} className="profile__avatar" />
                    <div className="profile__info">
                        <div className="profile__label">Name</div>
                        <div>{profile.username}</div>
                        <div className="profile__label">Type</div>
                        <div>{profile.type}</div>
                    </div>
                </div>
            </header>
            <section className="profile__details">
                    <div className="profile__label">Rating</div>
                    <Rating value={profile.rating} readOnly />
                    {profile.phone && <>
                        <div className="profile__label">Phone</div>
                        <div><a href={`tel:${profile.phone}`}>{profile.phone}</a></div>
                    </>}
                    {profile.email && <>
                        <div className="profile__label">Email</div>
                        <div><a href={`mailto:${profile.email}`}>{profile.email}</a></div>
                    </>}
                    {profile.needs && <>
                        <div className="profile__label">Needs</div>
                        <div>{profile.needs}</div>
                    </>}
                    {profile.location && <>
                        <div className="profile__label">Location</div>
                        <div>{profile.location}</div>
                    </>}
                    {profile.availability && <>
                        <div className="profile__label">Availability</div>
                        <div>{profile.availability}</div>
                    </>}
                    {profile.skills && <>
                        <div className="profile__label">Skills</div>
                        <div>{profile.skills}</div>
                    </>}
            </section>
        </div>
    );
}

export default UserPage