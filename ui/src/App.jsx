import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import CoursesPage from "./pages/CoursesPage";
// import NotFoundPage from "./pages/NotFoundPage";
// import ContactPage from "./pages/ContactPage";
// import AddCoursePage from "./pages/AddCoursePage";
import MainLayout from "./layouts/MainLayout";
// import CoursePage, { courseLoader } from "./pages/CoursePage";
// import EditCoursePage from "./pages/EditCoursePage";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import IndexPage from "./pages/IndexPage";
import MainPage from "./pages/MainPage";
// import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import AddDoctorPage from "./pages/AddDoctorPage";
import ViewProfilePage from "./pages/ViewProfilePage";
import ViewDoctorPage from "./pages/ViewDoctorPage";
import AddAppointmentPage from "./pages/AddAppointmentPage";
import EditDoctorPage from "./pages/EditDoctorPage";
import AddUserPage from "./pages/AddUserPage";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />}/>
        </Route>

        <Route path="/" element={<MainLayout />}>
          <Route path="/home" element={<IndexPage />} />
          <Route path="/profile" element={<ViewProfilePage />}/>
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/doctors" element={<ViewDoctorPage />} />
          <Route path="/add-doctor" element={<AddDoctorPage />} />
          <Route path="/add-user" element={<AddUserPage />} />
          <Route path="/add-appointment" element={<AddAppointmentPage />} />
          <Route path="/edit-doctor/:doctorId" element={<EditDoctorPage />} />
        </Route>
      </>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
