import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/User/home";
import UserLayout from "./layouts/userLayout";
import ErrorPage from "./pages/User/errorPage";
import SearchPage from "./pages/User/searchPage";
import { useState } from "react";
import IntroScreen from "./pages/User/introPage";
import SearchTicket from "./pages/User/searchTicket";
import SignPage from "./pages/auth/signPage";
import InformationCheckoutPage from "./pages/User/informationCheckoutPage";
import MethodCheckoutPage from "./pages/User/methodCheckoutPage";
import PaymentSuccess from "./pages/User/paymentSucces";
import BecomePartnerPage from "./pages/User/partner";
import { useAuthInitialize } from "./hooks/useAuthInitialize";
import { RequireGuest } from "./components/common/ProtectedRoute";
import RequireUser from "./components/common/RequireUser";
import RequireAdmin from "./components/common/RequireAdmin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminHome from "./components/admin/AdminHome";
import CheckoutPage from "./pages/User/CheckoutPage";
import { CustomersPage } from "./pages/Admin/customer/customersPage";
import { CitiesPage } from "./pages/Admin/city/citiesPage";
import { LocationsPage } from "./pages/Admin/location/locationsPage";

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
          <Route path="users" element={<CustomersPage />} />
          <Route path="cities" element={<CitiesPage />} />
          <Route path="locations" element={<LocationsPage />} />
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
