import React, { useLayoutEffect, useState } from "react";
import Avatar from "../components/Avatar";
import useCurrentUser from "../hooks/useCurrentUser";
import "./ProfilePage.css"
import apiService from "../services/api.service";
import { ProfileModel, UserTypeEnum } from "../typings/models";
import EditVolunteerProfile from "../components/EditVolunteerProfile";
import EditBeneficiaryProfile from "../components/EditBeneficiaryProfile";
import useAbortSignal from "../hooks/useAbortSignal";
import { toast } from "react-toastify";

const Profile: React.FC = () => {
    const {user, updateUser} = useCurrentUser();
    const [profile, setProfile] = useState<ProfileModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const signal = useAbortSignal();

    useLayoutEffect(() => {
        const ctrl = new AbortController();
        (async () => {
            setIsLoading(true);
            const response = await apiService.get<ProfileModel>(`/profile`, { signal: ctrl.signal });
            if (ctrl.signal.aborted) return;
            if (response.success) {
                setProfile(response.data);
            }
            setIsLoading(false);
        })()
        return () => ctrl.abort();
    }, []);

    const handleSave = async (data: ProfileModel) => {
        const response = await apiService.put<string>('/profile', data, { signal });
        if (signal.aborted) return;
        if (!response.success) {
            return toast.error(response.message);
        }
        setProfile(data);
        updateUser(response.data); 
        setOpenModal(false);
    };

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
                    <Avatar user={user!} className="profile__avatar" />
                    <div className="profile__info">
                        <div className="profile__label">Name</div>
                        <div>{profile.username}</div>
                        <div className="profile__label">Type</div>
                        <div>{profile.type}</div>
                    </div>
                </div>
            </header>
            <section className="profile__details">
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
            <footer>
                <button onClick={() => setOpenModal(true)}>Edit</button>
            </footer>
            {profile.type === UserTypeEnum.VOLUNTEER && (
                <EditVolunteerProfile open={openModal} onClose={() => setOpenModal(false)} onSubmit={handleSave} value={profile} />
            )}
            {profile.type === UserTypeEnum.BENEFICIARY && (
                <EditBeneficiaryProfile open={openModal} onClose={() => setOpenModal(false)} onSubmit={handleSave} value={profile} />
            )}
        </div>
    );
}

export default Profile