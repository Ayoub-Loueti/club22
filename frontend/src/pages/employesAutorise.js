import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/employesAutorise.css'; // Import the CSS for styling

function EmployesAutorise() {
  const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('login');

  useEffect(() => {
    const fetchAuthorizedEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/autoriseEmp', {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        });
        setEmployees(response.data);
      } catch (error) {
        // Handle errors here, if necessary
      }
    };

    if (token) {
      fetchAuthorizedEmployees();
    }
  }, [token]);

const filteredEmployees = employees.filter(
  (employee) =>
    employee.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div>
      <div className="employes-autorise-title-container">
        <h1 className="employes-autorise-title">
          Liste des Employés Autorisés
        </h1>
        <input
          type="text"
          className="employes-autorise-search-input"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="authorizedEmployeesTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Photo</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Type</th>
            <th>Etat</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee, index) => (
            <tr key={employee.id || index}>
              <td>{employee.id}</td>
              <td>{employee.photo}</td>
              <td>{employee.nom}</td>
              <td>{employee.prenom}</td>
              <td>{employee.email}</td>
              <td>{employee.type}</td>
              <td>{employee.etat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployesAutorise;
