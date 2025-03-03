import React from "react";
import { ProfileModel } from "../typings/models";
import { useFormik } from "formik";
import { volunteerPageSchema } from "../schemas";

interface Props {
    value: ProfileModel;
    open: boolean;
    onClose: () => unknown;
    onSubmit: (data: ProfileModel) => Promise<unknown>;
}
const AVAILABILITY_OPTIONS = ["Full-time", "Evenings", "Weekends", "Flexible", "24/24"];
const EditVolunteerProfile: React.FC<Props> = (props) => {
    const { value, onClose, onSubmit, open } = props;

    const { values, handleChange, handleSubmit, dirty, isValid, isSubmitting, errors } = useFormik({
        initialValues: value,
        validationSchema: volunteerPageSchema,
        onSubmit,
    });

    if (!open) return null;

    return (
        <dialog open>
            <article>
                <form onSubmit={handleSubmit}>

                    <label htmlFor="profileImg">Profile Image URL</label>
                    <input
                        id="profileImg"
                        type="url"
                        name="profileImg"
                        placeholder="http://imgur.com/"
                        aria-invalid={errors.profileImg ? "true" : "false"}
                        aria-describedby="error-profile-img"
                        value={values.profileImg ?? ''}
                        onChange={handleChange}
                    />
                    {errors.profileImg && <small id="error-profile-img">{errors.profileImg}</small>}
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Username"
                        aria-invalid={errors.username ? "true" : "false"}
                        aria-describedby="error-username"   
                        value={values.username ?? ''}
                        onChange={handleChange}
                    />
                     {errors.username && <small id="error-username">{errors.username}</small>}

                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="text"
                        name="email"
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby="error-email"
                        placeholder="email@example.com"
                        value={values.email ?? ''}
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
                        value={values.phone ?? ''}
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
                        value={values.skills ?? ''}
                        onChange={handleChange}
                    />
                     {errors.skills && <small id="error-skills">{errors.skills}</small>}

                    <label htmlFor="availability">Availability</label>
                    <select
                        id="availability"
                        name="availability"
                        aria-invalid={errors.availability ? "true" : "false"}
                        aria-describedby="error-availability"
                        value={values.availability ?? ''}
                        onChange={handleChange}
                    >
                        {errors.availability && <small id="error-availability">{errors.availability}</small>}
                        <option value="">Select availability</option>
                        {AVAILABILITY_OPTIONS.map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <footer className="grid">
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
        </dialog>
    );
};

export default EditVolunteerProfile;
