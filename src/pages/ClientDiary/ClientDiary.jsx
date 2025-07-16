import React, { useState } from 'react';
import {
  FiSearch, FiPlus, FiFilter, FiEdit2, FiArchive,
  FiUser, FiMail, FiPhone, FiCalendar, FiX, FiCheck
} from 'react-icons/fi';
import './ClientDiary.css';
import { niches } from '../AdminDashboard/constants';

const ClientDiary = () => {
  // Sample client data - now using niche IDs instead of names
  const initialClients = [
    {
      id: 1,
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '(212) 555-1234',
      contactPerson: 'John Smith',
      dateAdded: '2023-05-15',
      status: 'Active',
      nicheIds: [1, 3] // Using IDs that match the constants
    },
    {
      id: 2,
      name: 'Globex Industries',
      email: 'info@globex.com',
      phone: '(310) 555-9876',
      contactPerson: 'Sarah Johnson',
      dateAdded: '2023-06-22',
      status: 'Active',
      nicheIds: [7, 8] // Medical and Dental
    },
    {
      id: 3,
      name: 'Initech Solutions',
      email: 'support@initech.com',
      phone: '(415) 555-3456',
      contactPerson: 'Michael Scott',
      dateAdded: '2023-07-10',
      status: 'Archived',
      nicheIds: [3] // IT and Telecom
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
    nicheIds: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [nicheFilterIds, setNicheFilterIds] = useState([]);

  // Get niche names for display
  const getNicheNames = (nicheIds) => {
    return nicheIds.map(id => {
      const niche = niches.find(n => n.id === id);
      return niche ? niche.name : '';
    }).filter(name => name !== '');
  };

  // Client selection handler
  const handleClientSelect = (client) => {
    setSelectedClient(client);
  };

  // Add new client handler
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
      nicheIds: []
    });
  };

  // Toggle niche selection
  const toggleClientNiche = (nicheId) => {
    if (selectedClient) {
      const updatedNicheIds = selectedClient.nicheIds.includes(nicheId)
        ? selectedClient.nicheIds.filter(id => id !== nicheId)
        : [...selectedClient.nicheIds, nicheId];

      const updatedClients = clients.map(client =>
        client.id === selectedClient.id
          ? { ...client, nicheIds: updatedNicheIds }
          : client
      );

      setClients(updatedClients);
      setSelectedClient({ ...selectedClient, nicheIds: updatedNicheIds });
    }
  };

  // Toggle niche filter
  const toggleNicheFilter = (nicheId) => {
    setNicheFilterIds(prev =>
      prev.includes(nicheId)
        ? prev.filter(id => id !== nicheId)
        : [...prev, nicheId]
    );
  };

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesNiche =
      nicheFilterIds.length === 0 ||
      nicheFilterIds.some(id => client.nicheIds.includes(id));

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

  // In your JSX, update the niche display to use getNicheNames()
  // For example in client cards:
  const renderClientNiches = (nicheIds) => {
    const names = getNicheNames(nicheIds);
    return (
      <>
        {names.slice(0, 2).map(name => (
          <span key={name} className="niche-tag">
            {name}
          </span>
        ))}
        {names.length > 2 && (
          <span className="niche-more">+{names.length - 2}</span>
        )}
      </>
    );
  };

  // In your niche modal:
  const renderNicheModal = () => (
    <div className="modal-overlay">
      <div className="modal niche-modal">
        <div className="modal-header">
          <h2>
            {selectedClient
              ? `Edit Niches for ${selectedClient.name}`
              : 'Filter Clients by Niches'}
          </h2>
          <button
            className="btn-icon"
            onClick={() => setShowNicheModal(false)}
          >
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          <div className="niches-grid">
            {niches.map(niche => ( // Using the imported 'niches' constant here
              <div
                key={niche.id}
                className={`niche-option ${(selectedClient
                  ? selectedClient.nicheIds.includes(niche.id)
                  : nicheFilterIds.includes(niche.id))
                  ? 'selected' : ''
                  }`}
                onClick={() =>
                  selectedClient
                    ? toggleClientNiche(niche.id)
                    : toggleNicheFilter(niche.id)
                }
              >
                {niche.name}
                {(selectedClient
                  ? selectedClient.nicheIds.includes(niche.id)
                  : nicheFilterIds.includes(niche.id)) && (
                    <FiCheck className="checkmark" />
                  )}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          {!selectedClient && (
            <button
              className="btn-text"
              onClick={() => setNicheFilterIds([])} // Using setNicheFilterIds
            >
              Clear Filters
            </button>
          )}
          <button
            className="btn-primary"
            onClick={() => setShowNicheModal(false)}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="client-diary">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Client Diary</h1>
          <button
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <FiPlus /> Add Client
          </button>
        </div>

        <div className="search-filter">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn-filter"
            onClick={() => setShowNicheModal(true)}
          >
            <FiFilter /> Filter
          </button>
        </div>

        <div className="client-list-header">
          <h3>All Clients</h3>
          <span className="client-count">{filteredClients.length} clients</span>
        </div>

        <div className="client-list">
          {filteredClients.map(client => (
            <div
              key={client.id}
              className={`client-card ${selectedClient?.id === client.id ? 'selected' : ''}`}
              onClick={() => handleClientSelect(client)}
            >
              <div className="client-avatar">
                {client.name.charAt(0)}
              </div>
              <div className="client-info">
                <h4>{client.name}</h4>
                <p>{client.contactPerson}</p>
                <div className="client-meta">
                  <span className={`status-badge ${client.status.toLowerCase()}`}>
                    {client.status}
                  </span>
                  <span className="client-date">
                    {formatDate(client.dateAdded)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {selectedClient ? (
          <div className="client-details">
            <div className="client-header">
              <div className="client-avatar large">
                {selectedClient.name.charAt(0)}
              </div>
              <div className="client-title">
                <h2>{selectedClient.name}</h2>
                <span className={`status-badge ${selectedClient.status.toLowerCase()}`}>
                  {selectedClient.status}
                </span>
              </div>
              <div className="client-actions">
                <button className="btn-icon">
                  <FiEdit2 />
                </button>
                <button className={`btn-icon ${selectedClient.status === 'Active' ? 'archive' : 'activate'}`}>
                  <FiArchive />
                </button>
              </div>
            </div>

            <div className="client-info-grid">
              <div className="info-item">
                <FiUser className="info-icon" />
                <div>
                  <label>Contact Person</label>
                  <p>{selectedClient.contactPerson}</p>
                </div>
              </div>
              <div className="info-item">
                <FiMail className="info-icon" />
                <div>
                  <label>Email</label>
                  <p><a href={`mailto:${selectedClient.email}`}>{selectedClient.email}</a></p>
                </div>
              </div>
              <div className="info-item">
                <FiPhone className="info-icon" />
                <div>
                  <label>Phone</label>
                  <p><a href={`tel:${selectedClient.phone}`}>{selectedClient.phone}</a></p>
                </div>
              </div>
              <div className="info-item">
                <FiCalendar className="info-icon" />
                <div>
                  <label>Date Added</label>
                  <p>{formatDate(selectedClient.dateAdded)}</p>
                </div>
              </div>
            </div>

            <div className="niches-section">
              <div className="section-header">
                <h3>Industry Niches</h3>
                <button
                  className="btn-text"
                  onClick={() => setShowNicheModal(true)}
                >
                  <FiEdit2 /> Edit
                </button>
              </div>
              <div className="niches-list">
                {selectedClient.nicheIds.length > 0 ? ( // Changed from niches to nicheIds
                  renderClientNiches(selectedClient.nicheIds) // Use the render function
                ) : (
                  <p className="no-niches">No niches selected</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">👋</div>
            <h3>Welcome to Client Diary</h3>
            <p>Select a client from the sidebar to view details or add a new client</p>
            <button
              className="btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <FiPlus /> Add New Client
            </button>
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal compact-modal">
            <div className="modal-header">
              <div className="modal-header-content">
                <h2>Add New Client</h2>
                <p className="modal-subtitle">Fill in the client details below</p>
              </div>
              <button
                className="btn-icon close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <FiX />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Company Name*</label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    placeholder="Acme Corporation"
                  />
                </div>
                <div className="form-group">
                  <label>Contact Person*</label>
                  <input
                    type="text"
                    value={newClient.contactPerson}
                    onChange={(e) => setNewClient({ ...newClient, contactPerson: e.target.value })}
                    placeholder="John Smith"
                  />
                </div>
                <div className="form-group">
                  <label>Email*</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="contact@company.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone*</label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div className="form-group status-group">
                  <label>Status</label>
                  <div className="status-options">
                    <label className={`status-option ${newClient.status === 'Active' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="status"
                        value="Active"
                        checked={newClient.status === 'Active'}
                        onChange={(e) => setNewClient({ ...newClient, status: e.target.value })}
                      />
                      <span>Active</span>
                    </label>
                    <label className={`status-option ${newClient.status === 'Archived' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="status"
                        value="Archived"
                        checked={newClient.status === 'Archived'}
                        onChange={(e) => setNewClient({ ...newClient, status: e.target.value })}
                      />
                      <span>Archived</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
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
      {/* Niche Management Modal */}
      {showNicheModal && (
        <div className="modal-overlay">
          <div className="modal niche-modal">
            <div className="modal-header">
              <h2>
                {selectedClient
                  ? `Edit Niches for ${selectedClient.name}`
                  : 'Filter Clients by Niches'}
              </h2>
              <button
                className="btn-icon"
                onClick={() => setShowNicheModal(false)}
              >
                <FiX />
              </button>
            </div>

            <div className="modal-body">
              <div className="niches-grid">
                {niches.map(niche => ( // Changed from allNiches to niches
                  <div
                    key={niche.id} // Changed from niche to niche.id
                    className={`niche-option ${(selectedClient
                      ? selectedClient.nicheIds.includes(niche.id) // Changed from niches to nicheIds
                      : nicheFilterIds.includes(niche.id)) // Changed from nicheFilter to nicheFilterIds
                      ? 'selected' : ''
                      }`}
                    onClick={() =>
                      selectedClient
                        ? toggleClientNiche(niche.id) // Changed from niche to niche.id
                        : toggleNicheFilter(niche.id) // Changed from niche to niche.id
                    }
                  >
                    {niche.name} {/* Display the name instead of the object */}
                    {(selectedClient
                      ? selectedClient.nicheIds.includes(niche.id) // Changed from niches to nicheIds
                      : nicheFilterIds.includes(niche.id)) && ( // Changed from nicheFilter to nicheFilterIds
                        <FiCheck className="checkmark" />
                      )}
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              {!selectedClient && (
                <button
                  className="btn-text"
                  onClick={() => setNicheFilterIds([])} // Changed from setNicheFilter to setNicheFilterIds
                >
                  Clear Filters
                </button>
              )}
              <button
                className="btn-primary"
                onClick={() => setShowNicheModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDiary;