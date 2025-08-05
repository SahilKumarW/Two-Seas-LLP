// src/services/employeeService.js
const EMPLOYEES_URL = 'https://raw.githubusercontent.com/SahilKumarW/Two-Seas-LLP/main/data/employees.json';

export const fetchEmployees = async () => {
  try {
    const response = await fetch(EMPLOYEES_URL);
    if (!response.ok) throw new Error("Failed to fetch");
    return await response.json();
  } catch (error) {
    console.error("Error loading employees:", error);
    return []; // Fallback empty array
  }
};