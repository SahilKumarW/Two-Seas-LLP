import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "../../../firebase";
import EmployeeCard from "../../EmployeeCard/EmployeeCard";
import Select from "react-select";   // ✅ stylish dropdown

const ViewMember = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      const querySnapshot = await getDocs(collection(db, "clients"));
      const clientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClients(clientsData);
    };
    fetchClients();
  }, []);

  const options = clients.map(c => ({ value: c.id, label: c.name }));

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#2a2d7c", marginBottom: "10px" }}>
        View as Member
      </h2>
      <Select
        options={options}
        onChange={(opt) => setSelectedClient(opt)}
        value={options.find(o => o.value === selectedClient?.value) || null}
        placeholder="Select a client..."
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "8px",
            padding: "4px",
            borderColor: "#2a2d7c"
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#f0f4ff" : "white",
            color: "#2a2d7c",
          }),
        }}
      />

      {selectedClient && (
        <EmployeeCard currentClientId={selectedClient.value} />
      )}
    </div>
  );
};

export default ViewMember;
