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

    const { values, handleChange, handleSubmit, dirty, isValid, isSubmitting } = useFormik({
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
                    <label htmlFor="needs">Needs</label>
                    <input
                        id="needs"
                        type="text"
                        name="needs"
                        placeholder="Needs"
                        value={values.needs ?? ''}
                        onChange={handleChange}
                    />

                    <label htmlFor="location">Location</label>
                    <input
                        id="location"
                        type="text"
                        name="location"
                        placeholder="Location"
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
