
import React, { useState } from 'react';
import axios from 'axios';
import Tracking from './Tracking';
import './CabBooking.css'; 
const BackEnd_URI='http://localhost:8000';
const CabBooking = () => {
  const [userEmail, setUserEmail] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [availableCabs, setAvailableCabs] = useState([]);
  const [travelTime, setTravelTime] = useState('');
  const [timeToReachEachNode, setTimeToReachEachNode] = useState('');
  const [bookedCab, setBookedCab] = useState(null);
  const [path, setPath] = useState('');

  const handleFindCabs = async () => {
    try {
      const response = await axios.post(`${BackEnd_URI}/api/available-cabs`, { userEmail, source, destination });
      setAvailableCabs(response.data.availableCabs);
      setTravelTime(response.data.travelTime);
      setTimeToReachEachNode(response.data.path);
    } catch (error) {
      console.error('Error fetching available cabs:', error);
    }
  };

  const handleBookCab = async (cabId) => {
    try {
      const response = await axios.post(`${BackEnd_URI}/api/book-cab/${cabId}`, {
        userEmail,
        source,
        destination,
        travelTime,
        timeToReachEachNode,
      });
      console.log('Cab booked:', response.data);
      const bookedCab = response.data.booking;
      setBookedCab(bookedCab);
      setPath(response.data.path);
    } catch (error) {
      console.error('Error booking cab:', error);
    }
  };

  const handleNewBooking = () => {
    setBookedCab(null);
    setPath(''); 
  };

  return (
    <div className="cab-booking-container">
      <h2>Cab Booking</h2>
      <div className="booking-form">
        <label>Email:</label>
        <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
        <label>Source:</label>
        <input type="text" value={source} onChange={(e) => setSource(e.target.value)} />
        <label>Destination:</label>
        <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
        <button className="find-btn" onClick={handleFindCabs}>Find Cabs</button>
      </div>
      {availableCabs.length > 0 && (
        <div className="cab-list">
          <h3>Available Cabs</h3>
          {availableCabs.map(cab => (
            <div className="cab-item" key={cab._id}>
              <p>{cab.name} - ${cab.pricePerMinute} per minute</p>
              <button className="book-btn" onClick={() => { handleBookCab(cab._id); handleNewBooking(); }}>Book Now</button>
            </div>
          ))}
        </div>
      )}
      {bookedCab && (
        <div className="booking-details">
          <h3>Cab Booked</h3>
          <p>User Email: {bookedCab.userEmail}</p>
          <p>Source: {bookedCab.source}</p>
          <p>Destination: {bookedCab.destination}</p>
          <p>Travel Time: {bookedCab.travelTime} minutes</p>
          <p>Cost: Rs{bookedCab.cost}</p>
          <p><h3>Live Tracking:</h3></p>
          <Tracking path={path} />
        </div>
      )}
    </div>
  );
};

export default CabBooking;
