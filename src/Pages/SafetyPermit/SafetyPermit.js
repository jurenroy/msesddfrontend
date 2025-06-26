import React, { useState, useEffect } from 'react';
import './SafetyPermit.css';
import '../../Assets/hnf.jpg';
import esample from './e-sample.png';
import StampComponent from './StampComponent'; // Import the StampComponent
import QRCode from 'qrcode';
import API_BASE_URL from '../../config';
import { getByTrackingCode } from '../Services/trackingcodeService';
import { StatusbyTrackingCode, fetchChecklistDetails } from "../Services/ChecklistStatusService";

const SafetyPermit = ({ trackingCode }) => {
  // Declare state variables for dynamic permit details
  const [permitDetails, setPermitDetails] = useState(null);
  const [statusDetails, setStatusDetails] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [sample, setSample] = useState('');

  useEffect(() => {
    console.log(trackingCode)
    const fetchPermitDetails = async () => {
      const data = await getByTrackingCode(trackingCode);
      if (!data.error) {
        setPermitDetails(data); // Assuming data contains the permit details
        console.log(data)
      } else {
        console.error(data.message);
      }
    };
    const fetchStatusDetails = async () => {
      const data = await StatusbyTrackingCode(trackingCode);
      if (!data.error) {
        setStatusDetails(data.data[0]); // Assuming data contains the permit details
      } else {
        console.error(data.message);
      }
    };

    const fetchChecklistDetail = async () => {
      const data = await fetchChecklistDetails(trackingCode);
      if (!data.error) {
        if (data) {
        const result = `${API_BASE_URL}${data.data.latest_photo}`
        setSample(result)
        }
        
      } else {
        console.error(data.message);
      }
    };

    if (trackingCode) {
      fetchPermitDetails();
      fetchStatusDetails();
      fetchChecklistDetail();
    }
  }, [trackingCode]);

  useEffect(() => {
    if (permitDetails && statusDetails) {
      const qrValue = `permitType: ${permitDetails.permitType}; role: ${permitDetails.role}; permitNo: ${permitDetails.permitNo}; name: ${permitDetails.name}; applicationDate: ${permitDetails.applicationDate}; company: ${permitDetails.company}; issuedDate: ${permitDetails.issuedDate}; orNo: ${permitDetails.orNo}; date: ${permitDetails.date}`;
      
      // Generate QR code as data URL asynchronously
      async function generateQRCode() {
        try {
          const url = await QRCode.toDataURL(qrValue);
          setQrCodeUrl(url);
        } catch (err) {
          console.error('Failed to generate QR code', err);
        }
      }
      generateQRCode();
    }
  }, [permitDetails]);

  const handlePrint = () => {
    console.log("Print triggered");
    window.print();
  };

  const getDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); // e.g., "June 10, 2025"
  };
  const getTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); // e.g., "06:34:13 AM"
  };

  const getOrdinalSuffix = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    if (v >= 11 && v <= 13) return "th";
    return s[(v % 10)] || "th";
  };
  const getDateText = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date)) return ""; // safety check
    const day = date.getDate();
    const ordinal = getOrdinalSuffix(day);
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${day}${ordinal} day of ${month} ${year}`;
  };

  const duration = permitDetails && permitDetails.permit_type === 'temporary' ? 'one (1) year' : 'three (3) years';

  return (
    <div className="SafetyPermit" role="document" aria-label="Bond paper ready to print">
      
      {permitDetails && statusDetails ? (
        <>
        <StampComponent date={getDate(statusDetails.created_at)} time={getTime(statusDetails.created_at)} className="stamphehe" style={{ visibility: 'visible' }} />
          <h1 style={{ marginTop: '50px' }}>{permitDetails.permit_type.toUpperCase()} SAFETY {permitDetails.role.toUpperCase()} PERMIT</h1>
          <h3>Permit No.: {permitDetails.permit_type == "Permanent" ? 'P':'T'}S{permitDetails.role == "Engineer" ? 'E':'I'}-{statusDetails.control_number}</h3>
          <h2>This is certify that the application of</h2>
          <h1 className='SafetyPermit__title-main'>{permitDetails.name.toUpperCase()}</h1>
          <h3 className='SafetyPermit__text-justified'>to act as {permitDetails.permit_type.toLowerCase()} safety {permitDetails.role.toLowerCase()} per application filed on {getDate(permitDetails.date)} to this office has been duly noted and approved. {permitDetails.sex == 'Male' ? "He" : "She"} is therefore, hereby permitted to practice as such only while the employ of</h3>
          <h2 style={{ fontWeight: 'bolder', fontSize: '30px' }}>{permitDetails.presentCompanyName.toUpperCase()}</h2>
          <h3 className='SafetyPermit__text-justified'>pursuant to the provision of Philippine Mining Act of 1995 and the Revised Implementing Rules and Regulations promulgated thereunder, and DENR Administrative Order No. (DAO) 2000-98, Series of 2000, otherwise known as the Mine Safety and Health Standards, valid within a period of {duration} from issuance hereof.</h3>
          <h3 className='SafetyPermit__text-justified'>Given under the seal of this Bureau at Cagayan de Oro City, Philippines this {getDateText(statusDetails.created_at)}.</h3>
          <div className='bottom'>
            <div>
              <img src={sample} className='img-2x2inch' alt='2x2' />
              <h4>O.R. No: {statusDetails.or_no}</h4>
              <h4>Date: {getDate(statusDetails.created_at)}</h4>
            </div>
            <div style={{ textAlign: 'center' }}>
              <img src={esample} className='rdsignature' alt='rdsign' />
              <h4>Rodante B. Felina</h4>
              <h4>OIC, Regional Director</h4>
              <div className="qr-code" style={{ marginTop: '20px' }}>
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="QR Code" style={{ height: '200px', visibility: 'visible', marginTop: '-20px' }} />
                ) : (
                  <p>Generating QR code...</p>
                )}
              </div>
            </div>
          </div>
          <button className="print-button" onClick={handlePrint}>Print</button>
        </>
      ) : (
        <p>Loading permit details...</p>
      )}
    </div>
  );
};

export default SafetyPermit;
