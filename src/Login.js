import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useUser } from './UserContext'; 
import { BASE_URL } from './config/apiConfig';

const Login = () => {
    const { setUser } = useUser();
    const [id_employee, setid_employee] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({ id_employee: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        let valid = true;
        const newErrors = { id_employee: '', password: '' };

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
        setErrors(newErrors);
        return valid;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await axios.post(`${BASE_URL}/login`, { id_employee, password });
            setMessage(response.data.message);
            const userRole = response.data.role;
            const userDepartment = response.data.department; 

            setUser({ id_employee: response.data.id_employee, role: userRole, department: userDepartment });

            if (userRole === 'admin') {
                navigate('/home');
            } else {
                navigate('/home');
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Sign in failed. Please check your credentials.');
            }
            console.error(error);
        }
    };

    return (
        <div className="container">
            <img src="/images/interface-logo.png" alt="Logo Home" className="logo-image" />
            <div className='text-interface'>INTERFACE SOLUTIONS CO.,LTD.</div>
            {message !== "" && (
                <div className="alert-warning" role="alert">
                    {message}
                </div>
            )}
            <form onSubmit={handleLogin}>
                <div>
                    <div className='login-inputs'>
                        <img src="/images/logo1.png" alt="Logo Home" style={{width:'40px',height:'40px',marginBottom:'10px'}} />
                        <input
                            type="text"
                            placeholder="Employee ID"
                            value={id_employee}
                            onChange={(e) => setid_employee(e.target.value)}
                            className='input-log2'
                        />
                     </div>
                    {errors.id_employee && <p className="error">{errors.id_employee}</p>}
                </div>

                <div className="password-input-container">
                    <div className='login-inputs'>
                        <img src="/images/remove-pass.png" alt="Logo Home"style={{width:'35px',height:'35px',marginLeft:'5px',marginBottom:'10px'}} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='input-log'
                        />
                        

                        <span
                            className="eye-icon2"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ cursor: 'pointer' }}
                        >
                            <FontAwesomeIcon 
                                icon={showPassword ? faEyeSlash : faEye} 
                                style={{ color: 'gray' }} 
                            />
                        </span>
                    </div>
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>

                <button type="submit" className='button-log'>SIGN IN</button>
            </form>
            
            <div className="register-button" onClick={() => navigate('/verifyCode')}>
                Go to Register
            </div>
            <div className="address">
                693/5-6 Moo1, Nongkham Subdistrict, Sriracha District, Chonburi 20230
            </div>
            <div className="address"> 
                TEL. (66) 03834 0242-5, 033-002-476
            </div>
        </div>
    );
};

export default Login;
