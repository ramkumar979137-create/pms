// Router/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth pages (already built)
import LoginPage  from "../Pages/LoginPage";
import SignupPage from "../Pages/SignupPage";

// Layout
import Layout from "../Components/Layout";

// Pages
import Dashboard    from "../Pages/Dashboard";
import CustomerModule    from "../Pages/Customers";
import Properties   from "../Pages/Properties";
import Invoicing    from "../Pages/Invoicing";
import TimeReporting from "../Pages/Timereporting";
import LeaveManagement from "../Pages/levaemanagement";

import LeaseAgreement    from "../Pages/LeaseAgreement";
import LeaseCancellation from "../Pages/LeaseCancellation";
import RentalAgreement   from "../Pages/RentalAgreement";
import RentalCancellation from "../Pages/RentalCancellation";
import Maintenance       from "../Pages/Maintenance";
import Vendors           from "../Pages/Vendors";
import QuotationRequests   from "../Pages/QuotationRequest";
import QuoteAnalysis     from "../Pages/Quoteanalysis";
import ContractCreation  from "../Pages/Contractapproval";
import ContractApproval  from "../Pages/Contractapproval";

import { useLocation, useNavigate } from "react-router-dom";
import "../Css/Global.css";

/* ── Protected Route ── */
function ProtectedRoute({ children }) {
  const user = localStorage.getItem("pms_user");
  return user ? children : <Navigate to="/login" replace />;
}

/* ── Auth Route (redirect if already logged in) ── */
function AuthRoute({ children }) {
  const user = localStorage.getItem("pms_user");
  return user ? <Navigate to="/dashboard" replace /> : children;
}

/* ── Wrapped page helper ── */
function Page({ component: Component }) {
  return (
    <ProtectedRoute>
      <Layout>
        <Component />
      </Layout>
    </ProtectedRoute>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login"  element={<AuthRoute><AuthShell page="login"  /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><AuthShell page="signup" /></AuthRoute>} />

        {/* Dashboard */}
        <Route path="/dashboard"          element={<Page component={Dashboard}        />} />

        {/* Phase 1 */}
        <Route path="/customers"          element={<Page component={CustomerModule}        />} />
        <Route path="/properties"         element={<Page component={Properties}       />} />

        {/* Phase 2 */}
        <Route path="/lease-agreement"    element={<Page component={LeaseAgreement}   />} />
        <Route path="/lease-cancellation" element={<Page component={LeaseCancellation}/>} />
        <Route path="/rental-agreement"   element={<Page component={RentalAgreement}  />} />
        <Route path="/rental-cancellation"element={<Page component={RentalCancellation}/>}/>

        {/* Phase 3 */}
        <Route path="/maintenance"        element={<Page component={Maintenance}      />} />
        <Route path="/vendors"            element={<Page component={Vendors}          />} />

        {/* Phase 4 */}
        <Route path="/quotation-request"   element={<Page component={QuotationRequests}  />} />
        <Route path="/quote-analysis"     element={<Page component={QuoteAnalysis}    />} />
        <Route path="/contract-creation"  element={<Page component={ContractCreation} />} />
        <Route path="/contract-approval"  element={<Page component={ContractApproval} />} />

        {/* Phase 5 */}
        <Route path="/invoicing"          element={<Page component={Invoicing}        />} />
        <Route path="/time-reporting"     element={<Page component={TimeReporting}    />} />
        <Route path="/leave-management"   element={<Page component={LeaveManagement}  />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

/* ── Auth Shell: renders Login or Signup with switch ── */


function AuthShell({ page }) {
  const location = useLocation();
  const navigate = useNavigate();
  const current = location.pathname === "/signup" ? "signup" : "login";
  const switchPage = (target) => {
    if (target === "signup") navigate("/signup");
    else navigate("/login");
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"rgb(232, 226, 213)" }}>
      {/* Left decorative panel */}

      {/* Right form area */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", background:"rgb(232, 226, 213)" }}>
        <div style={{ width: "100%", maxWidth: "560px" }}>
        
            <div style={{ padding: "24px 24px 28px"}}>
              {current === "login"
                ? <LoginPage onSwitch={() => switchPage("signup")} />
                : <SignupPage onSwitch={() => switchPage("login")} />
              }
            </div>
   
        </div>
      </div>
    </div>
  );
}