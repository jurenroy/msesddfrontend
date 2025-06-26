// Checklist.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config';
import mgbxImage from '../../Assets/mgbx.png';

const Checklist = () => {
  const { role, trackingcode } = useParams();
  const [trackingData, setTrackingData] = useState(null);
  const [checklist, setChecklist] = useState(null);
  const [notarizedFiles, setNotarizedFiles] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTrackingData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/safety/${trackingcode}`);
            setTrackingData(response.data);
            setError(null);
            console.log(response.data)
            console.log('naa ko dri')
        } catch (err) {
            setError('Error fetching tracking data.');
            console.error(err);
        }
    };

    fetchTrackingData();
}, [trackingcode]);

useEffect(() => {
    const fetchNotarizedFiles = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/safety/${trackingcode}/notarized-files/`);
            setNotarizedFiles(response.data);
            setError(null);
            console.log(response.data)
        } catch (err) {
            setError('Error fetching Notarized Files.');
            console.error(err);
        }
    };

    fetchNotarizedFiles();
}, [trackingcode]);

useEffect(() => {
    const fetchChecklist = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/checklist/${trackingcode}/`);
            setChecklist(response.data);
            setError(null);
            console.log(response.data)
        } catch (err) {
            setError('Error fetching checklist.');
            console.error(err);
        }
    };

    fetchChecklist();
}, [trackingcode]);

const handleClick = (media) => {
    // Access the link based on the checklist.college_diploma value
    const url = `${API_BASE_URL}${media}`;
    window.open(url, '_blank'); // Open the URL in a new tab
  };

  return (
    <>
      <div className="bg-gray-400 h-auto relative">
        <div className="a4-container">
          {trackingData && (
            <div>
              <div className="flex justify-between items-center w-full">
                <img src={mgbxImage} alt="logo" className="w-24 h-auto -mt-16" />
                <div className="flex-1 flex justify-center">
                  <div className="text-center">
                    <h5 className="-mt-12">CHECKLIST OF REQUIREMENTS</h5>
                    <h5 className="mt-0">SAFETY {role.toUpperCase()}'S PERMIT APPLICATION</h5>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full mt-0 text-sm">
                <div className="flex items-center mb-0">
                  <p className="m-0 flex-none w-48">NAME OF APPLICANT</p>
                  <p className="mr-8">:</p>
                  <p className="m-0 flex-1">{trackingData.name}</p>
                </div>
                <div className="flex items-center mb-0">
                  <p className="m-0 flex-none w-48">Company Name</p>
                  <p className="mr-8">:</p>
                  <p className="m-0 flex-1">{trackingData.companyName}</p>
                </div>
                <div className="flex items-center mb-0">
                  <p className="m-0 flex-none w-48">ADDRESS</p>
                  <p className="mr-8">:</p>
                  <p className="m-0 flex-1">{trackingData.address}</p>
                </div>
                <div className="flex items-center mb-0">
                  <p className="m-0 flex-none w-48">CONTACT NO.</p>
                  <p className="mr-8">:</p>
                  <p className="m-0 flex-1">{trackingData.contactNo}</p>
                </div>
                <div className="flex items-center mb-0">
                  <p className="m-0 flex-none w-48">DATE</p>
                  <p className="mr-8">:</p>
                  <p className="m-0 flex-1">{trackingData.date}</p>
                </div>
              </div>
              {checklist && (
                <div className="mt-8 text-xs">
                  <table className="w-full border-collapse text-center">
                    <thead>
                      <tr>
                        <th className="w-3/5 border border-black p-2">DOCUMENTS REQUIRED</th>
                        <th colSpan="2" className="text-center border border-black p-2">
                          <p className="m-0 border-b border-black">COMPLIANCE</p>
                          <div className="flex flex-row justify-evenly -m-2 -mb-6">
                            <p className="mt-2 mb-5">YES</p>
                            <p className="text-base mt-2 font-normal text-black">|</p>
                            <p className="mt-2 mb-5">NO</p>
                          </div>
                        </th>
                        <th className="w-1/3 border border-black p-2">REMARKS</th>
                      </tr>
                    </thead>
                    <tbody className="text-left">
                      <tr>
                        <td colSpan={4} className="border border-black p-0">
                          <p className="my-0.5 ml-2 font-bold">Mandatory Acceptance Requirements</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1">
                          <div>
                            <p>Duly filled-up Application Form</p>
                          </div>
                        </td>
                        <td className="border border-black p-1">✔</td>
                        <td className="border border-black p-1">✖</td>
                        <td className="border border-black p-1">Form is complete</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1">Certified photocopy of college diploma or high school diploma, or pertinent credentials, as the case may be; ( <span onClick={() => handleClick(checklist.college_diploma)} className="cursor-pointer italic font-bold underline">{checklist.college_diploma ? 'View File' : ''}</span> )Duly Notarized</td>
                        <td className="border border-black p-1">✔</td>
                        <td className="border border-black p-1">✖</td>
                        <td className="border border-black p-1">Valid ID provided</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1">Certificate of employment (present and previous), signed under oath; (Indicate name, position and date of appointment at present position using the official letter head of the company)</td>
                        <td className="border border-black p-1">✖</td>
                        <td className="border border-black p-1">✔</td>
                        <td className="border border-black p-1">Address not verified</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1">Latest photograph, 2 inches X 2 inches</td>
                        <td className="border border-black p-1">✔</td>
                        <td className="border border-black p-1">✖</td>
                        <td className="border border-black p-1">Payment confirmed</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1">Registration/Application Fee:</td>
                        <td className="border border-black p-1">✔</td>
                        <td className="border border-black p-1">✖</td>
                        <td className="border border-black p-1">Payment confirmed</td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="border border-black p-0">
                          <p className="my-0.5 ml-2 font-bold">Other Requirements</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1">Endorsement Letter</td>
                        <td className="border border-black p-1">✔</td>
                        <td className="border border-black p-1">✖</td>
                        <td className="border border-black p-1">Form is complete</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1">Photocopy of certificates Occupational Safety and Health (OSH) trainings/seminars sponsored by Bureau and/or other recognized institution.</td>
                        <td className="border border-black p-1">✔</td>
                        <td className="border border-black p-1">✖</td>
                        <td className="border border-black p-1">Valid ID provided</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1">For renewal application a photocopy of Safety Engineer's Permit last issued</td>
                        <td className="border border-black p-1">✖</td>
                        <td className="border border-black p-1">✔</td>
                        <td className="border border-black p-1">Address not verified</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1">For New and Renewal: Proof/s of accomplishment or participation in OSH (at least one of the following).</td>
                        <td className="border border-black p-1">✔</td>
                        <td className="border border-black p-1">✖</td>
                        <td className="border border-black p-1">Payment confirmed</td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="border border-black p-1 font-bold">
                          INITIAL EVALUATIONz
                        </td>
                        <td colSpan={2} className="border border-black p-1 font-bold">
                          REVIEWED BY:
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="border border-black p-1">
                          
                        </td>
                        <td colSpan={2} className="border border-black p-1">
                          
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Checklist;