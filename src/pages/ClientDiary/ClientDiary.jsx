import React, { useState, useEffect } from 'react';
import './ClientDiary.css';

const ClientDiary = () => {
  // Available niches
  const allNiches = [
    'Finance', 'Healthcare', 'Technology', 'Education', 
    'Retail', 'Manufacturing', 'Hospitality', 'Real Estate'
  ];

  // Sample client data with niches
  const initialClients = [
    {
      id: 1,
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '(212) 555-1234',
      contactPerson: 'John Smith',
      dateAdded: '2023-05-15',
      status: 'Active',
      niches: ['Finance', 'Technology']
    },
    {
      id: 2,
      name: 'Globex Industries',
      email: 'info@globex.com',
      phone: '(310) 555-9876',
      contactPerson: 'Sarah Johnson',
      dateAdded: '2023-06-22',
      status: 'Active',
      niches: ['Healthcare', 'Manufacturing']
    },
    {
      id: 3,
      name: 'Initech Solutions',
      email: 'support@initech.com',
      phone: '(415) 555-3456',
      contactPerson: 'Michael Scott',
      dateAdded: '2023-07-10',
      status: 'Archived',
      niches: ['Technology', 'Retail']
    }
  ];

  const [clients, setClients] = useState(initialClients);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNicheModal, setShowNicheModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    contactPerson: '',
    status: 'Active',
    niches: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [nicheFilter, setNicheFilter] = useState([]);

  // Handle client selection
  const handleClientSelect = (client) => {
    setSelectedClient(client);
  };

  // Handle adding a new client
  const handleAddClient = () => {
    const clientToAdd = {
      ...newClient,
      id: clients.length + 1,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setClients([...clients, clientToAdd]);
    setShowAddModal(false);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      contactPerson: '',
      status: 'Active',
      niches: []
    });
  };

  // Toggle niche selection for a client
  const toggleClientNiche = (niche) => {
    if (selectedClient) {
      const updatedNiches = selectedClient.niches.includes(niche)
        ? selectedClient.niches.filter(n => n !== niche)
        : [...selectedClient.niches, niche];
      
      const updatedClients = clients.map(client =>
        client.id === selectedClient.id 
          ? { ...client, niches: updatedNiches } 
          : client
      );
      
      setClients(updatedClients);
      setSelectedClient({ ...selectedClient, niches: updatedNiches });
    }
  };

  // Toggle niche filter
  const toggleNicheFilter = (niche) => {
    setNicheFilter(prev =>
      prev.includes(niche)
        ? prev.filter(n => n !== niche)
        : [...prev, niche]
    );
  };

  // Filter clients by search term and niche filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesNiche = 
      nicheFilter.length === 0 || 
      nicheFilter.some(niche => client.niches.includes(niche));
    
    return matchesSearch && matchesNiche;
  });

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="client-diary-container">
      <header className="app-header">
        <h1>Client Diary</h1>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <button 
            className="add-client-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Add Client
          </button>
        </div>
      </header>

      <div className="content-wrapper">
        <div className="client-list">
          <div className="list-header">
            <h2>Client List</h2>
            <div className="list-controls">
              <span className="client-count">{filteredClients.length} clients</span>
              <button 
                className="filter-btn"
                onClick={() => setShowNicheModal(true)}
              >
                Filter Niches
              </button>
            </div>
          </div>
          
          <div className="client-items">
            {filteredClients.map(client => (
              <div 
                key={client.id}
                className={`client-item ${selectedClient?.id === client.id ? 'selected' : ''}`}
                onClick={() => handleClientSelect(client)}
              >
                <div className="client-avatar">
                  {client.name.charAt(0)}
                </div>
                <div className="client-info">
                  <h3>{client.name}</h3>
                  <p>{client.contactPerson}</p>
                  <div className="client-niches">
                    {client.niches.slice(0, 2).map(niche => (
                      <span key={niche} className="niche-tag">
                        {niche}
                      </span>
                    ))}
                    {client.niches.length > 2 && (
                      <span className="niche-more">+{client.niches.length - 2}</span>
                    )}
                  </div>
                </div>
                <div className="client-meta">
                  <span className={`status-badge ${client.status.toLowerCase()}`}>
                    {client.status}
                  </span>
                  <span className="client-date">
                    {formatDate(client.dateAdded)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="client-details">
          {selectedClient ? (
            <div className="details-card">
              <div className="details-header">
                <div className="details-avatar">
                  {selectedClient.name.charAt(0)}
                </div>
                <div className="details-title">
                  <h2>{selectedClient.name}</h2>
                  <span className={`status-badge ${selectedClient.status.toLowerCase()}`}>
                    {selectedClient.status}
                  </span>
                </div>
              </div>

              <div className="details-content">
                <div className="detail-row">
                  <span className="detail-label">Contact Person:</span>
                  <span>{selectedClient.contactPerson}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <a href={`mailto:${selectedClient.email}`}>{selectedClient.email}</a>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <a href={`tel:${selectedClient.phone}`}>{selectedClient.phone}</a>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date Added:</span>
                  <span>{formatDate(selectedClient.dateAdded)}</span>
                </div>

                <div className="niches-section">
                  <div className="section-header">
                    <h3>Industry Niches</h3>
                    <button 
                      className="edit-niches-btn"
                      onClick={() => setShowNicheModal(true)}
                    >
                      Edit Niches
                    </button>
                  </div>
                  <div className="niches-list">
                    {selectedClient.niches.length > 0 ? (
                      selectedClient.niches.map(niche => (
                        <span key={niche} className="niche-tag selected">
                          {niche}
                        </span>
                      ))
                    ) : (
                      <p className="no-niches">No niches selected</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="details-actions">
                <button className="edit-btn">Edit Client</button>
                <button 
                  className={`status-btn ${selectedClient.status === 'Active' ? 'archive' : 'activate'}`}
                >
                  {selectedClient.status === 'Active' ? 'Archive' : 'Activate'}
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No Client Selected</h3>
              <p>Select a client from the list to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Client</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Company Name*</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  placeholder="Enter company name"
                />
              </div>
              <div className="form-group">
                <label>Contact Person*</label>
                <input
                  type="text"
                  value={newClient.contactPerson}
                  onChange={(e) => setNewClient({...newClient, contactPerson: e.target.value})}
                  placeholder="Enter contact person"
                />
              </div>
              <div className="form-group">
                <label>Email*</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="form-group">
                <label>Phone*</label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={newClient.status}
                  onChange={(e) => setNewClient({...newClient, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={handleAddClient}
                disabled={!newClient.name || !newClient.contactPerson || !newClient.email}
              >
                Save Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Niche Management Modal */}
      {showNicheModal && (
        <div className="modal-overlay">
          <div className="modal-content niche-modal">
            <div className="modal-header">
              <h2>
                {selectedClient 
                  ? `Edit Niches for ${selectedClient.name}`
                  : 'Filter Clients by Niches'}
              </h2>
              <button 
                className="close-btn"
                onClick={() => setShowNicheModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="niches-grid">
                {allNiches.map(niche => (
                  <div 
                    key={niche}
                    className={`niche-option ${
                      (selectedClient 
                        ? selectedClient.niches.includes(niche)
                        : nicheFilter.includes(niche)) 
                      ? 'selected' : ''
                    }`}
                    onClick={() => 
                      selectedClient 
                        ? toggleClientNiche(niche)
                        : toggleNicheFilter(niche)
                    }
                  >
                    {niche}
                    {(selectedClient 
                      ? selectedClient.niches.includes(niche)
                      : nicheFilter.includes(niche)) && (
                      <span className="checkmark">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowNicheModal(false)}
              >
                Close
              </button>
              {!selectedClient && (
                <button 
                  className="clear-btn"
                  onClick={() => setNicheFilter([])}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDiary;