import React from 'react';
import CabManagement from './Cab';
import CabBooking from './CabBooking';
const App = () => {
  return (
    <div>
      <h1>Cab Management System</h1>
      <CabManagement />
      <CabBooking/>
    </div>
  );
};

export default App;
