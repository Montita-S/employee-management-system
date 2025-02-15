import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; 
import { BASE_URL } from './config/apiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
    const [id_employee, setid_employee] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [department, setDepartment] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({ id_employee: '', password: '', role: '', department: '' });
    const [showPassword, setShowPassword] = useState(false); 

    const navigate = useNavigate();
    useEffect(() => {
        const isVerified = sessionStorage.getItem('isVerified');
        if (!isVerified) {
            navigate('/'); 
        }
    }, [navigate]);

    const validateForm = () => {
        let valid = true;
        const newErrors = { id_employee: '', password: '', role: '', department: '' };
    
        if (!id_employee.trim()) {
            newErrors.id_employee = 'Employee ID is required.';
            valid = false;
        }
        if (!password.trim()) {
            newErrors.password = 'Password is required.';
            valid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
            valid = false;
        }
        if (!role) {
            newErrors.role = 'Role is required.';
            valid = false;
        }

        if (!role) {
            newErrors.role = 'Role is required.';
            valid = false;
        }
    
        setErrors(newErrors);
        return valid;
    };
    

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await axios.post(`${BASE_URL}/register`, { id_employee, password, role, department });
            setMessage(response.data.message);
            navigate('/');
        } catch (error) {
            setMessage(error.response?.data?.error || 'Registration failed. Please try again.');
            console.error(error);
        }
    };

    return (
        <div className="container2">
            <img src="/images/interface-logo.png" alt="Logo Home" className="logo-image" />
            <div className='text-interface'>INTERFACE SOLUTIONS CO.,LTD.</div>
            <div className='text-interface2'>REGISTER</div>
            {message && (
                <div className="alert-warning" role="alert" style={{ backgroundColor: '#800F2F', border: '1px solid #ffeeba', color: '#FFF0F3', padding: '0.75rem 1.25rem', marginBottom: '1rem', borderRadius: '0.25rem' }}>
                    {message}
                </div>
            )}
            <form onSubmit={handleRegister}>
                <div>
                    <div className='regis-inputs'>
                        <img src="/images/logo1.png" alt="Logo Home" style={{width:'40px',height:'40px',marginBottom:'10px'}} />
                        <input
                            type="text"
                            placeholder="Employee ID"
                            value={id_employee}
                            onChange={(e) => setid_employee(e.target.value)}
                            className='input-re2'
                            aria-invalid={!!errors.id_employee}
                            aria-describedby="id_employee-error"
                        />
                    </div>
                    {errors.id_employee && <p className="error" id="id_employee-error">{errors.id_employee}</p>}
                </div>

                <div className="password-input-container">
                    <div className='regis-inputs'>
                        <img src="/images/remove-pass.png" alt="Logo Home" style={{width:'35px',height:'35px',marginLeft:'5px',marginBottom:'10px'}} />
                        <input
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='input-re'
                            aria-invalid={!!errors.password}
                            aria-describedby="password-error"
                        />

                        <span
                            className="eye-icon"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ cursor: 'pointer' }}
                        >
                            <FontAwesomeIcon 
                                icon={showPassword ? faEyeSlash : faEye} 
                                style={{ color: 'gray' }} 
                            />
                        </span>
                    </div>
                    {errors.password && <p className="error" id="password-error">{errors.password}</p>}
                </div>

                <div>
                    <div className='regis-inputs'>
                        <img src="/images/roles.png" alt="Logo Home"  style={{width:'40px',height:'40px',marginBottom:'10px'}}/>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className='input-re3'
                            aria-invalid={!!errors.role}
                            aria-describedby="role-error"
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="chairman">Chairman</option>
                            <option value="manager_director">Manager Director</option>
                            <option value="director">Director</option>
                            <option value="general_manager">General Manager</option>
                            <option value="dept_manager">Dept. Manager</option>
                            <option value="sec_manager">Sec. Manager</option>
                            <option value="asst_manager">Asst. Sec Manager</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="employee">Employee</option>
                            <option value="human_resource">Human Resource</option>
                            <option value="act_manager">Acting Manager</option>
                        </select>
                    </div>
                    {errors.role && <p className="error" id="role-error">{errors.role}</p>}
                </div>

                <div>
                    <div className='regis-inputs'>
                        <img src="/images/dept.png" alt="Logo Home" style={{width:'40px',height:'40px',marginBottom:'15px'}}/>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className='input-re3'
                            aria-invalid={!!errors.department}
                            aria-describedby="department-error"
                        >
                            <option value="">Select Department</option>
                            <option value="Design">Design</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Sales">Sales</option>
                            <option value="Account">Account</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Nawanakorn">Nawanakorn</option>
                            <option value="Purchase">Purchase</option>
                            <option value="HR/GA">HR/GA</option>
                            <option value="ISO">ISO</option>
                        </select>
                    </div>
                    {errors.department && <p className="error" id="department-error">{errors.department}</p>}
                </div>

                <button type="submit" className='button-re'>REGISTER</button>
            </form>

            <div className="login-button" onClick={() => navigate('/')}>
                Go to Login
            </div>
            <div className="address">
                693/5-6 Moo1,Nongkham Subdistrict, Sriracha District, Chonburi 20230
            </div>
            <div className="address"> 
                TEL. (66) 03834 0242-5, 033-002-476
            </div>
        </div>
    );
};

export default Register;
