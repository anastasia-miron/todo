import React from "react";
import { useNavigate } from "react-router";
import apiService from "../services/api.service";
import { toast } from "react-toastify";
import { UserTypeEnum } from "../typings/models";
import { useFormik } from "formik";
import { userTypeSchema } from "../schemas";
import useCurrentUser from "../hooks/useCurrentUser";

const DEFAULT_VALUE = {
    type: UserTypeEnum.NONE,
    needs: '',
    location: '',
    availability: '',
    skills: '',
};

const AVAILABILITY_OPTIONS = ["Full-time", "Evenings", "Weekends", "Flexible", "24/24"];

const UserTypePage: React.FC = () => {
    const navigate = useNavigate();
    const {updateUser} = useCurrentUser();

    const { values, setFieldValue, handleChange, handleSubmit, dirty, isValid } = useFormik({
        initialValues: DEFAULT_VALUE,
        validationSchema: userTypeSchema,
        onSubmit: async (data) => {
            const response = await apiService.post<{token: string}>("/auth/complete", data);
            if (!response.success) {
                toast.error(response.message);
                return;
            }
            updateUser(response.data.token);
            toast.success("User type selected successfully!");
            navigate("/app/profile");
        },
    });

    return (
        <div className="user-type-page">
            <h1>Select User Type</h1>
            <div role="group">
                <button
                    onClick={() => setFieldValue("type", UserTypeEnum.BENEFICIARY)}
                    aria-current={values.type === UserTypeEnum.BENEFICIARY}
                >
                    Beneficiary
                </button>
                <button
                    onClick={() => setFieldValue("type", UserTypeEnum.VOLUNTEER)}
                    aria-current={values.type === UserTypeEnum.VOLUNTEER}
                >
                    Volunteer
                </button>
            </div>
            {values.type !== UserTypeEnum.NONE && (
                <article>
                    {values.type === UserTypeEnum.BENEFICIARY && (
                        <div>
                            <label htmlFor="needs">Needs</label>
                            <input id="needs" name="needs" value={values.needs} onChange={handleChange} />
                            <label htmlFor="location">Location</label>
                            <input id="location" name="location" value={values.location} onChange={handleChange} />
                        </div>
                    )}
                    {values.type === UserTypeEnum.VOLUNTEER && (
                        <div>
                            <label htmlFor="skills">Skills</label>
                            <input id="skills" name="skills" value={values.skills} onChange={handleChange} />
                            <label htmlFor="availability">Availability</label>
                            <select id="availability" name="availability" value={values.availability} onChange={handleChange}>
                                <option value="">Select availability</option>
                                {AVAILABILITY_OPTIONS.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <footer>
                        <button disabled={!dirty || !isValid} onClick={() => handleSubmit()}>Confirm</button>
                    </footer>
                </article>
            )}
        </div>
    );
};

export default UserTypePage;
