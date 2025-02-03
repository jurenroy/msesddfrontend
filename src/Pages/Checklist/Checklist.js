// Checklist.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config';
import mgbxImage from '../../Assets/mgbx.png';

const Checklist = () => {
  const { role, trackingcode } = useParams();
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState(null);
  
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

  return (
    <div style={{backgroundColor: 'gray', height: 'auto', position: 'relative'}}>

        <div className="a4-container">
            {trackingData && (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <img src={mgbxImage} alt="logo" style={{ width: '100px', height: 'auto', marginTop: '-70px' }} />
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <div style={{textAlign: 'center'}}>
                            <h5 style={{marginTop: '-50px'}}>CHECKLIST OF REQUIREMENTS</h5>
                            <h5 style={{marginTop: '-20px'}}>SAFETY {role}'S PERMIT APPLICATION</h5>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: '-30px', fontSize: '15px'}}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '-25px' }}>
                        <p style={{ margin: 0, flex: '0 0 200px' }}>NAME OF APPLICANT</p>
                        <p style={{ marginRight: '30px' }}>:</p>
                        <p style={{ margin: 0, flex: 1 }}>{trackingData.name}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '-25px' }}>
                        <p style={{ margin: 0, flex: '0 0 200px' }}>ADDRESS</p>
                        <p style={{ marginRight: '30px' }}>:</p>
                        <p style={{ margin: 0, flex: 1 }}>{trackingData.address}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '-25px' }}>
                        <p style={{ margin: 0, flex: '0 0 200px' }}>CONTACT NO.</p>
                        <p style={{ marginRight: '30px' }}>:</p>
                        <p style={{ margin: 0, flex: 1 }}>{trackingData.contactNo}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '-25px' }}>
                        <p style={{ margin: 0, flex: '0 0 200px' }}>DATE</p>
                        <p style={{ marginRight: '30px' }}>:</p>
                        <p style={{ margin: 0, flex: 1 }}>{trackingData.date}</p>
                    </div>
                </div>
                <div style={{ marginTop: '30px', fontSize: '12px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '55%', border: '1px solid black', padding: '8px' }}>DOCUMENTS REQUIRED</th>
                                <th colSpan="2" style={{ textAlign: 'center', border: '1px solid black', padding: '8px' }}>
                                    <p style={{ margin: '0', borderBottom: '1px solid black' }}>COMPLIANCE</p>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', margin: '-10px', marginBottom: '-27px' }}>
                                        <p style={{ marginTop:'10px', marginBottom: '20px' }}>YES</p>
                                        <p style={{ fontSize: '15px', marginTop: '10px', fontWeight: 'normal', color: 'black' }}>|</p>
                                        <p style={{ marginTop:'10px', marginBottom: '20px' }}>NO</p>
                                    </div>
                                </th>
                                <th style={{ width: '30%', border: '1px solid black', padding: '8px' }}>REMARKS</th>
                            </tr>
                        </thead>
                        <tbody style={{textAlign: 'justify'}}>
                            <tr>
                                <td colSpan={4} style={{ border: '1px solid black', padding: '0px' }}>
                                    <p style={{marginTop: '2px', marginBottom: '2px', marginLeft: '10px', fontWeight: ' bold'}}>Mandatory Acceptance Requirements</p>
                                </td>
                            </tr>
                    
                            <tr>
                                <td style={{ border: '1px solid black', padding: '5px' }}>Duly filled-up Application Form	</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>✔</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>✖</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>Form is complete</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid black', padding: '5px' }}>Certified photocopy of college diploma or high school diploma, or pertinent credentials, as the case may be;</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>✔</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>✖</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>Valid ID provided</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid black', padding: '5px' }}>Certificate of employment (present and previous), signed under oath; (Indicate name, position and date of appointment at present position using the official letter head of the company)</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>✖</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>✔</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>Address not verified</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid black', padding: '5px' }}>Latest  photograph, 2 inches X 2 inches</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>✔</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>✖</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>Payment confirmed</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid black', padding: '5px' }}>Registration/Application Fee:</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>✔</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>✖</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>Payment confirmed</td>
                            </tr>
                           
                            <tr>
                                <td colSpan={4} style={{ border: '1px solid black', padding: '0px' }}>
                                    <p style={{marginTop: '2px', marginBottom: '2px', marginLeft: '10px', fontWeight: ' bold'}}>Other Requirements </p>
                                </td>
                            </tr>

                            <tr>
                                <td style={{ border: '1px solid black', padding: '5px' }}>Endorsement Letter</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>✔</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>✖</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>Form is complete</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid black', padding: '5px' }}>Photocopy of certificates Occupational Safety and Health (OSH) trainings/seminars sponsored by Bureau and/or other recognized institution.</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>✔</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>✖</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>Valid ID provided</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid black', padding: '5px' }}>For renewal application a photocopy of Safety Engineer's Permit last issued</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>✖</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>✔</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>Address not verified</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid black', padding: '5px' }}>For New and Renewal: Proof/s of accomplishment or participation in OSH (at least one of the following).</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>✔</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>✖</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>Payment confirmed</td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{ border: '1px solid black', padding: '5px', fontWeight: 'bold' }}>
                                INITIAL EVALUATION
                                </td>
                                <td colSpan={2} style={{ border: '1px solid black', padding: '5px', fontWeight: 'bold'}}>
                                REVIEWED BY:
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{ border: '1px solid black', padding: '5px' }}>
                                    asfdsaf
                                </td>
                                <td colSpan={2} style={{ border: '1px solid black', padding: '5px' }}>
                                    asfdsaf
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>)}
        </div>
    </div>  
  );    
};

export default Checklist;