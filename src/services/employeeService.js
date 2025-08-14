
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
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

export const getEmployeeById = async (id) => {
  try {
    const docRef = doc(db, 'employees', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting employee:', error);
    throw error;
  }
};