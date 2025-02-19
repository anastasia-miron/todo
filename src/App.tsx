import { Route, Routes } from "react-router";
import "./App.css";
import NotFoundPage from "./pages/NotFoundPage";
import LandingPage from "./pages/LandingPage";
import AppLayout from "./components/AppLayout";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import PasswordRecoveryPage from "./pages/PasswordRecoveryPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import UserTypePage from "./pages/UserTypePage";
import SettingsPage from "./pages/SettingsPage.tsx";
import HistoryPage from "./pages/HistoryPage.tsx";
import ReviewListPage from "./pages/ReviewListPage.tsx";
import RequestListPage from "./pages/RequestListPage.tsx";
import ProfilePage from "./pages/ProfilePage";
import RequestPage from "./pages/RequestPage";
import ReviewPage from "./pages/ReviewPage";
import UserPage from "./pages/UserPage.tsx";


export default function Profile() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
      <Route path="/password-change" element={<ChangePasswordPage />} />
      <Route path="/app" element={<AppLayout />} >
        <Route path="/app/user-type" element={<UserTypePage />} />
        <Route path="/app/profile" element={<ProfilePage />} />
        <Route path="/app/settings" element={<SettingsPage />} />
        <Route path="/app/history" element={<HistoryPage />} />
        <Route path="/app/" element={<RequestListPage />} />
        <Route path="/app/requests/:id" element={<RequestPage />} />
        <Route path="/app/reviews/:id" element={<ReviewPage />} />
        <Route path="/app/reviews" element={<ReviewListPage />} />
        <Route path="/app/user/:username" element={<UserPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
