# BookMyConsult

BookMyConsult is a web application designed to streamline the process of booking consultations with doctors. Built using the MERN stack (MongoDB, Express.js, React, and Node.js) and Docker for containerization, this application provides a platform for patients to book appointments with available doctors, search for doctors by specialization, and manage their appointments. It uses Role-Based Access Control (RBAC) with three roles: Admin, Patients (User). The application is built with the MERN stack and Docker for seamless functionality, ensuring a secure and efficient experience for all users.

## 🔑 FEATURES

### 👤 For Patients:
- **Login & Signup**: Secure user authentication.
- **View Available Doctors**: Browse a list of available doctors and their specializations.
- **Search by Specialization**: Find doctors based on their area of expertise.
- **Book Appointments**: Schedule consultations with preferred doctors.
- **Cancel Appointments**: Cancel any booked appointments easily.
- **Edit Profile**: Update personal profile information.

### 🔒 For Administrators:
- **Administrator Login**: Secure admin authentication through admin passphrase.
- **Add Doctors**: Add new doctors to the application, specifying their specialization and available time slots.
- **Edit Doctor Details**: Modify existing doctor information, including available dates and times.
- **Delete Doctors**: Remove doctors from the system as needed.

- **Admin Email**: admin@gmail.com
- **Admin Password**: admin

## Tech Stack

- **Frontend:** ReactJS
- **Backend:** Node.js with ExpressJS
- **Database:** MongoDB
- **Containerization:** Docker

## 🛠️ Other Tools

- **JWT (JSON Web Tokens):** Secures user authentication and manages sessions.
- **RBAC:** Limits functionality based on roles (admin, Patients(user)).

## 🚀 GETTING STARTED
```
1.Clone the Repository  git clone <repository-url>

2.Docker Setup
      docker-compose up --build
3.Accessing the Application
      Once the containers are up and running, you can access the application at:localhost:3000
```
- **Open your web browser and navigate to**
```
http://localhost:3000
```
**to view the application.**




