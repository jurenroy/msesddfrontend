import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getByTrackingCode } from "../Services/trackingcodeService";
import "./TrackingCodeExam.css";
  
const TrackingCodeExam = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setTrackingCode(e.target.value);};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    if (!trackingCode) {
      setError("Tracking code is required.");
      setLoading(false);
      return;
    }
    try {
      const data = await getByTrackingCode(trackingCode);
      if (!data || !data.id) {
        setError("Invalid tracking code. Please try again.");
        setLoading(false);
        return;
      }
      navigate("/safety/:role/existing/exams", { state: { examData: data } });
    } catch (err) {
      setError(
        err.message || "An error occurred while validating the tracking code"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tracking-code-container">
      <h1>Access Exam</h1>
      <form onSubmit={handleSubmit} className="tracking-code-form">
        <div>
          <label className="tracking-code-label">Tracking Code:</label>
          <input
            type="text"
            value={trackingCode}
            onChange={handleInputChange}
            placeholder="Enter your tracking code"
            className="tracking-code-input"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="tracking-code-button"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default TrackingCodeExam;
