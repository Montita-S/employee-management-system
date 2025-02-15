import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';
import '../AddEmployee.css'; 
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/apiConfig';
const AddEmployee = () => {
    const navigate = useNavigate(); 
    const [activeTab, setActiveTab] = useState('basicInfo');
    const [formData, setFormData] = useState({
        Branch: '',
        id_employee: '',
        FirstName: '',
        LastName: '',
        NickName: '',
        ID_card: '',
        Passport: '',
        Data_Birth: '',
        Email: '',
        Phone: [''], 
        BloodGroup: '',
        MaritalStatus: '',
        Number_children: '',
        Position: '',
        Department: [],
        Status: '',
        StartDate: '',
        EndDate: '',
        
        CAddress: '',
        CCity: '',
        CCountry: '',
        CPost: '',
        RAddress: '',
        RCity: '',
        RCountry: '',
        RPost: '',
        StartSalary: '',
        RateSalary: '',
        NetSalary: '',
        Hospital: '',
        Emergency: '',
        
    });
    const handlePhoneChange = (index, value) => {
        const updatedPhones = [...formData.Phone];
        updatedPhones[index] = value;
        setFormData({ ...formData, Phone: updatedPhones });
    };
    
    // Add phone number field
    const addPhoneNumber = () => {
        setFormData(prevState => ({
            ...prevState,
            Phone: [...prevState.Phone, '']
        }));
    };
    
    // Remove phone number field
    const removePhoneNumber = (index) => {
        const updatedPhones = formData.Phone.filter((_, i) => i !== index);
        setFormData({ ...formData, Phone: updatedPhones });
    };
    const [image, setImage] = useState(null);
    const [newDepartment, setNewDepartment] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDepartmentChange = (e) => {
        setNewDepartment(e.target.value);
    };

    const addDepartment = () => {
        if (newDepartment && !formData.Department.includes(newDepartment)) {
            setFormData(prevState => ({
                ...prevState,
                Department: [...prevState.Department, newDepartment]
            }));
            setNewDepartment('');
        }
    };

    const removeDepartment = (departmentToRemove) => {
        setFormData(prevState => ({
            ...prevState,
            Department: prevState.Department.filter(department => department !== departmentToRemove)
        }));
    };


    const handleFileChange = (e) => {
        setImage(e.target.files[0]); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();

        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        if (image) {
            formDataToSend.append('image', image); 
        }

        try {
            const response = await axios.post(`${BASE_URL}/add-employee`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            });
            alert(response.data.message);
            setFormData({
                Branch: '', id_employee: '', FirstName: '', LastName: '', NickName: '', ID_card: '',
                Passport: '', Data_Birth: '', Email: '', Phone: '', BloodGroup: '', MaritalStatus: '',
                Number_children: '', Position: '',  Department: [], Status: '', StartDate: '',
                EndDate: '', CAddress: '', CCity: '', CCountry: '', CPost: '', RAddress: '', RCity: '', 
                RCountry: '', RPost: '', StartSalary: '', RateSalary: '', NetSalary: '', Hospital: '', Emergency: ''
            });
            setImage(null); 
            navigate('/Allem');
        } catch (error) {
            console.error('Error adding employee:', error);
            alert('Failed to add employee');
        }
    };

    return (
        <div className="home-container">
            <Navbar />
 

            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === 'basicInfo' ? 'active' : ''}`}
                    onClick={() => setActiveTab('basicInfo')}
                >
                    <div className="circle">1</div>
                    {activeTab === 'basicInfo' && <span className='mes-tab'>Personal Information</span>}
                </button>

                <div className="line"></div> 

                <button
                    className={`tab-button ${activeTab === 'contactDetails' ? 'active' : ''}`}
                    onClick={() => setActiveTab('contactDetails')}
                >
                    <div className="circle">2</div>
                    {activeTab === 'contactDetails' && <span className='mes-tab'>Employment Details</span>}
                </button>

                <div className="line"></div> 

                <button
                    className={`tab-button ${activeTab === 'personalInfo' ? 'active' : ''}`}
                    onClick={() => setActiveTab('personalInfo')}
                >
                    <div className="circle">3</div>
                    {activeTab === 'personalInfo' && <span className='mes-tab'>Current Address</span>}
                </button>

                <div className="line"></div> 

                <button
                    className={`tab-button ${activeTab === 'workDetails' ? 'active' : ''}`}
                    onClick={() => setActiveTab('workDetails')}
                >
                    <div className="circle">4</div>
                    {activeTab === 'workDetails' && <span className='mes-tab'>Registered Address</span>}
                </button>

                <div className="line"></div>

                <button
                    className={`tab-button ${activeTab === 'employmentPeriod' ? 'active' : ''}`}
                    onClick={() => setActiveTab('employmentPeriod')}
                >
                    <div className="circle">5</div>
                    {activeTab === 'employmentPeriod' && <span className='mes-tab'>Salary</span>}
                </button>

                <div className="line"></div>

                <button
                    className={`tab-button ${activeTab === 'additionalInfo' ? 'active' : ''}`}
                    onClick={() => setActiveTab('additionalInfo')}
                >
                    <div className="circle">6</div>
                    {activeTab === 'additionalInfo' && <span className='mes-tab'>Social Security Scheme</span>}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="tab-frame">
                {activeTab === 'basicInfo' && (
                     <div className="tab-section">
                        <div className='form-title2'>Personal Information</div>
                        <label htmlFor="Branch">Branch</label>
                        <select name="Branch" className='input-2' value={formData.Branch} onChange={handleChange}>
                            <option value="">Select Branch</option>
                            <option value="Chonburi Head Office">Chonburi Head Office</option>
                            <option value="Pathum Thani Branch">Pathum Thani Branch</option>
                        </select>

                        <label htmlFor="image">Upload Employee Image</label>
                        <input type="file" name="image" className='input-2' accept="image/*" onChange={handleFileChange} />
                        {image && (
                            <div>
                                
                                <img src={URL.createObjectURL(image)} alt="Preview" style={{ width: '100px', height: 'auto' }} />
                            </div>
                        )}

                        <label htmlFor="FirstName">First Name</label>
                        <input type="text" name="FirstName" className='input-2' value={formData.FirstName} onChange={handleChange} placeholder="First Name" />
                        
                        <label htmlFor="LastName">Last Name</label>
                        <input type="text" name="LastName" className='input-2' value={formData.LastName} onChange={handleChange} placeholder="Last Name" />
                        
                        <label htmlFor="id_employee">Employee ID</label>
                        <input type="text" name="id_employee" className='input-2' value={formData.id_employee} onChange={handleChange} placeholder="Employee ID" required />
                        
                        <label htmlFor="NickName">Nick Name</label>
                        <input type="text" name="NickName" className='input-2' value={formData.NickName} onChange={handleChange} placeholder="Nick Name" />
                        
                        <label htmlFor="ID_card">ID Card</label>
                        <input type="text" name="ID_card" className='input-2' value={formData.ID_card} onChange={handleChange} placeholder="ID Card" />
                        
                        <label htmlFor="Passport">Passport</label>
                        <input type="text" name="Passport" className='input-2' value={formData.Passport} onChange={handleChange} placeholder="Passport" />
                        
                        <label htmlFor="Email">Email Address</label>
                        <input type="email" name="Email" className='input-2' value={formData.Email} onChange={handleChange} placeholder="Email" />
                        
                        <label>Phone Numbers</label>
                        
                        {formData.Phone.map((phone, index) => (
                            
                            <div key={index} className="phone-row">
                                <div className='tab-inputs'>
                                    <input
                                        type="tel"
                                        name={`Phone-${index}`}
                                        className="input-5"
                                        value={phone}
                                        onChange={(e) => handlePhoneChange(index, e.target.value)}
                                        placeholder={`Phone ${index + 1}`}
                                    />
                                    {index > 0 && (
                                       <button type="button" className="remove-phone-btn" onClick={() => removePhoneNumber(index)} style={{ background: 'none', border: 'none' }}>
                                       <img 
                                           src="/images/remove.png" 
                                           alt="Remove" 
                                           style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                                       />
                                        </button>
                                   
                                    )}
                                </div>
                            </div>
                        ))}
                        <button type="button" className="add-phone-btn" onClick={addPhoneNumber}>
                            Add Another Phone Number
                        </button>

                        
                        <label htmlFor="Date_Birth">Date of Birth</label>
                        <input type="date" name="Data_Birth" className='input-4' value={formData.Data_Birth} onChange={handleChange} />
                        
                        <label htmlFor="BloodGroup">Blood Group</label>
                        <input type="text" name="BloodGroup" className='input-2' value={formData.BloodGroup} onChange={handleChange} placeholder="Blood Group" />
                        
                        <label htmlFor="MaritalStatus">Marital Status</label>
                        <input type="text" name="MaritalStatus" className='input-2' value={formData.MaritalStatus} onChange={handleChange} placeholder="Marital Status" />
                        
                        <label htmlFor="Number_children">Number of Children</label>
                        <input type="text" name="Number_children" className='input-2' value={formData.Number_children} onChange={handleChange} placeholder="Number of Children" />
                        
                    </div>
                 
                )}
                {activeTab === 'contactDetails' && (
                    <div className="tab-section">
                        <div className='form-title2'>Employment Details</div>
                        <label htmlFor="Position">Position</label>
                        <input type="text" name="Position" className='input-2' value={formData.Position} onChange={handleChange} placeholder="Position" />

                        <label htmlFor="Department">Department</label>
                        <div className='tab-inputs'>
                            <input
                                type="text"
                                className='input-3'
                                value={newDepartment}
                                onChange={handleDepartmentChange}
                                placeholder="Add Department"
                            />
                            
                            <button type="button" onClick={addDepartment} className="remove-department-button">
                                <img src="/images/add.png" alt="Remove" className="remove-icon" />
                            </button>
                        </div>

                            <div className='tab-inputs'>
                                {formData.Department.map((department, index) => (
                                    <div key={index}  className='tab-inputs'>
                                        <div className="department-item">
                                            <div  className='tab-inputs'>
                                                <div className='mess-tab'>{department}</div>
                                                <button type="button" onClick={() => removeDepartment(department)} className="remove-department-button">
                                                    <img src="/images/remove.png" alt="Remove" className="remove-icon" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        
                        <label htmlFor="StartDate">Start Date</label>
                        <input type="date" name="StartDate" className='input-4' value={formData.StartDate} onChange={handleChange} />

                        <label htmlFor="EndDate">End Date</label>
                        <input type="date" name="EndDate" className='input-4' value={formData.EndDate} onChange={handleChange} />
                    </div>
                )}
                {activeTab === 'personalInfo' && (
                    <div className="tab-section">
                        <div className='form-title2'>Current Address</div> 
                        <label htmlFor="CAddress">Address </label>
                        <input type="text" name="CAddress" className='input-2' value={formData.CAddress} onChange={handleChange} placeholder="Address" />

                        <label htmlFor="CCity">City State</label>
                        <input type="text" name="CCity" className='input-2' value={formData.CCity} onChange={handleChange} placeholder="City State" />

                        <label htmlFor="CCountry">Country </label>
                        <input type="text" name="CCountry" className='input-2' value={formData.CCountry} onChange={handleChange} placeholder="Country"/>

                        <label htmlFor="CPost">Post Code</label>
                        <input type="text" name="CPost" className='input-2' value={formData.CPost} onChange={handleChange} placeholder="Post Code"/>
                    </div>
                )}
                {activeTab === 'workDetails' && (
                    <div className="tab-section">
                        <div className='form-title2'>Registered Address</div>
                        <label htmlFor="RAddress">Address </label>
                        <input type="text" name="RAddress" className='input-2' value={formData.RAddress} onChange={handleChange} placeholder="Address" />

                        <label htmlFor="RCity">City State</label>
                        <input type="text" name="RCity" className='input-2' value={formData.RCity} onChange={handleChange} placeholder="City State" />

                        <label htmlFor="RCountry">Country </label>
                        <input type="text" name="RCountry" className='input-2' value={formData.RCountry} onChange={handleChange} placeholder="Country"/>

                        <label htmlFor="RPost">Post Code</label>
                        <input type="text" name="RPost" className='input-2' value={formData.RPost} onChange={handleChange} placeholder="Post Code"/>
                        
                    </div>
                )}
                {activeTab === 'employmentPeriod' && (
                    <div className="tab-section">
                        <div className='form-title2'>Salary</div>
                        <label htmlFor="StartSalary">Start Salary</label>
                        <input type="text" name="StartSalary" className='input-2' value={formData.StartSalary} onChange={handleChange} placeholder="Start Salary" />

                        <label htmlFor="RateSalary">Rate Salary </label>
                        <input type="text" name="RateSalary" className='input-2' value={formData.RateSalary} onChange={handleChange} placeholder="Rate Salary"/>

                        <label htmlFor="NetSalary">Net Salary </label>
                        <input type="text" name="NetSalary" className='input-2' value={formData.NetSalary} onChange={handleChange} placeholder="Net Salary"/>
                    </div>
                )}
                {activeTab === 'additionalInfo' && (
                    <div className="tab-section">
                        <div className='form-title2'>Social Security Scheme</div>
                        <label htmlFor="Hospital">Hospital Under Entitlement  </label>
                        <input type="text" name="Hospital" className='input-2' value={formData.Hospital} onChange={handleChange} placeholder="Hospital Under Entitlement "/>

                        <label htmlFor="Emergency">Emergency Phone</label>
                        <input type="text" name="Emergency" className='input-2' value={formData.Emergency} onChange={handleChange} placeholder="Emergency Phone"/>
                        <button type="submit" className="submit-button">SAVE</button>
                    </div>
                    
                )}

                
            </form>
        </div>
    );
};

export default AddEmployee;