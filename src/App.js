import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import WhoWeAre from './components/WhoWeAre/WhoWeAre';
import Services from './components/Services/Services'
import WhyUs from './components/WhyUs/WhyUs'
import TalentSolutions from './components/TalentSolutions/TalentSolutions';
import TalentComparison from './components/TalentComparison/TalentComparison';
import Testimonials from './components/Testimonials/Testimonials';
import Solutions from './components/Solutions/Solutions';
import Industries from './components/Industries/Industries';
import Process from './components/Process/Process';
import Difference from './components/Difference/Difference';
import CTA from './components/CTA/CTA';
import Footer from './components/Footer/Footer';
import BookCall from './pages/BookCall/BookCall';
import Contact from './components/Contact/Contact';
import Careers from './pages/Careers/Careers.js';
import HowWeWork from './pages/HowWeWork/HowWeWork.js';
import AdminLogin from './components/AdminLogin/AdminLogin.jsx';
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard.jsx";
import ManagedServices from "./pages/Managed Services/ManagedServices.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy.jsx";
import ServiceDetails from "./components/ServiceDetails/ServiceDetails.js";
import './App.css';
import ProfilePage from "./components/ProfilePage/ProfilePage.js";
import WhatsAppChat from './components/WhatsAppChat/WhatsAppChat';
import AddEmployee from "./pages/AddEmployee/AddEmployee.jsx";
import AddNewOpening from "./pages/AddNewOpening/AddNewOpening.jsx";
import EmployeeCard from "./pages/EmployeeCard/EmployeeCard.js";

function Layout() {
  const location = useLocation();

  const isBookCallPage = location.pathname === "/book-call";
  const isContactPage = location.pathname === "/contact-us";
  const isAdminLoginPage = location.pathname === "/admin-login";
  const isAdminDashboardPage = location.pathname === "/admin-dashboard";

  return (
    <>
      {!isBookCallPage && !isAdminLoginPage && <Navbar />}

      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <WhoWeAre />
            <Services />
            <WhyUs />
            <TalentSolutions />
            {/* <TalentComparison />
            <Testimonials />
            <Solutions />
            <Industries />
            <Difference /> */}
            <CTA />
          </>
        } />
        <Route path="/process" element={<Process />} />
        <Route path="/book-call" element={<BookCall />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/how-we-work" element={<HowWeWork />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/managed-services" element={<ManagedServices />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:serviceId" element={<ServiceDetails />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/admin-dashboard/add-employee" element={<AddEmployee />} />
        <Route path="/careers/add-new-opening" element={<AddNewOpening />} />
        <Route path="/employee-diary" element={<EmployeeCard/>} />
      </Routes>

      {/* Add WhatsAppChat component here */}
      {!isAdminDashboardPage && <WhatsAppChat />}

      {!isBookCallPage && !isAdminLoginPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;