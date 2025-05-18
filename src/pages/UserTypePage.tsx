import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import apiService from "../services/api.service";
import { toast } from "react-toastify";
import { UserTypeEnum } from "../typings/models";
import { useFormik } from "formik";
import { getUserTypeSchema } from "../schemas";
import useCurrentUser from "../hooks/useCurrentUser";

const DEFAULT_VALUE = {
    type: UserTypeEnum.NONE,
    needs: '',
    location: '',
    availability: '',
    skills: '',
};

const AVAILABILITY_OPTIONS = ["Normă întreagă", "Seara", "Weekenduri", "Program flexibil", "Disponibil 24/24"];


const UserTypePage: React.FC = () => {
    const navigate = useNavigate();
    const {updateUser} = useCurrentUser();

    const { values, setFieldValue, handleChange, handleSubmit, dirty, isValid, errors, ...formik } = useFormik({
  initialValues: DEFAULT_VALUE,
  enableReinitialize: true,
  validationSchema: getUserTypeSchema(DEFAULT_VALUE.type),
  onSubmit: async (data) => {
    const response = await apiService.post<{token: string}>("/auth/complete", data);
    if (!response.success) {
      toast.error(response.message);
      return;
    }
    updateUser(response.data.token);
    toast.success("Tipul utilizatorului a fost selectat cu succes!");
    navigate("/app/profile");
  },
});

useEffect(() => {
  formik.setFormikState(prev => ({
    ...prev,
    validationSchema: getUserTypeSchema(values.type),
  }));
}, [values.type]);

    return (
        <div className="user-type-page">
            <h1>Selectează tipul de utilizator</h1>
            <div role="group">
                <button
                    onClick={() => setFieldValue("type", UserTypeEnum.BENEFICIARY)}
                    aria-current={values.type === UserTypeEnum.BENEFICIARY}
                >
                    Beneficiar
                </button>
                <button
                    onClick={() => setFieldValue("type", UserTypeEnum.VOLUNTEER)}
                    aria-current={values.type === UserTypeEnum.VOLUNTEER}
                >
                    Voluntar
                </button>
            </div>
            {values.type !== UserTypeEnum.NONE && (
                <article>
                    {values.type === UserTypeEnum.BENEFICIARY && (
                        <div>
                            <label htmlFor="needs">Necesități</label>
                            <input 
                                id="needs" 
                                name="needs" 
                                aria-invalid={errors.needs ? "true" : "false"}
                                aria-describedby="error-needs"
                                value={values.needs} 
                                onChange={handleChange}
                             />
                            {errors.needs && <small id="error-needs">{errors.needs}</small>}
                            <label htmlFor="location">Locație</label>
                            <input 
                                id="location" 
                                name="location" 
                                aria-invalid={errors.location ? "true" : "false"}
                                aria-describedby="error-location"
                                value={values.location} 
                                onChange={handleChange} 
                            />
                            {errors.location && <small id="error-location">{errors.location}</small>}
                        </div>
                    )}
                    {values.type === UserTypeEnum.VOLUNTEER && (
                        <div>
                            <label htmlFor="skills">Aptitudini</label>
                            <input 
                            id="skills" 
                            name="skills" 
                            aria-invalid={errors.skills ? "true" : "false"}
                            aria-describedby="error-skills"
                            value={values.skills} 
                            onChange={handleChange} 
                            />
                            {errors.skills && <small id="error-skills">{errors.skills}</small>}
                            <label htmlFor="availability">Disponibilitate</label>
                            <select 
                            id="availability" 
                            name="availability" 
                            required 
                            aria-invalid={errors.availability ? "true" : "false"}
                            aria-describedby="error-availability"
                            value={values.availability} 
                            onChange={handleChange}>
                                <option value="">Selectează disponibilitatea</option>
                                {AVAILABILITY_OPTIONS.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            {errors.availability && <small id="error-availability">{errors.availability}</small>}
                        </div>
                    )}
                    <footer>
                        <button disabled={!dirty || !isValid} onClick={() => handleSubmit()}>Confirmă</button>
                    </footer>
                </article>
            )}
        </div>
    );
};

export default UserTypePage;
