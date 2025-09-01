import { useState, useEffect, useRef, useCallback, memo } from "react"
import {
  FiUser,
  FiMail,
  FiPhone,
  FiX,
  FiMenu,
  FiPlus,
  FiEye,
  FiKey,
  FiEdit,
  FiArchive,
  FiHome,
  FiBarChart2,
  FiUsers,
  FiSave,
  FiCalendar
} from "react-icons/fi"
import Logo from "../../assets/Two Seas Logo.png"
import { FiLogOut } from "react-icons/fi";
import { db } from "../../firebase";
import AddEmployee from '../AddEmployee/AddEmployee';
import EmployeeCard from '../EmployeeCard/EmployeeCard';
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where
} from 'firebase/firestore';

// Add these imports at the top with other imports
import { FiChevronLeft, FiChevronRight, FiChevronDown } from "react-icons/fi";

import { FiCopy, FiRefreshCw } from "react-icons/fi";
import ViewMember from "./pages/ViewMember";

const GeneratePasswordComponent = memo(({ email, onPasswordGenerated }) => {
  const [password, setPassword] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isEmailCopied, setIsEmailCopied] = useState(false);

  const generatePassword = useCallback(() => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let newPassword = "";

    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setPassword(newPassword);
    onPasswordGenerated(email, newPassword);
    setIsCopied(false);
  }, [email, onPasswordGenerated]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(password);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [password]);

  const copyEmailToClipboard = useCallback(() => {
    navigator.clipboard.writeText(email);
    setIsEmailCopied(true);
    setTimeout(() => setIsEmailCopied(false), 2000);
  }, [email]);

  useEffect(() => {
    if (!password) {
      generatePassword();
    }
  }, [password, generatePassword]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
      <input
        type="text"
        value={password}
        readOnly
        style={{
          flex: 1,
          padding: "8px 12px",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          fontSize: "14px",
          backgroundColor: "#f9fafb"
        }}
      />
      <button
        onClick={generatePassword}
        style={{
          padding: "8px",
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "6px",
          cursor: "pointer",
          color: "#22A2D7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Generate new password"
      >
        <FiRefreshCw size={14} />
      </button>
      <button
        onClick={copyToClipboard}
        style={{
          padding: "8px",
          backgroundColor: isCopied ? "#10b981" : "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "6px",
          cursor: "pointer",
          color: isCopied ? "white" : "#22A2D7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
        }}
        title={isCopied ? "Copied!" : "Copy password"}
      >
        <FiCopy size={14} />
      </button>
      {/* <button
        onClick={copyEmailToClipboard}
        style={{
          padding: "8px",
          backgroundColor: isEmailCopied ? "#10b981" : "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "6px",
          cursor: "pointer",
          color: isEmailCopied ? "white" : "#22A2D7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
        }}
        title={isEmailCopied ? "Copied!" : "Copy email"}
      >
        <FiCopy size={14} />
      </button> */}
    </div>
  );
});


// Update the ContactPersonCredentials component
const ContactPersonCredentials = memo(({ contact, onPasswordGenerated, onSaveCredentials, credentialsExist }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [password, setPassword] = useState("");
  const [emailCopied, setEmailCopied] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);

  const handlePasswordGenerated = useCallback((email, generatedPassword) => {
    setPassword(generatedPassword);
    onPasswordGenerated(email, generatedPassword);
  }, [onPasswordGenerated]);

  const copyEmailAndPassword = useCallback(() => {
    const text = `Email: ${contact.email}\nPassword: ${password}`;
    navigator.clipboard.writeText(text);
    setEmailCopied(true);
    setPasswordCopied(true);
    setTimeout(() => {
      setEmailCopied(false);
      setPasswordCopied(false);
    }, 2000);
  }, [contact.email, password]);

  const handleSave = async () => {
    if (!password) return;

    setIsSaving(true);
    setSaveStatus(null);

    try {
      await onSaveCredentials(contact.email, password);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Error saving credentials:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      marginBottom: "12px",
      overflow: "hidden"
    }}>
      <div
        style={{
          padding: "12px",
          backgroundColor: credentialsExist ? "#f0fdf4" : "#f9fafb",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
        onClick={() => !credentialsExist && setIsExpanded(!isExpanded)}
      >
        <div>
          <div style={{ fontWeight: "500", color: "#374151" }}>{contact.name}</div>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>{contact.email}</div>
          {credentialsExist && (
            <div style={{ marginTop: "4px" }}>
              <span style={{
                fontStyle: "italic",
                color: "#15803d",
                fontSize: "12px",
                fontWeight: "500"
              }}>
                Credentials already generated
              </span>
            </div>
          )}
        </div>
        {!credentialsExist && (
          <div style={{
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s"
          }}>
            <FiChevronDown size={16} />
          </div>
        )}
      </div>

      {isExpanded && !credentialsExist && (
        <div style={{ padding: "12px", backgroundColor: "white" }}>
          <div style={{ marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
            Email: {contact.email}
          </div>
          <div style={{ marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
            Password:
          </div>
          <GeneratePasswordComponent
            email={contact.email}
            onPasswordGenerated={handlePasswordGenerated}
          />

          <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
            <button
              onClick={copyEmailAndPassword}
              disabled={!password}
              style={{
                padding: "6px 12px",
                backgroundColor: !password ? "#9ca3af" : (emailCopied && passwordCopied ? "#10b981" : "#22A2D7"),
                border: "none",
                borderRadius: "6px",
                cursor: !password ? "not-allowed" : "pointer",
                fontSize: "12px",
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "all 0.2s ease",
              }}
            >
              {emailCopied && passwordCopied ? (
                <>Copied!</>
              ) : (
                <>Copy Email & Password</>
              )}
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving || !password}
              style={{
                padding: "6px 12px",
                backgroundColor: isSaving || !password ? "#9ca3af" : (saveStatus === "success" ? "#10b981" : "#2a2d7c"),
                border: "none",
                borderRadius: "6px",
                cursor: isSaving || !password ? "not-allowed" : "pointer",
                fontSize: "12px",
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "all 0.2s ease",
              }}
            >
              {isSaving ? (
                <>Creating...</>
              ) : saveStatus === "success" ? (
                <>Created!</>
              ) : saveStatus === "error" ? (
                <>Error</>
              ) : (
                <>Create Client User</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

// Update the ClientCredentialsModal component
const ClientCredentialsModal = memo(({ client, isOpen, onClose }) => {
  const [generatedCredentials, setGeneratedCredentials] = useState({});
  const [existingUsers, setExistingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handlePasswordGenerated = useCallback((email, password) => {
    setGeneratedCredentials(prev => ({
      ...prev,
      [email]: password
    }));
  }, []);

  const saveCredentialsToFirebase = async (email, password) => {
    try {
      // Check if user already exists
      const usersRef = collection(db, "clients-login");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Update existing user
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "clients-login", userDoc.id), {
          password: password,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new user
        await setDoc(doc(db, "clients-login", email), {
          email: email,
          password: password,
          clientId: client.id,
          clientName: client.name,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // Refresh existing users after saving
      fetchExistingUsers();
      return true;
    } catch (error) {
      console.error("Error saving credentials:", error);
      throw error;
    }
  };

  const fetchExistingUsers = async () => {
    try {
      const usersRef = collection(db, "clients-login");
      const querySnapshot = await getDocs(usersRef);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push(doc.data().email);
      });
      setExistingUsers(usersData);
    } catch (error) {
      console.error("Error fetching existing users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && client) {
      fetchExistingUsers();
    }
  }, [isOpen, client]);

  const copyAllCredentials = useCallback(() => {
    const text = Object.entries(generatedCredentials)
      .map(([email, password]) => `${email}: ${password}`)
      .join('\n');

    navigator.clipboard.writeText(text);
  }, [generatedCredentials]);

  if (!isOpen || !client) return null;

  const contacts = [
    {
      name: client.contactPerson1,
      email: client.contactPerson1Email,
      phone: client.contactPerson1Phone
    }
  ];

  if (client.contactPerson2 && client.contactPerson2Email) {
    contacts.push({
      name: client.contactPerson2,
      email: client.contactPerson2Email,
      phone: client.contactPerson2Phone
    });
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #22A2D7 0%, #06a3c2 100%)",
            color: "white",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "white" }}>
            Generate Credentials for {client.name}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              padding: "8px",
              borderRadius: "8px",
              cursor: "pointer",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FiX size={20} />
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          {contacts.map((contact, index) => (
            <ContactPersonCredentials
              key={index}
              contact={contact}
              onPasswordGenerated={handlePasswordGenerated}
              onSaveCredentials={saveCredentialsToFirebase}
              credentialsExist={existingUsers.includes(contact.email)}
            />
          ))}

          {/* {Object.keys(generatedCredentials).length > 0 && (
            <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
              <button
                onClick={copyAllCredentials}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#22A2D7",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                <FiCopy size={16} /> Copy All Credentials
              </button>

              <button
                onClick={async () => {
                  // Save all credentials
                  for (const [email, password] of Object.entries(generatedCredentials)) {
                    try {
                      await saveCredentialsToFirebase(email, password);
                    } catch (error) {
                      console.error(`Error saving credentials for ${email}:`, error);
                    }
                  }
                }}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#2a2d7c",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                <FiSave size={16} /> Create Client User
              </button>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
});

const fetchClientsAndUsers = async () => {
  const clientsSnapshot = await getDocs(collection(db, "clients"));
  const employeesSnapshot = await getDocs(collection(db, "employees"));

  const clients = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const employees = employeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return { clients, employees };
};

// Generate Credentials Component
const GenerateCredentials = memo(() => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "clients"));
      const clientsData = [];
      querySnapshot.forEach((doc) => {
        clientsData.push({ id: doc.id, ...doc.data() });
      });
      setClients(clientsData);
    } catch (error) {
      console.error("Error fetching clients:", error);
      alert("Error loading clients");
    } finally {
      setLoading(false);
    }
  };

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setIsCredentialsModalOpen(true);
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "18px", color: "#64748b" }}>Loading clients...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#22A2D7", margin: 0 }}>
          Generate Credentials ({clients.length})
        </h2>
        <p style={{ color: "#64748b", margin: 0 }}>
          Select a client to generate credentials for their contacts
        </p>
      </div>

      {clients.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
          <FiUsers size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
          <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>No clients found</h3>
          <p style={{ margin: 0 }}>Add clients to generate credentials for them.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {clients.map((client) => (
            <div
              key={client.id}
              onClick={() => handleClientClick(client)}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.04)",
                border: "1px solid #e5e7eb",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.04)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                {client.companyLogo ? (
                  <img
                    src={client.companyLogo}
                    alt={client.name}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #22A2D7 0%, #06a3c2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#22A2D7" }}>
                  {client.name}
                </h3>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <FiUser size={14} color="#64748b" />
                  <span style={{ fontSize: "14px", color: "#374151" }}>{client.contactPerson1}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <FiMail size={14} color="#64748b" />
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>{client.contactPerson1Email}</span>
                </div>
              </div>

              {client.contactPerson2 && (
                <div style={{
                  padding: "8px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#6b7280"
                }}>
                  +1 additional contact
                </div>
              )}

              <div style={{
                marginTop: "12px",
                padding: "6px 10px",
                backgroundColor: "#f0f9ff",
                borderRadius: "20px",
                display: "inline-block",
                fontSize: "12px",
                fontWeight: "500",
                color: "#06a3c2"
              }}>
                Click to generate credentials
              </div>
            </div>
          ))}
        </div>
      )}

      <ClientCredentialsModal
        client={selectedClient}
        isOpen={isCredentialsModalOpen}
        onClose={() => setIsCredentialsModalOpen(false)}
      />
    </div>
  );
});

// Client Card Component
const ClientCard = memo(({ client, onClick, onEdit, onDelete }) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
        border: "1px solid #e8f0fe",
        cursor: "pointer",
        transition: "all 0.3s ease",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.12)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.08)";
      }}
    >
      {/* Action buttons */}
      <div style={{
        position: "absolute",
        top: "16px",
        right: "16px",
        display: "flex",
        gap: "8px",
        zIndex: 10
      }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(client);
          }}
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "6px",
            cursor: "pointer",
            color: "#22A2D7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#22A2D7";
            e.target.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#f8fafc";
            e.target.style.color = "#22A2D7";
          }}
        >
          <FiEdit size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(client);
          }}
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "6px",
            cursor: "pointer",
            color: "#ef4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#ef4444";
            e.target.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#f8fafc";
            e.target.style.color = "#ef4444";
          }}
        >
          <FiX size={14} />
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
        {client.companyLogo ? (
          <img
            src={client.companyLogo}
            alt={client.name}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "12px",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #22A2D7 0%, #06a3c2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {client.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#22A2D7" }}>
            {client.name}
          </h3>
          <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" }}>
            {client.contactPerson1Email}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <FiUser size={16} color="#22A2D7" />
          <span style={{ fontSize: "14px", color: "#374151" }}>{client.contactPerson1}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <FiPhone size={16} color="#22A2D7" />
          <span style={{ fontSize: "14px", color: "#374151" }}>{client.contactPerson1Phone}</span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "600",
            backgroundColor: client.status === "Active" ? "#f0fdf4" : "#fef2f2",
            color: client.status === "Active" ? "#10b981" : "#ef4444",
          }}
        >
          {client.status}
        </span>
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>
          Added: {client.createdAt?.toDate().toLocaleDateString()}
        </span>
      </div>
    </div>
  );
});

// Client Details Modal
const ClientDetailsModal = memo(({ client, isOpen, onClose }) => {
  if (!isOpen || !client) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #22A2D7 0%, #06a3c2 100%)",
            color: "white",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "white" }}>
            Client Details
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              padding: "8px",
              borderRadius: "8px",
              cursor: "pointer",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FiX size={20} />
          </button>
        </div>

        <div style={{ padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px" }}>
            {client.companyLogo ? (
              <img
                src={client.companyLogo}
                alt={client.name}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "16px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #22A2D7 0%, #06a3c2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              >
                {client.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#22A2D7" }}>
                {client.name}
              </h3>
              <span
                style={{
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  backgroundColor: client.status === "Active" ? "#f0fdf4" : "#fef2f2",
                  color: client.status === "Active" ? "#10b981" : "#ef4444",
                }}
              >
                {client.status}
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            {/* Company Information */}
            <div>
              <h4 style={{
                margin: "0 0 16px 0",
                color: "#22A2D7",
                fontSize: "18px",
                borderBottom: "2px solid #22A2D7",
                paddingBottom: "8px"
              }}>
                Company Information
              </h4>
              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <span style={{ color: "#64748b", fontSize: "14px", display: "block", marginBottom: "4px" }}>Email:</span>
                  <span style={{ color: "#374151", fontWeight: "500" }}>{client.email || "Not provided"}</span>
                </div>
                <div>
                  <span style={{ color: "#64748b", fontSize: "14px", display: "block", marginBottom: "4px" }}>Phone:</span>
                  <span style={{ color: "#374151", fontWeight: "500" }}>{client.phone || "Not provided"}</span>
                </div>
              </div>
            </div>

            {/* Primary Contact */}
            <div>
              <h4 style={{
                margin: "0 0 16px 0",
                color: "#22A2D7",
                fontSize: "18px",
                borderBottom: "2px solid #22A2D7",
                paddingBottom: "8px"
              }}>
                Primary Contact
              </h4>
              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <span style={{ color: "#64748b", fontSize: "14px", display: "block", marginBottom: "4px" }}>Name:</span>
                  <span style={{ color: "#374151", fontWeight: "500" }}>{client.contactPerson1 || "Not provided"}</span>
                </div>
                <div>
                  <span style={{ color: "#64748b", fontSize: "14px", display: "block", marginBottom: "4px" }}>Email:</span>
                  <span style={{ color: "#374151", fontWeight: "500" }}>{client.contactPerson1Email}</span>
                </div>
                <div>
                  <span style={{ color: "#64748b", fontSize: "14px", display: "block", marginBottom: "4px" }}>Phone:</span>
                  <span style={{ color: "#374151", fontWeight: "500" }}>{client.contactPerson1Phone || "Not provided"}</span>
                </div>
              </div>
            </div>

            {/* Secondary Contact */}
            {client.contactPerson2 && (
              <div>
                <h4 style={{
                  margin: "0 0 16px 0",
                  color: "#22A2D7",
                  fontSize: "18px",
                  borderBottom: "2px solid #22A2D7",
                  paddingBottom: "8px"
                }}>
                  Secondary Contact
                </h4>
                <div style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "14px", display: "block", marginBottom: "4px" }}>Name:</span>
                    <span style={{ color: "#374151", fontWeight: "500" }}>{client.contactPerson2}</span>
                  </div>
                  {client.contactPerson2Email && (
                    <div>
                      <span style={{ color: "#64748b", fontSize: "14px", display: "block", marginBottom: "4px" }}>Email:</span>
                      <span style={{ color: "#374151", fontWeight: "500" }}>{client.contactPerson2Email}</span>
                    </div>
                  )}
                  {client.contactPerson2Phone && (
                    <div>
                      <span style={{ color: "#64748b", fontSize: "14px", display: "block", marginBottom: "4px" }}>Phone:</span>
                      <span style={{ color: "#374151", fontWeight: "500" }}>{client.contactPerson2Phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div>
              <h4 style={{
                margin: "0 0 16px 0",
                color: "#22A2D7",
                fontSize: "18px",
                borderBottom: "2px solid #22A2D7",
                paddingBottom: "8px"
              }}>
                Additional Information
              </h4>
              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <span style={{ color: "#64748b", fontSize: "14px", display: "block", marginBottom: "4px" }}>Created:</span>
                  <span style={{ color: "#374151", fontWeight: "500" }}>
                    {client.createdAt?.toDate().toLocaleDateString()}
                  </span>
                </div>
                {client.updatedAt && (
                  <div>
                    <span style={{ color: "#64748b", fontSize: "14px", display: "block", marginBottom: "4px" }}>Last Updated:</span>
                    <span style={{ color: "#374151", fontWeight: "500" }}>
                      {client.updatedAt?.toDate().toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// View Clients Component
const ViewClients = memo(() => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "clients"));
      const clientsData = [];
      querySnapshot.forEach((doc) => {
        clientsData.push({ id: doc.id, ...doc.data() });
      });
      setClients(clientsData);
    } catch (error) {
      console.error("Error fetching clients:", error);
      alert("Error loading clients");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (client) => {
    setSelectedClient(client);
    setIsDetailsModalOpen(true);
  };

  const handleEditClient = (client) => {
    setClientToEdit(client);
    setIsEditModalOpen(true);
  };

  const handleDeleteClient = (client) => {
    setClientToDelete(client);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;

    try {
      await deleteDoc(doc(db, "clients", clientToDelete.id));
      setClients(clients.filter(c => c.id !== clientToDelete.id));
      setClientToDelete(null);
      alert(`Client ${clientToDelete.name} deleted successfully`);
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Error deleting client");
    }
  };

  const updateClient = async (updatedClient) => {
    try {
      await updateDoc(doc(db, "clients", updatedClient.id), {
        ...updatedClient,
        updatedAt: serverTimestamp()
      });

      setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
      setIsEditModalOpen(false);
      alert("Client updated successfully");
    } catch (error) {
      console.error("Error updating client:", error);
      alert("Error updating client");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "18px", color: "#64748b" }}>Loading clients...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#22A2D7", margin: 0 }}>
          All Clients ({clients.length})
        </h2>
      </div>

      {clients.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
          <FiUsers size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
          <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>No clients found</h3>
          <p style={{ margin: 0 }}>Get started by adding your first client.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "24px",
          }}
        >
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onClick={() => handleCardClick(client)}
              onEdit={handleEditClient}
              onDelete={handleDeleteClient}
            />
          ))}
        </div>
      )}

      {/* Client Details Modal */}
      <ClientDetailsModal
        client={selectedClient}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      {/* Edit Client Modal */}
      <EditClientModal
        client={clientToEdit}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={updateClient}
      />

      {/* Delete Confirmation Modal */}
      {clientToDelete && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "24px",
              maxWidth: "400px",
              width: "100%",
            }}
          >
            <h3 style={{ margin: "0 0 16px 0", color: "#2A2D7C" }}>
              Confirm Delete
            </h3>
            <p style={{ margin: "0 0 24px 0", color: "#64748b" }}>
              Are you sure you want to delete {clientToDelete.name} and contact {clientToDelete.contactPerson1}? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setClientToDelete(null)}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  backgroundColor: "white",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// Edit Client Modal Component
const EditClientModal = memo(({ client, isOpen, onClose, onUpdate }) => {
  const [editedClient, setEditedClient] = useState(client || {});
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    if (client) {
      setEditedClient(client);
    }
  }, [client]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedClient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const logoURL = URL.createObjectURL(file);
      setEditedClient((prev) => ({
        ...prev,
        companyLogo: logoURL,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onUpdate(editedClient);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#22A2D7" }}>
            Edit Client
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              padding: "8px",
              borderRadius: "8px",
              cursor: "pointer",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          {/* Company Information */}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ margin: "0 0 16px 0", color: "#374151", fontSize: "16px", borderBottom: "2px solid #22A2D7", paddingBottom: "8px" }}>
              Company Information
            </h4>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Company Name *
              </label>
              <div style={{ position: "relative" }}>
                <FiUser
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    zIndex: 1,
                  }}
                />
                <input
                  type="text"
                  name="name"
                  value={editedClient.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "14px",
                    transition: "all 0.2s",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#06a3c2")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Company Email
              </label>
              <div style={{ position: "relative" }}>
                <FiMail
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    zIndex: 1,
                  }}
                />
                <input
                  type="email"
                  name="email"
                  value={editedClient.email || ""}
                  onChange={handleInputChange}
                  placeholder="Enter company email"
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "14px",
                    transition: "all 0.2s",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#06a3c2")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Company Phone
              </label>
              <div style={{ position: "relative" }}>
                <FiPhone
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    zIndex: 1,
                  }}
                />
                <input
                  type="tel"
                  name="phone"
                  value={editedClient.phone || ""}
                  onChange={handleInputChange}
                  placeholder="Enter company phone"
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "14px",
                    transition: "all 0.2s",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#06a3c2")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Company Logo
              </label>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "12px 20px",
                  backgroundColor: "#f8fafc",
                  border: "2px dashed #cbd5e1",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#64748b",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#f1f5f9"
                  e.target.style.borderColor = "#06a3c2"
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#f8fafc"
                  e.target.style.borderColor = "#cbd5e1"
                }}
              >
                <FiPlus style={{ marginRight: "8px" }} />
                Change Logo
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              </label>
              {editedClient.companyLogo && (
                <img
                  src={editedClient.companyLogo}
                  alt="Company Logo Preview"
                  style={{
                    marginTop: "12px",
                    height: "64px",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              )}
            </div>
          </div>

          {/* Primary Contact */}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ margin: "0 0 16px 0", color: "#374151", fontSize: "16px", borderBottom: "2px solid #22A2D7", paddingBottom: "8px" }}>
              Primary Contact *
            </h4>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Contact Person Name
              </label>
              <div style={{ position: "relative" }}>
                <FiUser
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    zIndex: 1,
                  }}
                />
                <input
                  type="text"
                  name="contactPerson1"
                  value={editedClient.contactPerson1 || ""}
                  onChange={handleInputChange}
                  placeholder="Enter contact person's name"
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "14px",
                    transition: "all 0.2s",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#06a3c2")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Contact Person Email *
              </label>
              <div style={{ position: "relative" }}>
                <FiMail
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    zIndex: 1,
                  }}
                />
                <input
                  type="email"
                  name="contactPerson1Email"
                  value={editedClient.contactPerson1Email || ""}
                  onChange={handleInputChange}
                  placeholder="Enter contact person's email"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "14px",
                    transition: "all 0.2s",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#06a3c2")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Contact Person Phone
              </label>
              <div style={{ position: "relative" }}>
                <FiPhone
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    zIndex: 1,
                  }}
                />
                <input
                  type="tel"
                  name="contactPerson1Phone"
                  value={editedClient.contactPerson1Phone || ""}
                  onChange={handleInputChange}
                  placeholder="Enter contact person's phone"
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "14px",
                    transition: "all 0.2s",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#06a3c2")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>
          </div>

          {/* Secondary Contact */}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ margin: "0 0 16px 0", color: "#374151", fontSize: "16px", borderBottom: "2px solid #22A2D7", paddingBottom: "8px" }}>
              Secondary Contact (Optional)
            </h4>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Contact Person Name
              </label>
              <div style={{ position: "relative" }}>
                <FiUser
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    zIndex: 1,
                  }}
                />
                <input
                  type="text"
                  name="contactPerson2"
                  value={editedClient.contactPerson2 || ""}
                  onChange={handleInputChange}
                  placeholder="Enter second contact person's name"
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "14px",
                    transition: "all 0.2s",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#06a3c2")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Contact Person Email
              </label>
              <div style={{ position: "relative" }}>
                <FiMail
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    zIndex: 1,
                  }}
                />
                <input
                  type="email"
                  name="contactPerson2Email"
                  value={editedClient.contactPerson2Email || ""}
                  onChange={handleInputChange}
                  placeholder="Enter second contact person's email"
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "14px",
                    transition: "all 0.2s",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#06a3c2")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Contact Person Phone
              </label>
              <div style={{ position: "relative" }}>
                <FiPhone
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    zIndex: 1,
                  }}
                />
                <input
                  type="tel"
                  name="contactPerson2Phone"
                  value={editedClient.contactPerson2Phone || ""}
                  onChange={handleInputChange}
                  placeholder="Enter second contact person's phone"
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "14px",
                    transition: "all 0.2s",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#06a3c2")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Status
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  border: `2px solid ${editedClient.status === "Active" ? "#06a3c2" : "#e5e7eb"}`,
                  borderRadius: "12px",
                  cursor: "pointer",
                  backgroundColor: editedClient.status === "Active" ? "#f0f9ff" : "white",
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={editedClient.status === "Active"}
                  onChange={handleInputChange}
                  style={{ display: "none" }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: editedClient.status === "Active" ? "#06a3c2" : "#64748b",
                  }}
                >
                  Active
                </span>
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  border: `2px solid ${editedClient.status === "Inactive" ? "#06a3c2" : "#e5e7eb"}`,
                  borderRadius: "12px",
                  cursor: "pointer",
                  backgroundColor: editedClient.status === "Inactive" ? "#f0f9ff" : "white",
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={editedClient.status === "Inactive"}
                  onChange={handleInputChange}
                  style={{ display: "none" }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: editedClient.status === "Inactive" ? "#06a3c2" : "#64748b",
                  }}
                >
                  Inactive
                </span>
              </label>
            </div>
          </div>

          <div
            style={{
              padding: "24px",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "12px 24px",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                backgroundColor: "white",
                color: "#64748b",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#f8fafc"
                e.target.style.borderColor = "#cbd5e1"
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "white"
                e.target.style.borderColor = "#e5e7eb"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                border: "none",
                borderRadius: "12px",
                backgroundColor: "#22A2D7",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#1a8cbb"
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#22A2D7"
              }}
            >
              Update Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

const AddClientModal = memo(({
  showAddClientModal,
  setShowAddClientModal,
  newClient,
  setNewClient,
  handleFileChange
}) => {
  const nameInputRef = useRef(null);
  // Function to handle form submission to Firebase
  const handleSubmitToFirebase = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!newClient.name || !newClient.contactPerson1Email) {
      alert("Please fill in required fields: Company Name and Contact Person 1 Email");
      return;
    }

    try {
      // Add document to Firestore
      const docRef = await addDoc(collection(db, "clients"), {
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        contactPerson1: newClient.contactPerson1,
        contactPerson1Email: newClient.contactPerson1Email,
        contactPerson1Phone: newClient.contactPerson1Phone,
        contactPerson2: newClient.contactPerson2,
        contactPerson2Email: newClient.contactPerson2Email,
        contactPerson2Phone: newClient.contactPerson2Phone,
        status: newClient.status,
        companyLogo: newClient.companyLogo,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log("Client added with ID: ", docRef.id);

      // Reset form and close modal
      setNewClient({
        name: "",
        email: "",
        phone: "",
        contactPerson1: "",
        contactPerson1Email: "",
        contactPerson1Phone: "",
        contactPerson2: "",
        contactPerson2Email: "",
        contactPerson2Phone: "",
        status: "Active",
        companyLogo: null,
      });

      setShowAddClientModal(false);

      // Show success message (you could use a toast notification here)
      alert("Client added successfully!");

    } catch (error) {
      console.error("Error adding client: ", error);
      alert("Error adding client. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(42, 45, 124, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#2A2D7C",
              margin: 0,
            }}
          >
            Add New Client
          </h2>
          <button
            onClick={() => setShowAddClientModal(false)}
            style={{
              background: "none",
              border: "none",
              padding: "8px",
              borderRadius: "8px",
              cursor: "pointer",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmitToFirebase} style={{ padding: "24px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Company Name *
            </label>
            <div style={{ position: "relative" }}>
              <FiUser
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  zIndex: 1,
                }}
              />
              <input
                type="text"
                name="name"
                value={newClient.name}
                onChange={handleInputChange}
                placeholder="Enter company name"
                required
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "14px",
                  transition: "all 0.2s",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#06a3c2")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Company Email
            </label>
            <div style={{ position: "relative" }}>
              <FiMail
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  zIndex: 1,
                }}
              />
              <input
                type="email"
                name="email"
                value={newClient.email}
                onChange={handleInputChange}
                placeholder="Enter company email"
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "14px",
                  transition: "all 0.2s",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#06a3c2")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Company Phone
            </label>
            <div style={{ position: "relative" }}>
              <FiPhone
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  zIndex: 1,
                }}
              />
              <input
                type="tel"
                name="phone"
                value={newClient.phone}
                onChange={handleInputChange}
                placeholder="Enter company phone"
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "14px",
                  transition: "all 0.2s",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#06a3c2")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Company Logo
            </label>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "12px 20px",
                backgroundColor: "#f8fafc",
                border: "2px dashed #cbd5e1",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                color: "#64748b",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#f1f5f9"
                e.target.style.borderColor = "#06a3c2"
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#f8fafc"
                e.target.style.borderColor = "#cbd5e1"
              }}
            >
              <FiPlus style={{ marginRight: "8px" }} />
              Choose File
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
            </label>
            {newClient.companyLogo && (
              <img
                src={newClient.companyLogo || "/placeholder.svg"}
                alt="Company Logo Preview"
                style={{
                  marginTop: "12px",
                  height: "64px",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Contact Person (1) *
            </label>

            <div style={{ position: "relative", marginBottom: "12px" }}>
              <FiUser
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                type="text"
                name="contactPerson1"
                value={newClient.contactPerson1}
                onChange={handleInputChange}
                placeholder="Enter first contact person's name"
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "14px",
                  transition: "all 0.2s",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#06a3c2")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div style={{ position: "relative", marginBottom: "12px" }}>
              <FiMail
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                type="email"
                name="contactPerson1Email"
                value={newClient.contactPerson1Email}
                onChange={handleInputChange}
                placeholder="Enter first contact person's email"
                required
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "14px",
                  transition: "all 0.2s",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#06a3c2")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div style={{ position: "relative" }}>
              <FiPhone
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                type="tel"
                name="contactPerson1Phone"
                value={newClient.contactPerson1Phone}
                onChange={handleInputChange}
                placeholder="Enter first contact person's phone"
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "14px",
                  transition: "all 0.2s",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#06a3c2")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Contact Person (2) - Optional
            </label>

            <div style={{ position: "relative", marginBottom: "12px" }}>
              <FiUser
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                type="text"
                name="contactPerson2"
                value={newClient.contactPerson2}
                onChange={handleInputChange}
                placeholder="Enter second contact person's name"
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "14px",
                  transition: "all 0.2s",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#06a3c2")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div style={{ position: "relative", marginBottom: "12px" }}>
              <FiMail
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                type="email"
                name="contactPerson2Email"
                value={newClient.contactPerson2Email}
                onChange={handleInputChange}
                placeholder="Enter second contact person's email (optional)"
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "14px",
                  transition: "all 0.2s",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#06a3c2")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div style={{ position: "relative" }}>
              <FiPhone
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                type="tel"
                name="contactPerson2Phone"
                value={newClient.contactPerson2Phone}
                onChange={handleInputChange}
                placeholder="Enter second contact person's phone (optional)"
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "14px",
                  transition: "all 0.2s",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#06a3c2")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Status
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  border: `2px solid ${newClient.status === "Active" ? "#06a3c2" : "#e5e7eb"}`,
                  borderRadius: "12px",
                  cursor: "pointer",
                  backgroundColor: newClient.status === "Active" ? "#f0f9ff" : "white",
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={newClient.status === "Active"}
                  onChange={handleInputChange}
                  style={{ display: "none" }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: newClient.status === "Active" ? "#06a3c2" : "#64748b",
                  }}
                >
                  Active
                </span>
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  border: `2px solid ${newClient.status === "Inactive" ? "#06a3c2" : "#e5e7eb"}`,
                  borderRadius: "12px",
                  cursor: "pointer",
                  backgroundColor: newClient.status === "Inactive" ? "#f0f9ff" : "white",
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={newClient.status === "Inactive"}
                  onChange={handleInputChange}
                  style={{ display: "none" }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: newClient.status === "Inactive" ? "#06a3c2" : "#64748b",
                  }}
                >
                  Inactive
                </span>
              </label>
            </div>
          </div>

          <div
            style={{
              padding: "24px",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={() => setShowAddClientModal(false)}
              style={{
                padding: "12px 24px",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                backgroundColor: "white",
                color: "#64748b",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#f8fafc"
                e.target.style.borderColor = "#cbd5e1"
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "white"
                e.target.style.borderColor = "#e5e7eb"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newClient.name || !newClient.contactPerson1Email}
              style={{
                padding: "12px 24px",
                border: "none",
                borderRadius: "12px",
                backgroundColor: !newClient.name || !newClient.contactPerson1Email ? "#cbd5e1" : "#06a3c2",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: !newClient.name || !newClient.contactPerson1Email ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                if (!(!newClient.name || !newClient.contactPerson1Email)) {
                  e.target.style.backgroundColor = "#0891b2"
                }
              }}
              onMouseOut={(e) => {
                if (!(!newClient.name || !newClient.contactPerson1Email)) {
                  e.target.style.backgroundColor = "#06a3c2"
                }
              }}
            >
              Add Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default function ModernAdminPanel() {
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    contactPerson1: "",
    contactPerson1Email: "",
    contactPerson1Phone: "",
    contactPerson2: "",
    contactPerson2Email: "",
    contactPerson2Phone: "",
    status: "Active",
    companyLogo: null,
  })

  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isDesktop = windowWidth >= 768

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const logoURL = URL.createObjectURL(file)
      setNewClient((prev) => ({
        ...prev,
        companyLogo: logoURL,
      }))
    }
  }

  const sampleClient = {
    name: "Acme Corporation",
    contactPerson1: "John Doe",
    contactPerson1Email: "john.doe@acme.com",
    contactPerson1Phone: "+1 (555) 123-4567",
    contactPerson2: "Jane Smith",
    contactPerson2Email: "jane.smith@acme.com",
    contactPerson2Phone: "+1 (555) 987-6543",
    status: "Active",
    logo: "https://via.placeholder.com/100",
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FiHome size={18} /> },
    { id: "add-client", label: "Add Client", icon: <FiPlus size={18} /> },
    { id: "view-client", label: "View Clients", icon: <FiEye size={18} /> },
    { id: "generate-credentials", label: "Generate Credentials", icon: <FiKey size={18} /> },
    { id: "add-employee", label: "Add Employee", icon: <FiUser size={18} /> },
    { id: "view-employees", label: "View Employees", icon: <FiUsers size={18} /> },
    { id: "view-member", label: "View as Member", icon: <FiUser size={18} /> },
    { id: "archived", label: "Archived Employees", icon: <FiArchive size={18} /> },
    { id: "view-interview-requests", label: "View Interview Requests", icon: <FiCalendar size={18} /> }, // ✅ New item
  ];

  const stats = [
    { label: "Total Clients", value: "248", change: "+12%", icon: <FiUsers size={24} /> },
    { label: "Total Employees", value: "1,429", change: "+8%", icon: <FiUser size={24} /> },
    { label: "Revenue", value: "$84,290", change: "+15%", icon: <FiBarChart2 size={24} /> },
  ]

  const recentActivity = [
    { action: "New client added", user: "John Doe", time: "2 hours ago" },
    { action: "Employee archived", user: "Jane Smith", time: "4 hours ago" },
    { action: "Credentials generated", user: "Mike Johnson", time: "6 hours ago" },
    { action: "Client updated", user: "Sarah Wilson", time: "1 day ago" },
  ]

  const handleAddClient = () => {
    console.log("Adding new client:", newClient)
    setNewClient({
      name: "",
      email: "",
      phone: "",
      contactPerson1: "",
      contactPerson1Email: "",
      contactPerson1Phone: "",
      contactPerson2: "",
      contactPerson2Email: "",
      contactPerson2Phone: "",
      status: "Active",
      companyLogo: null,
    })
    setShowAddClientModal(false)
  }

  // Render different content based on active menu item
  const renderContent = () => {
    switch (activeMenuItem) {
      case "add-employee":
        return <AddEmployee noPadding setActiveMenuItem={setActiveMenuItem} />;
      case "view-client":
        return <ViewClients />;
      case "view-employees":
        return <EmployeeCard />;
      case "view-member":
        return <ViewMember />;
      case "generate-credentials":
        return <GenerateCredentials />;
      case "archived":
        return <EmployeeCard archived />;
      case "dashboard":
      default:
        return (
          <>
            {/* Stats Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  windowWidth >= 1024 ? "repeat(4, 1fr)" : windowWidth >= 768 ? "repeat(2, 1fr)" : "1fr",
                gap: isDesktop ? "24px" : "16px",
                marginBottom: "32px",
              }}
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "white",
                    padding: "24px",
                    borderRadius: "16px",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    border: "1px solid #f1f5f9",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 10px 25px -3px rgba(0, 0, 0, 0.1)"
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div
                      style={{
                        padding: "12px",
                        backgroundColor: "#f0f9ff",
                        borderRadius: "12px",
                        color: "#06a3c2",
                      }}
                    >
                      {stat.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#64748b",
                          margin: "0 0 4px 0",
                        }}
                      >
                        {stat.label}
                      </p>
                      <p
                        style={{
                          fontSize: "24px",
                          fontWeight: "700",
                          color: "#1f2937",
                          margin: "0 0 4px 0",
                        }}
                      >
                        {stat.value}
                      </p>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: stat.change.startsWith("+") ? "#10b981" : "#ef4444",
                          backgroundColor: stat.change.startsWith("+") ? "#f0fdf4" : "#fef2f2",
                          padding: "4px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts and Activity Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isDesktop ? "2fr 1fr" : "1fr",
                gap: isDesktop ? "32px" : "24px",
              }}
            >
              {/* Recent Activity */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  border: "1px solid #f1f5f9",
                }}
              >
                <div
                  style={{
                    padding: "24px",
                    borderBottom: "1px solid #f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    Recent Activity
                  </h3>
                  <button
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#64748b",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#f1f5f9"
                      e.target.style.borderColor = "#cbd5e1"
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#f8fafc"
                      e.target.style.borderColor = "#e5e7eb"
                    }}
                  >
                    View All
                  </button>
                </div>
                <div style={{ padding: "24px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#06a3c2",
                            borderRadius: "50%",
                            flexShrink: 0,
                          }}
                        ></div>
                        <div style={{ flex: 1 }}>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#374151",
                              margin: "0 0 2px 0",
                            }}
                          >
                            {activity.action}
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              margin: 0,
                            }}
                          >
                            by {activity.user}
                          </p>
                        </div>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#9ca3af",
                          }}
                        >
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  border: "1px solid #f1f5f9",
                }}
              >
                <div
                  style={{
                    padding: "24px",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    Quick Actions
                  </h3>
                </div>
                <div style={{ padding: "24px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <button
                      onClick={() => {
                        setActiveMenuItem("add-client")
                        setShowAddClientModal(true)
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "16px",
                        backgroundColor: "#2A2D7C",
                        border: "none",
                        borderRadius: "12px",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        width: "100%",
                      }}
                      onMouseOver={(e) => (e.target.style.backgroundColor = "#1e1f5c")}
                      onMouseOut={(e) => (e.target.style.backgroundColor = "#2A2D7C")}
                    >
                      <FiPlus size={18} />
                      <span>Add New Client</span>
                    </button>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "16px",
                        backgroundColor: "#06a3c2",
                        border: "none",
                        borderRadius: "12px",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        width: "100%",
                      }}
                      onMouseOver={(e) => (e.target.style.backgroundColor = "#0891b2")}
                      onMouseOut={(e) => (e.target.style.backgroundColor = "#06a3c2")}
                      onClick={() => setActiveMenuItem("add-employee")}  // 👈 this is the key
                    >
                      <FiPlus size={18} />
                      <span>Add New Employee</span>
                    </button>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "16px",
                        backgroundColor: "#f8fafc",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        color: "#64748b",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        width: "100%",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#f1f5f9"
                        e.target.style.borderColor = "#cbd5e1"
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "#f8fafc"
                        e.target.style.borderColor = "#e5e7eb"
                      }}
                    >
                      <FiUser size={18} />
                      <span>View as Member</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Mobile Menu Button */}
      {!isDesktop && (
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            position: "fixed",
            top: "16px",
            right: "16px",
            zIndex: 1001,
            padding: "12px",
            backgroundColor: "#2A2D7C",
            border: "none",
            borderRadius: "12px",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      )}

      {/* Mobile Overlay */}
      {!isDesktop && mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          width: "280px",
          backgroundColor: "#2A2D7C",
          position: isDesktop ? "fixed" : "fixed",
          left: isDesktop ? "0" : mobileMenuOpen ? "0" : "-280px",
          top: "0",
          height: "100vh",
          zIndex: 1000,
          transition: "left 0.3s ease",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "32px 24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "center", // centers horizontally
            alignItems: "center", // centers vertically (if container has height)
          }}
        >
          <a href="/" style={{ display: "inline-block" }}>
            <img
              src={Logo}
              alt="Two Seas Logo"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "contain",
                cursor: "pointer",
              }}
            />
          </a>
        </div>

        <nav style={{ padding: "24px 0" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {menuItems.map((item) => (
              <li key={item.id} style={{ margin: "0 16px 8px 16px" }}>
                <button
                  onClick={() => {
                    setActiveMenuItem(item.id)
                    setMobileMenuOpen(false)
                    if (item.id === "add-client") {
                      setShowAddClientModal(true)
                    }
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 16px",
                    backgroundColor: activeMenuItem === item.id ? "#06a3c2" : "transparent",
                    border: activeMenuItem === item.id ? "1px solid rgba(6, 163, 194, 0.3)" : "1px solid transparent",
                    borderRadius: "12px",
                    color: activeMenuItem === item.id ? "#ffffffff" : "rgba(255, 255, 255, 0.8)",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "left",
                  }}
                  onMouseOver={(e) => {
                    if (activeMenuItem !== item.id) {
                      e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)"
                      e.target.style.color = "white"
                    }
                  }}
                  onMouseOut={(e) => {
                    if (activeMenuItem !== item.id) {
                      e.target.style.backgroundColor = "transparent"
                      e.target.style.color = "rgba(255, 255, 255, 0.8)"
                    }
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          marginLeft: isDesktop ? "280px" : "0",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <header
          style={{
            backgroundColor: "white",
            borderBottom: "1px solid #e5e7eb",
            padding: isDesktop ? "24px 32px" : "24px 16px",
            paddingTop: isDesktop ? "24px" : "72px", // Extra top padding on mobile for menu button
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: isDesktop ? "28px" : "24px",
                  fontWeight: "700",
                  color: "#2A2D7C",
                  margin: "0 0 8px 0",
                }}
              >
                Two Seas | Admin Dashboard
              </h1>
              <p
                style={{
                  fontSize: isDesktop ? "16px" : "14px",
                  color: "#64748b",
                  margin: 0,
                }}
              >
                {
                  activeMenuItem === "add-employee"
                    ? "Add a new employee to your organization"
                    : activeMenuItem === "add-client"
                      ? "Add a new client to your organization"
                      : activeMenuItem === "view-client"
                        ? "Clients that we're proud of!"
                        : activeMenuItem === "view-employees"
                          ? "Showcasing employees that are our assets!"
                          : "Welcome back! Here's what's happening with your business today."
                }
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#2A2D7C",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                <FiLogOut />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main
          style={{
            padding: isDesktop ? "32px" : "16px",
          }}
        >
          {renderContent()}
        </main>
      </div>

      {showAddClientModal && (
        <AddClientModal
          showAddClientModal={showAddClientModal}
          setShowAddClientModal={setShowAddClientModal}
          newClient={newClient}
          setNewClient={setNewClient}
          handleFileChange={handleFileChange}
        />
      )}
    </div>
  )
}