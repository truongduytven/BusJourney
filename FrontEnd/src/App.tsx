import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home";
import UserLayout from "./layouts/userLayout";
import ErrorPage from "./pages/errorPage";
import SearchPage from "./pages/searchPage";
import { useEffect, useState } from "react";
import IntroScreen from "./pages/introPage";
import SearchTicket from "./pages/searchTicket";
import SignPage from "./pages/auth/signPage";
import { useAppDispatch } from "./redux/hook";
import { fetchCities } from "./redux/slices/citySlice";
import InformationCheckoutPage from "./pages/informationCheckoutPage";
import MethodCheckoutPage from "./pages/methodCheckoutPage";
import PaymentSuccess from "./pages/paymentSucces";
import BecomePartnerPage from "./pages/partner";

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const [showIntro, setShowIntro] = useState(
    localStorage.getItem("hasVisited") !== "true" && location.pathname === "/"
  );

  if (showIntro && location.pathname === "/") {
    localStorage.setItem("hasVisited", "true");
  }

  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  return (
    <div className="relative">
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/search-ticket" element={<SearchTicket />} />
          <Route path="/become-partner" element={<BecomePartnerPage />} />
          <Route
            path="/information-checkout"
            element={<InformationCheckoutPage />}
          />
        </Route>
        <Route path="/method-checkout" element={<MethodCheckoutPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        <Route path="/sign" element={<SignPage />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
      {showIntro && <IntroScreen onFinish={() => setShowIntro(false)} />}
    </div>
  );
}

export default App;
