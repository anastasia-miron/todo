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

    const { values, handleChange, handleSubmit, dirty, isValid, isSubmitting } = useFormik({
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
                        value={values.profileImg ?? ''}
                        onChange={handleChange}
                    />

                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={values.username ?? ''}
                        onChange={handleChange}
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="text"
                        name="email"
                        placeholder="email@example.com"
                        value={values.email ?? ''}
                        onChange={handleChange}
                    />
                    <label htmlFor="phone">Phone</label>
                    <input
                        id="phone"
                        type="text"
                        name="phone"
                        placeholder="070000000"
                        value={values.phone ?? ''}
                        onChange={handleChange}
                    />
                    <label htmlFor="skills">Skills</label>
                    <input
                        id="skills"
                        type="text"
                        name="skills"
                        placeholder="Skills"
                        value={values.skills ?? ''}
                        onChange={handleChange}
                    />

                    <label htmlFor="availability">Availability</label>
                    <select
                        id="availability"
                        name="availability"
                        value={values.availability ?? ''}
                        onChange={handleChange}
                    >
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
