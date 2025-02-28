import React from "react";
import { ProfileModel } from "../typings/models";
import { useFormik } from "formik";
import { beneficiaryPageSchema } from "../schemas";

interface Props {
    value: ProfileModel;
    open: boolean;
    onClose: () => unknown;
    onSubmit: (data: ProfileModel) => Promise<unknown>;
}

const EditBeneficiaryProfile: React.FC<Props> = (props) => {
    const { value, onClose, onSubmit, open } = props;

    const { values, handleChange, handleSubmit, dirty, isValid, isSubmitting, errors } = useFormik({
        initialValues: value,
        validationSchema: beneficiaryPageSchema,
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
                        aria-invalid={errors.phone ? "true" : "false"}
                        value={values.phone ?? ''}
                        onChange={handleChange}
                    />
                    <label htmlFor="needs">Needs</label>
                    <input
                        id="needs"
                        type="text"
                        name="needs"
                        placeholder="Needs"
                        aria-invalid={errors.needs ? "true" : "false"}
                        value={values.needs ?? ''}
                        onChange={handleChange}
                    />

                    <label htmlFor="location">Location</label>
                    <input
                        id="location"
                        type="text"
                        name="location"
                        placeholder="Location"
                        aria-invalid={errors.location ? "true" : "false"}
                        value={values.location ?? ''}
                        onChange={handleChange}
                    />

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

export default EditBeneficiaryProfile;
