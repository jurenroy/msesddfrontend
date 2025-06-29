import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ApplicationForm.css'; // Import the CSS file
import API_BASE_URL from '../../config';


const ApplicationForm = () => {
    const { role } = useParams(); // Get the role from the URL parameters
    const navigate = useNavigate(); // Initialize the navigate function
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contactNo: '',
        email: '',
        age: '',
        sex: 'Male',
        civilStatus: '',
        dateOfBirth: '',
        placeOfBirth: '',
        citizenship: '',
        howAcquired: '',
        lastResidence: '',
        dateOfArrival: '',
        landingCertificateNo: '',
        employmentContract: '',
        employmentNature: '',
        companyName: '',
        presentCompanyName: '',
        presentCompanyAddress: '',
        education: [{ school: '', address: '', date: '', degree: '' }],
        boardExams: [{ title: '', dateTaken: '', rating: '', regNo: '', regDate: '', valid: '' }],
        workExperience: [{ position: '', from: '', to: '', length: '', status: '', company: '' }],
        trainings: [{ title: '', from: '', to: '', hours: '', conductedBy: '', venue: '' }],
        documents: false,
        compliance: false,
        understanding: false,
        certify: false,
        permitType: 'Permanent', // Default value
        role: role,
        date: new Date().toLocaleDateString(), // Default date
        
    });
    
    

    const [educationFiles, setEducationFiles] = useState([]);
    const [boardExamFiles, setBoardExamFiles] = useState([]);
    const [workExperienceFiles, setWorkExperienceFiles] = useState([]);
    const [trainingFiles, setTrainingFiles] = useState([]);


    // Create refs for file inputs
    const educationFileInputRef = useRef(null);
    const boardExamFileInputRef = useRef(null);
    const workExperienceFileInputRef = useRef(null);
    const trainingFileInputRef = useRef(null);

    const handleFileChange = (setter) => (event) => {
        const files = event.target.files;
        const maxSize = 10 * 1024 * 1024; // 10MB per file
        const allowedTypes = [
            'application/pdf', 
            'image/jpeg', 
            'image/png',
            'image/jpg',
            'application/msword',                                                  // .doc
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        ];
    
        for (let file of files) {
            if (file.size > maxSize) {
                alert(`File ${file.name} is too large. Maximum size is 10MB`);
                event.target.value = ''; 
                return;
            }
            if (!allowedTypes.includes(file.type)) {
                alert(`File ${file.name} type is not allowed. Please upload PDF, images, or document files.`);
                event.target.value = ''; 
                return;
            }
        }
        setter(files);
    };

    const [isAlien, setIsAlien] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Check if citizenship is not Filipino
        if (name === 'citizenship' && value.toLowerCase() !== 'filipino') {
            setIsAlien(true);
        } else if (name === 'citizenship') {
            setIsAlien(false);
        }
    };

    const handleEducationChange = (index, e) => {
        const newEducation = [...formData.education];
        newEducation[index][e.target.name] = e.target.value;
        setFormData({ ...formData, education: newEducation });
    };

    const addEducationRow = () => {
        setFormData({
            ...formData,
            education: [...formData.education, { school: '', address: '', date: '', degree: '' }],
        });
    };

    const handleBoardExamChange = (index, e) => {
        const newBoardExams = [...formData.boardExams];
        newBoardExams[index][e.target.name] = e.target.value;
        setFormData({ ...formData, boardExams: newBoardExams });
    };

    const addBoardExamRow = () => {
        setFormData({
            ...formData,
            boardExams: [...formData.boardExams, { title: '', dateTaken: '', rating: '', regNo: '', regDate: '', valid: '' }],
        });
    };

    const handleWorkExperienceChange = (index, e) => {
        const newWorkExperience = [...formData.workExperience];
        newWorkExperience[index][e.target.name] = e.target.value;
        setFormData({ ...formData, workExperience: newWorkExperience });
    };

    const addWorkExperienceRow = () => {
        setFormData({
            ...formData,
            workExperience: [...formData.workExperience, { position: '', from: '', to: '', length: '', status: '', company: ''}],
        });
    };

    const handleTrainingChange = (index, e) => {
        const newTrainings = [...formData.trainings];
        newTrainings[index][e.target.name] = e.target.value;
        
        // If the from or to date changes, calculate hours automatically
        if (e.target.name === 'from' || e.target.name === 'to') {
            const from = e.target.name === 'from' ? e.target.value : newTrainings[index].from;
            const to = e.target.name === 'to' ? e.target.value : newTrainings[index].to;
            
            // Calculate hours if both dates are available
            if (from && to) {
                const fromDate = new Date(from);
                const toDate = new Date(to);
                
                // Calculate difference in milliseconds
                const diffInMs = toDate - fromDate;
                
                // Convert to hours (including partial days)
                // Each day is counted as 8 hours
                const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                const hours = Math.max(0, Math.round(diffInDays * 8));
                
                newTrainings[index].hours = hours.toString();
            }
        }
        
        setFormData({ ...formData, trainings: newTrainings });
    };

    const addTrainingRow = () => {
        setFormData({
            ...formData,
            trainings: [...formData.trainings, { title: '', from: '', to: '', hours: '', conductedBy: '', venue: ''}],
        });
    };

    

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const formDataToSubmit = new FormData();
        
        // Append form fields
        for (const key in formData) {
            if (Array.isArray(formData[key])) {
                formDataToSubmit.append(key, JSON.stringify(formData[key]));
            } else {
                formDataToSubmit.append(key, formData[key]);
            }
        }
            navigate('/submission-success');


        // Append education files
        for (let file of educationFiles) {
            formDataToSubmit.append('educationFiles', file);
        }
        
        // Append board exam files
        for (let file of boardExamFiles) {
            formDataToSubmit.append('boardExamFiles', file);
        }
        
        // Append work experience files
        for (let file of workExperienceFiles) {
            formDataToSubmit.append('workExperienceFiles', file);
        }
        
        // Append training files
        for (let file of trainingFiles) {
            formDataToSubmit.append('trainingFiles', file);
        }

        // Log the FormData object
        console.log('FormData:', formDataToSubmit);
        for (let [key, value] of formDataToSubmit.entries()) {
            console.log(key, value);
        }

        try {
            const response = await axios.post(`${API_BASE_URL}api/add_safety/`, formDataToSubmit, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Success:', response.data);
            // Navigate to the tracking document page
            const trackingCode = response.data.tracking_code; // Get the tracking code from the response
            navigate(`/safety/${role}/existing/${trackingCode}`); // Navigate to the new route
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <div className="application-form-container">
            <h1>Application for Safety {role.charAt(0).toUpperCase() + role.slice(1)}</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <input type="text" value={new Date().toLocaleDateString()} readOnly />
                    <label htmlFor="date">Date</label>
                </div>
                
                <div className="input-container" style={{marginBottom: '10px'}}>
                    <p className='damn' style={{marginLeft: '10px', marginTop: '-20px'}}>Permit Type</p>
                    <select name="permitType" onChange={handleChange} >
                        <option value="Permanent">Permanent</option>
                        <option value="Temporary">Temporary</option>
                    </select>
                </div>
                <div className="input-container">
                    <input type=" text" name="name" placeholder=" " value={formData.name} onChange={handleChange} />
                    <label htmlFor="name">Name of Applicant:</label>
                </div>
                <div className="input-container">
                    <input type="text" name="address" placeholder=" " value={formData.address} onChange={handleChange} />
                    <label htmlFor="address">Post Office Address:</label>
                </div>
                <div className="input-container">
                    <input type="text" name="email" placeholder=" " value={formData.email} onChange={handleChange} />
                    <label htmlFor="email">Email Address:</label>
                </div>
                <div className="input-container">
                    <input type="text" name="contactNo" placeholder=" " value={formData.contactNo} onChange={handleChange} />
                    <label htmlFor="contactNo">Contact No:</label>
                </div>
                <div className="input-container">
                    <input type="number" name="age" placeholder=" " value={formData.age} onChange={handleChange} />
                    <label htmlFor="age">Age:</label>
                </div>
                <div className="input-container" style={{ marginBottom: '10px' }}>
                  <p className="damn" style={{ marginLeft: '10px', marginTop: '-20px' }}>Sex</p>
                  <select name="sex" onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="input-container">
                    <input type="text" name="civilStatus" placeholder=" " value={formData.civilStatus} onChange={handleChange} />
                    <label htmlFor="civilStatus">Civil Status:</label>
                </div>
                <div className="input-container">
                    <input type="date" name="dateOfBirth" placeholder=" " value={formData.dateOfBirth} onChange={handleChange} />
                    <label htmlFor="dateOfBirth">Date of Birth:</label>
                </div>
                <div className="input-container">
                    <input type="text" name="placeOfBirth" placeholder=" " value={formData.placeOfBirth} onChange={handleChange} />
                    <label htmlFor="placeOfBirth">Place of Birth:</label>
                </div>
                <div className="input-container">
                    <input type="text" name="citizenship" placeholder=" " value={formData.citizenship} onChange={handleChange} />
                    <label htmlFor="citizenship">Citizenship:</label>
                </div>
                <div className="input-container">
                    <input type="text" name="howAcquired" placeholder=" " value={formData.howAcquired} onChange={handleChange} />
                    <label htmlFor="howAcquired">How acquired: (by birth, naturalization, etc)</label>
                </div>
                {isAlien && (
                    <>
                        <h3>if Alien:</h3>
                        <div className="input-container">
                            <input type="text" name="lastResidence" placeholder=" " value={formData.lastResidence} onChange={handleChange} />
                            <label htmlFor="lastResidence">Last residence before coming to the Philippines:</label>
                        </div>
                        <div className="input-container">
                            <input type="date" name="dateOfArrival" placeholder=" " value={formData.dateOfArrival} onChange={handleChange} />
                            <label htmlFor="dateOfArrival">Date of arrival in the Philippines:</label>
                        </div>
                        <div className="input-container">
                            <input type="text" name="landingCertificateNo" placeholder=" " value={formData.landingCertificateNo} onChange={handleChange} />
                            <label htmlFor="landingCertificateNo">Landing Certificate No:</label>
                        </div>
                        <div className="input-container">
                            <input type="text" name="employmentContract" placeholder=" " value={formData.employmentContract} onChange={handleChange} />
                            <label htmlFor="employmentContract">Did you come on contract of employment?</label>
                        </div>
                        <div className="input-container">
                            <input type="text" name="employmentNature" placeholder=" " value={formData.employmentNature} onChange={handleChange} />
                            <label htmlFor="employmentNature">Nature of employment:</label>
                        </div>
                        <div className="input-container">
                            <input type="text" name="companyName" placeholder=" " value={formData.companyName} onChange={handleChange} />
                            <label htmlFor="companyName">Name of Company:</label>
                        </div>
                    </>
                )}
                <h3>Present Company:</h3>
                <div className="input-container">
                    <input type="text" name="presentCompanyName" placeholder=" " value={formData.presentCompanyName} onChange={handleChange} />
                    <label htmlFor="presentCompanyName">Name of Present Company:</label>
                </div>
                <div className="input-container">
                    <input type="text" name="presentCompanyAddress" placeholder=" " value={formData.presentCompanyAddress} onChange={handleChange} />
                    <label htmlFor="presentCompanyAddress">Present Company Address:</label>
                </div>
                <div>
                    <h3>Educational Attainment:</h3>
                    {formData.education.map((edu, index) => (
                        <div key={index}>
                            <div className="input-container">
                                <input type="text" name="school" placeholder=" " value={edu.school} onChange={(e) => handleEducationChange(index, e)} />
                                <label htmlFor={`school-${index}`}>Name of School</label>
                            </div>
                            <div className="input-container">
                                <input type="text" name="address" placeholder=" " value={edu.address} onChange={(e) => handleEducationChange(index, e)} />
                                <label htmlFor={`address-${index}`}>Address/Location</label>
                            </div>
                            <div className="input-container">
                                <input type="text" name="date" placeholder=" " value={edu.date} onChange={(e) => handleEducationChange(index, e)} />
                                <label htmlFor={`date-${index}`}>Date of Attendance</label>
                            </div>
                            <div className="input-container">
                                <input type="text" name="degree" placeholder=" " value={edu.degree} onChange={(e) => handleEducationChange(index, e)} />
                                <label htmlFor={`degree-${index}`}>Units Earned or Degree Obtained</label>
                            </div>
                        </div>
                    ))}
                    <div className="button-container">
                    <button type="button" onClick={addEducationRow}>Add Education</button>
                    </div>
                </div>
                <div className="input-container">
                    <input 
                        type="file" 
                        multiple 
                        onChange={handleFileChange(setEducationFiles)} 
                        style={{ display: 'none' }} 
                        ref={educationFileInputRef} 
                    />
                    <div className="button-container">
                    <button type="button" onClick={() => educationFileInputRef.current.click()}>
                        Attach Education Document
                    </button>
                    </div>
                    {educationFiles.length > 0 && (
                        <div>
                            <h4>Selected Education Files:</h4>
                            <ul>
                                {Array.from(educationFiles).map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div>
                    <h3>Board Examination Taken:</h3>
                    {formData.boardExams.map((exam, index) => (
                        <div key={index}>
                            <div className="input-container">
                                <input type="text" name="title" placeholder=" " value={exam.title} onChange={(e) => handleBoardExamChange(index, e)} />
                                <label htmlFor={`title-${index}`}>Title of Examination</label>
                            </div>
                            <div className="input-container">
                                <input type="date" name="dateTaken" placeholder=" " value={exam.dateTaken} onChange={(e) => handleBoardExamChange(index, e)} />
                                <label htmlFor={`dateTaken-${index}`}>Date Taken</label>
                            </div>
                            <div className="input-container">
                                <input type="text" name="rating" placeholder=" " value={exam.rating} onChange={(e) => handleBoardExamChange(index, e)} />
                                <label htmlFor={`rating-${index}`}>Rating</label>
                            </div>
                            <div className="input-container">
                                <input type="text" name="regNo" placeholder=" " value={exam.regNo} onChange={(e) => handleBoardExamChange(index, e)} />
                                <label htmlFor={`regNo-${index}`}>Registration No.- PRC #</label>
                            </div>
                            <div className="input-container">
                                <input type="date" name="regDate" placeholder=" " value={exam.regDate} onChange={(e) => handleBoardExamChange(index, e)} />
                                <label htmlFor={`regDate-${index}`}>Registration Date</label>
                            </div>
                            <div className="input-container">
                                <input type="date" name="valid" placeholder=" " value={exam.valid} onChange={(e) => handleBoardExamChange(index, e)} />
                                <label htmlFor={`valid-${index}`}>Validity Date</label>
                            </div>
                        </div>
                    ))}
                    <div className="button-container">
                    <button type="button" onClick={addBoardExamRow}>Add Board Exam</button>
                    </div>
                </div>
                <div className="input-container">
                    <input 
                        type="file" 
                        multiple 
                        onChange={handleFileChange(setBoardExamFiles)} 
                        style={{ display: 'none' }} 
                        ref={boardExamFileInputRef} 
                    />
                    <div className="button-container">
                    <button type="button" onClick={() => boardExamFileInputRef.current.click()}>
                        Attach Board Exam Document
                    </button></div>
                    {boardExamFiles.length > 0 && (
                        <div>
                            <h4>Selected Board Exam Files:</h4>
                            <ul>
                                {Array.from(boardExamFiles).map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div>
                    <h3>Work Experience:</h3>
                    {formData.workExperience.map((work, index) => (
                        <div key={index}>
                            <div className="input-container">
                                <input type="text" name="position" placeholder=" " value={work.position} onChange={(e) => handleWorkExperienceChange(index, e)} />
                                <label htmlFor={`position-${index}`}>Position</label>
                            </div>
                            <div className="input-container">
                                <input type="date" name="from" placeholder=" " value={work.from} onChange={(e) => handleWorkExperienceChange(index, e)} />
                                <label htmlFor={`from-${index}`}>From</label>
                            </div>
                            <div className="input-container">
                                <input type="date" name="to" placeholder=" " value={work.to} onChange={(e) => handleWorkExperienceChange(index, e)} />
                                <label htmlFor={`to-${index}`}>To</label>
                            </div>
                            <div className="input-container">
                                <input type="text" name="length" placeholder=" " value={work.length} onChange={(e) => handleWorkExperienceChange(index, e)} />
                                <label htmlFor={`length-${index}`}>Length of Service</label>
                            </div>
                            <div className="input-container">
                            <p className="damn" style={{ marginLeft: '10px', marginTop: '-20px' }}>Status of Appointment</p>
                              <select
                                id={`status-${index}`}
                                name="status"
                                value={work.status}
                                onChange={(e) => handleWorkExperienceChange(index, e)}
                              >
                                <option value="" disabled>
                                  Select status
                                </option>
                                <option value="Permanent">Permanent</option>
                                <option value="Temporary">Temporary</option>
                                <option value="Probationary">Probationary</option>
                                <option value="Contractual">Contractual</option>
                              </select>
                            </div>
                            <div className="input-container">
                                <input type="text" name="company" placeholder=" " value={work.company} onChange={(e) => handleWorkExperienceChange(index, e)} />
                                <label htmlFor={`company-${index}`}>Company Name</label>
                            </div>
                        </div>
                    ))}
                    <div className="button-container">
                    <button type="button" onClick={addWorkExperienceRow}>Add Work Experience</button>
                    </div>
                </div>
                <div className="input-container">
                    <input 
                        type="file" 
                        multiple 
                        onChange={handleFileChange(setWorkExperienceFiles)} 
                        style={{ display: 'none' }} 
                        ref={workExperienceFileInputRef} 
                    />
                    <div className="button-container">
                    <button type="button" onClick={() => workExperienceFileInputRef.current.click()}>
                        Attach Work Experience Document
                    </button></div>
                    {workExperienceFiles.length > 0 && (
                        <div>
                            <h4>Selected Work Experience Files:</h4>
                            <ul>
                                {Array.from(workExperienceFiles).map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div>
                    <h3>OSH Related Trainings / Seminars attended:</h3>
                    {formData.trainings.map((training, index) => (
                        <div key={index}>
                            <div className="input-container">
                                <input type="text" name="title" placeholder=" " value={training.title} onChange={(e) => handleTrainingChange(index, e)} />
                                <label htmlFor={`training-title-${index}`}>Title</label>
                            </div>
                            <div className="input-container">
                                <input type="date" name="from" placeholder=" " value={training.from} onChange={(e) => handleTrainingChange(index, e)} />
                                <label htmlFor={`from-${index}`}>From</label>
                            </div>
                            <div className="input-container">
                                <input type="date" name="to" placeholder=" " value={training.to} onChange={(e) => handleTrainingChange(index, e)} />
                                <label htmlFor={`to-${index}`}>To</label>
                            </div>
                            <div className="input-container">
                                <input type="number " name="hours" placeholder=" " value={training.hours} onChange={(e) => handleTrainingChange(index, e)} readOnly />
                                <label htmlFor={`hours-${index}`}>No. of Hours</label>
                            </div>
                            <div className="input-container">
                                <input type="text" name="conductedBy" placeholder=" " value={training.conductedBy} onChange={(e) => handleTrainingChange(index, e)} />
                                <label htmlFor={`conductedBy-${index}`}>Conducted By</label>
                            </div>
                            <div className="input-container">
                                <input type="text" name="venue" placeholder=" " value={training.venue} onChange={(e) => handleTrainingChange(index, e)} />
                                <label htmlFor={`venue-${index}`}>Venue</label>
                            </div>
                        </div>
                    ))}
                    <div className="button-container">
                    <button type="button" onClick={addTrainingRow}>Add Training</button></div>
                </div>
                <div className="input-container">
                    <input 
                        type="file" 
                        multiple 
                        onChange={handleFileChange(setTrainingFiles)} 
                        style={{ display: 'none' }} 
                        ref={trainingFileInputRef} 
                    />
                    <div className="button-container">
                    <button type="button" onClick={() => trainingFileInputRef.current.click()}>
                        Attach Training Document
                    </button></div>
                    {trainingFiles.length > 0 && (
                        <div>
                            <h4>Selected Training Files:</h4>
                            <ul>
                                {Array.from(trainingFiles).map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="checkbox-container">
                    <div>
                        <p>
                            <input
                                className='checkboxv2'
                                type="checkbox"
                                checked={formData.documents}
                                onChange={() => setFormData({ ...formData, documents: !formData.documents })}
                            />
                            I obligate myself to present such documents or papers as may be required of me by the authorities 
                            concerned in connection with this application and submit myself to such examination, oral and/or 
                            written, as may be deemed necessary to determine my application.
                        </p>
                    </div>
                    <div>
                        <p>
                            <input
                                className='checkboxv2'
                                type="checkbox"
                                checked={formData.compliance}
                                onChange={() => setFormData({ ...formData, compliance: !formData.compliance })}
                            />
                            I   bind   myself   to  observe  and   comply  with  all  the  laws,  rules  and  regulations,  orders  and 
	                        instructions  issued  or  to be  issued  by the duly  constituted  authorities  relating to the duties of a
                            {formData.permitType} Safety {role.charAt(0).toUpperCase() + role.slice(1)} and  to  the  sanitation  in  the mine,  mill or quarry.
                        </p>
                    </div>
                    <div>
                        <p>
                            <input
                                className='checkboxv2'
                                type="checkbox"
                                checked={formData.understanding}
                                onChange={() => setFormData({ ...formData, understanding: !formData.understanding })}
                            />
                            I perfectly understand that the Temporary Permit, if granted, is valid for one (1) year and three (3) 
                            years for Permanent Permit and only while in the employ of the present employer; that said Permit 
                            will be surrendered to the Director of Mines and Geosciences, should I transfer employment.
                        </p>
                    </div>
                    <div>
                        <p>
                            <input
                                className='checkboxv2'
                                type="checkbox"
                                checked={formData.certify}
                                onChange={() => setFormData({ ...formData, certify: !formData.certify })}
                            />
                            I hereby certify that all the facts and statements made in this connection are all true and correct.
                        </p>
                    </div>
                </div>
                <div className="button-container">
                <button type="submit" >Submit</button></div>
            </form>
        </div>
    );
};

export default ApplicationForm;