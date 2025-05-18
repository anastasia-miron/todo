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

                    <label htmlFor="profileImg">Imagine Profil URL</label>
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
                    <label htmlFor="username">Nume utilizator</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Nume utilizator"
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
                    <label htmlFor="phone">Număr telefon</label>
                    <input
                        id="phone"
                        type="text"
                        name="phone"
                        placeholder="0XXXXXXXX"
                        aria-invalid={errors.phone ? "true" : "false"}
                        aria-describedby="error-phone"
                        value={values.phone ?? ''}
                        onChange={handleChange}
                    />
                    {errors.phone && <small id="error-phone">{errors.phone}</small>}
                    <label htmlFor="needs">Necesități</label>
                    <input
                        id="needs"
                        type="text"
                        name="needs"
                        placeholder="Necesități"
                        aria-invalid={errors.needs ? "true" : "false"}
                        aria-describedby="error-needs"
                        value={values.needs ?? ''}
                        onChange={handleChange}
                    />
                    {errors.needs && <small id="error-needs">{errors.needs}</small>}

                    <label htmlFor="location">Locație</label>
                    <input
                        id="location"
                        type="text"
                        name="location"
                        placeholder="Locație"
                        aria-invalid={errors.location ? "true" : "false"}
                        aria-describedby="error-location"
                        value={values.location ?? ''}
                        onChange={handleChange}
                    />
                    {errors.location && <small id="error-location">{errors.location}</small>}

                    <footer className="grid">
                        <button
                            aria-busy={isSubmitting}
                            disabled={!dirty || !isValid}
                            type="submit"
                        >
                            Salvează
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="outline contrast"
                        >
                            Închide
                        </button>
                    </footer>
                </form>
            </article>
        </dialog>
    );
};

export default EditBeneficiaryProfile;
