import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { BASE_URL } from '../config/apiConfig';
import '../AddEmployee.css'; 
const EditEmployee = () => {
    const { id } = useParams(); 
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
        Phone: '',
        BloodGroup: '',
        MaritalStatus: '',
        Number_children: '',
        Position: '',
        Department: '',
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
        image_path: '',
    });

    const [image, setImage] = useState(null); 

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await fetch(`${BASE_URL}/get-employee/${id}`);
                if (!response.ok) throw new Error('Failed to fetch employee data');
                const data = await response.json();

                setFormData({
                    ...data,
                    Data_Birth: data.Data_Birth ? data.Data_Birth.slice(0, 10) : '',
                    StartDate: data.StartDate ? data.StartDate.slice(0, 10) : '',
                    EndDate: data.EndDate ? data.EndDate.slice(0, 10) : '',
                });
            } catch (error) {
                console.error('Error fetching employee:', error);
            }
        };
        fetchEmployee();
    }, [id]);

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataObj = new FormData();
        for (const key in formData) {
            if (key !== 'EndDate' || formData[key]) {
                formDataObj.append(key, formData[key]);
            }
        }
        if (image) formDataObj.append('image', image);

        try {
            const response = await fetch(`${BASE_URL}/employee/${id}`, {
                method: 'PUT',
                body: formDataObj,
            });

            if (response.ok) {
                alert('Employee updated successfully');
                navigate(`/employee/${id}`);
            } else {
                alert('Failed to update employee');
            }
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };


    return (
        <div>
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
                        
                        <label htmlFor="Phone">Phone</label>
                        <input type="tel" name="Phone" className='input-2' value={formData.Phone} onChange={handleChange} placeholder="Phone" />
                        
                        <label htmlFor="Date_Birth">Date of Birth</label>
                        <input type="date" name="Data_Birth" className='input-2' value={formData.Data_Birth} onChange={handleChange} />
                        
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
                        <input type="text" name="Department" className='input-2' value={formData.Department} onChange={handleChange} placeholder="Department" />


                        <label htmlFor="StartDate">Start Date</label>
                        <input type="date" name="StartDate" className='input-2' value={formData.StartDate} onChange={handleChange} />

                        <label htmlFor="EndDate">End Date</label>
                        <input type="date" name="EndDate" className='input-2' value={formData.EndDate} onChange={handleChange} />
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

export default EditEmployee;
