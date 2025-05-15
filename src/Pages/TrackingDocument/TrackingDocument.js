import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './TrackingDocument.css'
import API_BASE_URL from '../../config';

const TrackingDocument = () => {
    const { role, trackingcode } = useParams();
    const [trackingData, setTrackingData] = useState(null);
    const [error, setError] = useState(null);

    const [showPopup, setShowPopup] = useState(false);
    const [files, setFiles] = useState([]);

    const [showViewPopup, setShowViewPopup] = useState(false);
    const [notarizedFiles, setNotarizedFiles] = useState([]); 

    const handleFileChange = (event) => {
      const newFiles = Array.from(event.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const handleDragOver = (event) => {
      event.preventDefault();
    };

    const handleDrop = (event) => {
      event.preventDefault();
      const droppedFiles = Array.from(event.dataTransfer.files);
      setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    };

    const handleRemoveFile = (index) => {
      setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        if (files.length === 0 || !trackingcode) {
            console.log('Please select at least one file and enter a tracking number.');
            return;
        }
        const formData = new FormData();
        // Append notarized files
        for (let file of files) {
            formData.append('notarizedFiles', file); // Use 'notarizedFiles' to handle multiple files
        }
        try {
            const response = await axios.post(`${API_BASE_URL}api/safety/${trackingcode}/notarized-file/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // setMessage('Files uploaded successfully!');
            setFiles([]);
            setShowPopup(false);
        } catch (error) {
            // setMessage('Error uploading files: ' + error.message);
            console.log('file error')
        }
        
    };

    const fetchNotarizedFiles = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/safety/${trackingcode}/notarized-files/`);
            const filesWithUrls = response.data.map(file => ({
                ...file,
                url: `${API_BASE_URL}${file.file}` // Construct the full URL
            }));
            setNotarizedFiles(filesWithUrls);
            console.log(notarizedFiles)
        } catch (err) {
            console.error('Error fetching notarized files:', err);
        }
    };

    const handleViewFiles = () => {
        fetchNotarizedFiles();
        setShowViewPopup(true);
    };

    useEffect(() => {
        const fetchTrackingData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/safety/${trackingcode}`);
                setTrackingData(response.data);
                setError(null);
                console.log(response.data)
            } catch (err) {
                setError('Error fetching tracking data.');
                console.error(err);
            }
        };

        fetchTrackingData();
    }, [trackingcode]);

    const handlePrint = () => {
        window.print();
      };


    return (
        <div style={{backgroundColor: 'gray', height: 'auto', position: 'relative'}}>
            {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Upload Files</h2>

            <div
              className="drop-area"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="fileInput"
              />
              <label htmlFor="fileInput" className="file-select">Click or drag files here to upload</label>
            </div>

            <div className="file-list">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  {file.name}
                  <button onClick={() => handleRemoveFile(index)}>X</button>
                </div>
              ))}
            </div>

            <div className="actions">
              <button onClick={() => setShowPopup(false)} style={{backgroundColor: 'red'}}>Cancel</button>
              <button onClick={handleUpload} disabled={files.length === 0}>Upload</button>
            </div>
          </div>
        </div>
      )}
      {/* View Popup */}
      {showViewPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Notarized Files</h2>
                        <div className="file-list">
                            {notarizedFiles.length > 0 ? (
                                notarizedFiles.map((file, index) => (
                                    <div key={index} className="file-item">
                                        <a href={file.url} target="_blank" rel="noopener noreferrer">File URL{index+1}</a>
                                    </div>
                                ))
                            ) : (
                                <p>No notarized files available.</p>
                            )}
                        </div>
                        <div className="actions">
                            <button onClick={() => setShowViewPopup(false)} style={{ backgroundColor: 'red' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        <div className="a4-container"> 
            {trackingData && ( 
                <div className="tracking-content">
                    <div className='tracking-header'>
                    <p className='tracking-header-text'>Republic of the Philippines</p>
                    <p className='tracking-header-text'>Department of Environment and Natural Resources</p>
                    <h4 className='tracking-header-bold'>MINES AND GEOSCIENCES BUREAU</h4>
                    <p className='tracking-header-text'>North Avenue, Diliman, Quezon City</p>
                    </div>
                    <h3 className='application-title'>APPLICATION FOR {trackingData.permit_type.toUpperCase()} SAFETY {trackingData.role.toUpperCase()}</h3>
                    <p className='tracking-date'>Date: {trackingData.date}</p>
                    <div className='tracking-greetings'>
                        <p>The Regional Director</p>
                        <p>Mines and Geosciences Bureau</p>
                        <p>Regional Office No. 10</p>
                        <p>Cagayan de Oro City</p>
                    </div>
                    <p>Sir,</p>
                    <p className="indent-first-line">
                        Pursuant to the provisions of Republic Act No. 7942, the Revised Implementing Rules and
                        Regulations and Department Administrative Order No. 2010-21, I <span className='bold-span'>{trackingData.name}</span> have 
                        the honor to apply for a Permit to act as <span className='bold-span'>{trackingData.permit_type}</span>  safety <span className='bold-span'>{trackingData.role}</span>  under oath, the following: 
                    </p>
                    <div>
                    <div className="single-row">
                        <p>1. Name of Applicant :</p>
                        <p>{trackingData.name}</p>
                    </div>
                    <div className="single-row">
                        <p style={{fontWeight: 'bold'}}>2. Post Office Address: </p>
                        <p>{trackingData.address}</p>   
                    </div>
                    <div className="single-row">
                        <p style={{fontWeight: 'bold'}}>3. Contact No:</p>
                        <p>{trackingData.contactNo}</p>
                    </div>

                    <div className="single-row2">
                        <p style={{fontWeight: 'bold'}}>4. Age: <span style={{fontWeight: 'normal'}}>{trackingData.age}</span></p>
                        <p style={{fontWeight: 'bold'}}>Civil Status: <span style={{fontWeight: 'normal'}}>{trackingData.civilStatus}</span></p>
                    </div>

                    <div className="single-row2">
                        <p style={{fontWeight: 'bold'}}>5. Date of Birth: <span style={{fontWeight: 'normal'}}>{trackingData.dateOfBirth}</span></p>
                        <p style={{fontWeight: 'bold'}}>Place of Birth: <span style={{fontWeight: 'normal'}}>{trackingData.placeOfBirth}</span></p>
                    </div>

                    <div className="single-row2">
                        <p style={{fontWeight: 'bold'}}>6. Citizenship: <span style={{fontWeight: 'normal'}}>{trackingData.citizenship}</span></p>
                        <p style={{fontWeight: 'bold'}}>How Acquired: <span style={{fontWeight: 'normal'}}>{trackingData.howAcquired}</span></p>
                    </div>


                    <div className="single-row4">
                        <p>(by birth, naturalization, etc.)</p>
                    </div>
                    </div>

                    {trackingData.citizenship.toLowerCase() !== 'filipino' && (
                        <div>
                            <p style={{fontWeight: '20px', fontWeight: 'bold',  marginBottom: '10px'}}>7. If Alien:</p>
                            <p style={{marginLeft: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Last residence before coming to the Philippines: <span style={{fontWeight: 'normal', marginLeft: '20px'}}>{trackingData.lastResidence}</span></p>
                            <p style={{marginLeft: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Date of arrival in the Philippines : <span style={{fontWeight: 'normal', marginLeft: '20px'}}>{trackingData.dateOfArrival}</span></p>
                            <p style={{marginLeft: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Landing Certificate No. : <span style={{fontWeight: 'normal', marginLeft: '20px'}}>{trackingData.landingCertificateNo}</span></p>
                            <p style={{marginLeft: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Did you come on contract of employment?: <span style={{fontWeight: 'normal', marginLeft: '20px'}}>{trackingData.employmentContract}</span></p>
                            <p style={{marginLeft: '20px', fontWeight: 'bold', marginBottom: '10px' }}>If so, state nature of employment and: <span style={{fontWeight: 'normal', marginLeft: '20px'}}>{trackingData.employmentNature}</span></p>
                            <p style={{marginLeft: '20px', fontWeight: 'bold' }}>Name of Company: <span style={{fontWeight: 'normal', marginLeft: '20px'}}>{trackingData.companyName}</span></p>
                        </div>
                    )}
                    <div>
                        <p style={{fontWeight: 'bold',marginBottom: '20px', marginTop: '20px'}}>8. Present Employment:</p>
                        <p style={{fontWeight: 'bold',marginLeft: '20px', marginBottom: '20px'}}>Name of Company: <span style={{fontWeight: 'normal'}}>{trackingData.presentCompanyName}</span></p>
                        <p style={{fontWeight: 'bold',marginLeft: '20px'}}>Address of Company: <span style={{fontWeight: 'normal'}}>{trackingData.presentCompanyAddress}</span></p>
                    </div>
                    <div className='tablediv'>
                        <p style={{fontWeight: 'bold', marginBottom: '20px'}}>Educational Attainment</p>
                        <table className="json-table">
                            <thead>
                                <tr>
                                    <th>Name of School</th>
                                    <th>Address/Location</th>
                                    <th>Date of Attendance</th>
                                    <th>Units Earned or Degree Obtained</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trackingData.education.map((edu, index) => (
                                    <tr key={index}>
                                        <td>{edu.school}</td>
                                        <td>{edu.address}</td>
                                        <td>{edu.date}</td>
                                        <td>{edu.degree}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>    
                    <div className='tablediv'>
                        <p style={{fontWeight: 'bold', marginBottom: '-20px'}}>Board Examination Taken</p>
                        <table className="json-table">
                            <thead>
                            <tr>
                                <th>Title of Examination</th>
                                <th>Date Taken</th>
                                <th>Rating</th>
                                <th colSpan="3" style={{textAlign: 'center'}}>
                                    <p style={{margin: '-0px', borderBottom: '1px solid #ddd'}}>Registration - PRC #</p>
                                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', margin: '-10px', marginBottom: '-27px'}}>
                                    <p>Kind</p>
                                    <p style={{fontSize: '20px', marginTop: '2px', fontWeight: 'normal', color: '#ddd'}}>|</p>
                                    <p>No.</p>
                                    <p style={{fontSize: '20px', marginTop: '2px', fontWeight: 'normal', color: '#ddd'}}>|</p>
                                    <p>Date</p>
                                    </div>
                                </th> {/* Merged header for Registration */}
                            </tr>
                            </thead>
                            <tbody>
                                {trackingData.boardExams.map((exam, index) => (
                                    <tr key={index}>
                                        <td>{exam.title}</td>
                                        <td>{exam.dateTaken}</td>
                                        <td>{exam.rating}</td>
                                        <td>{exam.kind}</td>
                                        <td>{exam.registrationNo}</td>
                                        <td>{exam.registrationDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* <p>(Attached herewith is a certified copy of the registration certificate given to me by the Board of Examiners / Civil Service Commission)</p> */}
                        </div>
                    <div className='tablediv'>
                        <p style={{fontWeight: 'bold', marginBottom: '-20px'}}>Work Experience</p>
                        <table className="json-table">
                            <thead>
                                <tr>
                                    <th>Position (from present to recent)</th>
                                    <th colSpan="2">Inclusive Date</th>
                                    <th>Length of Service</th>
                                    <th>Status of Appointment</th>
                                    <th>Company</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trackingData.workExperience.map((work, index) => (
                                    <tr key={index}>
                                        <td>{work.position}</td>
                                        <td>{work.from}</td>
                                        <td>{work.to}</td>
                                        <td>{work.length}</td>
                                        <td>{work.status}</td>
                                        <td>{work.company}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>  
                    <div className='tablediv'>
                        <p style={{fontWeight: 'bold', marginBottom: '-20px'}}>	OSH Related Trainings / Seminars attended:</p>
                        <table className="json-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th colSpan="2">Time / Duration</th>
                                    <th>No. of Hours</th>
                                    <th>Conducted by</th>
                                    <th>Venue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trackingData.trainings.map((work, index) => (
                                    <tr key={index}>
                                        <td>{work.title}</td>
                                        <td>{work.from}</td>
                                        <td>{work.to}</td>
                                        <td>{work.hours}</td>
                                        <td>{work.conductedBy}</td>
                                        <td>{work.venue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div> 
                    <div style={{fontSize: '13px'}}>
                        
                        <p>11.	I obligate myself to present such documents or papers as may be required of me by the authorities 
                            concerned in connection with this application and submit myself to such examination, oral and/or 
                            written, as may be deemed necessary to determine my application.
                        </p>
                        <p>
                        12.	I   bind   myself   to  observe  and   comply  with  all  the  laws,  rules  and  regulations,  orders  and 
	                    instructions  issued  or  to be  issued  by the duly  constituted  authorities  relating to the duties of 
		                a <span className='bold-span'>{trackingData.permit_type}</span>  Safety <span className='bold-span'>{trackingData.role}</span> and  to  the  sanitation  in  the mine,  mill or quarry.
                        </p>
                        <p>
                        13. 	I perfectly understand that the Temporary Permit, if granted, is valid for one (1) year and three (3) 
                        years for Permanent Permit and only while in the employ of the present employer; that said Permit 
                        will be surrendered to the Director of Mines and Geosciences, should I transfer employment.
                        </p>
                        <p>
                        14.	I hereby certify that all the facts and statements made in this connection are all true and correct.
                        </p>

                        <div className="single-row3">
                            <p style={{marginTop: '10px', marginBottom: '20px', fontWeight: 'normal'}}>Very respectfully yours,</p>
                            <p>__________________</p>
                            <p>(signature of applicant)</p>
                        </div>
                        <p>(Below is for Notary Public use)</p>
                        <p style={{textAlign: 'center', fontWeight: 'bold'}}>ACKNOWLEDGEMENT</p>
                        <p>SUBSCRIBED AND SWORN to before me this _________ day of ____________, 20____ affiant 
                        exhibited to me his/her Community Tax Certificate No. ________________ issued on _______________ 
                        at _________________________________________, Philippines.
                        </p>
                        <div className="single-row3">
                            <p style={{marginRight: '0px', marginTop: '30px', fontWeight: 'normal'}}>__________________</p>
                            <p>NOTARY PUBLIC</p>
                        </div>
                        <p>Doc. No.	____________</p>
                        <p>Page No.	____________</p>
                        <p>Book No.	____________</p>
                        <p>Series of	____________</p>
                    </div>
                </div>
            )}
        </div>
        {/* Button Container */}
            <div className='buttoncontainerzz'>
              <button onClick={handleViewFiles}>View Notarize File</button>
              <button onClick={() => setShowPopup(true)}>Upload Notarize File</button>
              <button onClick={handlePrint}>Download / Print</button>
              
            </div>
        </div>
    );
};

export default TrackingDocument;