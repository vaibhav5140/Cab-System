
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cab.css';

const CabManagement = () => {
  const [cabs, setCabs] = useState([]);
  const [newCabName, setNewCabName] = useState('');
  const [newCabPrice, setNewCabPrice] = useState('');
  const [editingCabId, setEditingCabId] = useState('');
  const [editingCabName, setEditingCabName] = useState('');
  const [editingCabPrice, setEditingCabPrice] = useState('');
  const BackEnd_URI='http://localhost:8000';
  useEffect(() => {
    fetchCabs();
  }, []);

  const fetchCabs = async () => {
    try {
      const response = await axios.get(`${BackEnd_URI}/api/cabs`);
      setCabs(response.data);
    } catch (error) {
      console.error('Error fetching cabs:', error);
    }
  };

  const handleAddCab = async () => {
    try {
      const response = await axios.post(`${BackEnd_URI}/api/cabs`, {
        name: newCabName,
        pricePerMinute: newCabPrice
      });
      setCabs([...cabs, response.data]);
      setNewCabName('');
      setNewCabPrice('');
    } catch (error) {
      console.error('Error adding cab:', error);
    }
  };

  const handleEditClick = (id, name, pricePerMinute) => {
    console.log("Editing cab:", id, name, pricePerMinute);
    setEditingCabId(id);
    setEditingCabName(name);
    setEditingCabPrice(pricePerMinute);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${BackEnd_URI}/api/cabs/${editingCabId}`, {
        name: editingCabName,
        pricePerMinute: editingCabPrice
      });
      fetchCabs();
      setEditingCabId('');
      setEditingCabName('');
      setEditingCabPrice('');
    } catch (error) {
      console.error('Error editing cab:', error);
    }
  };

  const handleDeleteCab = async (id) => {
    try {
      await axios.delete(`${BackEnd_URI}/api/cabs/${id}`);
      setCabs(cabs.filter(cab => cab._id !== id));
    } catch (error) {
      console.error('Error deleting cab:', error);
    }
  };

  return (
    <div className="cab-management-container">
      <h2>Cab Management</h2>
      <div className="add-cab">
        <input type="text" placeholder="Name" value={newCabName} onChange={(e) => setNewCabName(e.target.value)} />
        <input type="number" placeholder="Price Per Minute" value={newCabPrice} onChange={(e) => setNewCabPrice(e.target.value)} />
        <button className="add-btn" onClick={handleAddCab}>Add Cab</button>
      </div>
      <h3>All Registered Cabs</h3>
      <div className="cab-grid">
        {cabs.map(cab => (
          <div className="cab-item" key={cab._id}>
            <p>{cab.name}</p>
            <p>${cab.pricePerMinute} per minute</p>
            <div className="btn-group">
  {editingCabId === cab._id ? (
    <>
      <input type="text" placeholder="Name" value={editingCabName} onChange={(e) => setEditingCabName(e.target.value)} />
      <input type="number" placeholder="Price Per Minute" value={editingCabPrice} onChange={(e) => setEditingCabPrice(e.target.value)} />
      <button className="save-btn" onClick={handleSaveEdit}>Save</button>
    </>
  ) : (
    <>
      <button className="edit-btn" onClick={() => handleEditClick(cab._id, cab.name, cab.pricePerMinute)}>Edit</button>
      <button className="delete-btn" onClick={() => handleDeleteCab(cab._id)}>Delete</button>
    </>
  )}
</div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default CabManagement;
