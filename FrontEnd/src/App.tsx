import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home";
import UserLayout from "./layouts/userLayout";
import ErrorPage from "./pages/errorPage";
import SearchPage from "./pages/searchPage";
import { useState } from "react";
import IntroScreen from "./pages/introPage";
import SearchTicket from "./pages/searchTicket";
import SignPage from "./pages/auth/signPage";
import InformationCheckoutPage from "./pages/informationCheckoutPage";
import MethodCheckoutPage from "./pages/methodCheckoutPage";
import PaymentSuccess from "./pages/paymentSucces";
import BecomePartnerPage from "./pages/partner";
import { useAuthInitialize } from "./hooks/useAuthInitialize";
import { RequireGuest } from "./components/common/ProtectedRoute";
import RequireUser from "./components/common/RequireUser";
import RequireAdmin from "./components/common/RequireAdmin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminHome from "./components/admin/AdminHome";
import CheckoutPage from "./pages/CheckoutPage";

function App() {
  const location = useLocation();

  // Initialize auth state và auto-fetch user profile nếu có token
  useAuthInitialize();

  const [showIntro, setShowIntro] = useState(
    localStorage.getItem("hasVisited") !== "true" && location.pathname === "/"
  );

  if (showIntro && location.pathname === "/") {
    localStorage.setItem("hasVisited", "true");
  }

  return (
    <div className="relative">
      <Routes>
        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }>
          <Route index element={<AdminHome />} />
        </Route>

        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/search-ticket" element={<SearchTicket />} />
          <Route path="/become-partner" element={<BecomePartnerPage />} />

          <Route
            path="/information-checkout"
            element={
              <RequireUser>
                <InformationCheckoutPage />
              </RequireUser>
            }
          />
          <Route 
            path="/method-checkout" 
            element={
              <RequireUser>
                <MethodCheckoutPage />
              </RequireUser>
            } 
          />
          <Route 
            path="/checkout-progress" 
            element={
              <RequireUser>
                <CheckoutPage />
              </RequireUser>
            } 
          />
          <Route 
            path="/payment-success" 
            element={
              <RequireUser>
                <PaymentSuccess />
              </RequireUser>
            } 
          />
        </Route>

        <Route 
          path="/sign" 
          element={
            <RequireGuest>
              <SignPage />
            </RequireGuest>
          } 
        />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
      {showIntro && <IntroScreen onFinish={() => setShowIntro(false)} />}
    </div>
  );
}

export default App;
