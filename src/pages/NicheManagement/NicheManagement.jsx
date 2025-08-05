import React, { useState } from 'react';
import { niches } from '../AdminDashboard/constants';
import { useEmployees } from '../EmployeeCard/EmployeeCard'; // Modified import
import './NicheManagement.css';

const NicheManagement = () => {
  // Get employees from the hook instead of direct import
  const { employees: initialEmployees } = useEmployees();
  const [employees, setEmployees] = useState(initialEmployees);
  const [selectedNiche, setSelectedNiche] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees.filter(emp => {
    const matchesNiche = !selectedNiche || emp.nicheId === selectedNiche.id;
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesNiche && matchesSearch;
  });

  const handleAssignNiche = (employeeId, nicheId) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId ? { ...emp, nicheId } : emp
    ));
  };

  const handleStatusChange = (employeeId, status) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId ? { ...emp, status } : emp
    ));
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'active': return 'status-active';
      case 'hidden': return 'status-hidden';
      case 'archived': return 'status-archived';
      default: return '';
    }
  };

  const isAssigned = (employee) => {
    return employee.nicheId !== null && employee.nicheId !== undefined;
  };

  return (
    <div className="niche-management">
      <div className="management-header">
        <h2>Niche Management</h2>
        <div className="controls">
          <select
            value={selectedNiche?.id || ''}
            onChange={(e) => setSelectedNiche(
              niches.find(n => n.id === parseInt(e.target.value)) || null
            )}
            className="niche-select"
          >
            <option value="">All Niches</option>
            {niches.map(niche => (
              <option key={niche.id} value={niche.id}>{niche.name}</option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="employee-list">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map(employee => (
            <div 
              key={employee.id} 
              className={`employee-item ${isAssigned(employee) ? 'assigned' : 'unassigned'}`}
            >
              <div className="employee-info">
                <img 
                  src={employee.image} 
                  alt={employee.name} 
                  className="avatar" 
                />
                <div className="employee-details">
                  <h3>{employee.name}</h3>
                  <p>{employee.position}</p>
                  <div className="employee-meta">
                    <span className={`status-indicator ${getStatusClass(employee.status)}`}>
                      {employee.status}
                    </span>
                    {isAssigned(employee) && (
                      <span className="assigned-badge">
                        {niches.find(n => n.id === employee.nicheId)?.name || 'Assigned'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="assignment-controls">
                <div className="control-group">
                  <label>Niche:</label>
                  <select
                    value={employee.nicheId || ''}
                    onChange={(e) => handleAssignNiche(
                      employee.id, 
                      e.target.value ? parseInt(e.target.value) : null
                    )}
                  >
                    <option value="">Unassigned</option>
                    {niches.map(niche => (
                      <option key={niche.id} value={niche.id}>
                        {niche.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="control-group">
                  <label>Status:</label>
                  <select
                    value={employee.status}
                    onChange={(e) => handleStatusChange(employee.id, e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="hidden">Hidden</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {isAssigned(employee) && (
                  <button
                    onClick={() => handleAssignNiche(employee.id, null)}
                    className="btn btn-danger"
                  >
                    Remove from Niche
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No employees found matching your criteria</p>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setSelectedNiche(null);
                setSearchTerm('');
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NicheManagement;