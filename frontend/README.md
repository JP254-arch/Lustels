# Lustels – Smart Hostel Management System

![Lustels Logo](./src/assets/logo.jpeg)

**Lustels** is a modern, secure, and efficient hostel management system designed for schools and institutions. It streamlines student management, room allocation, fee tracking, and communication between admins, wardens, and residents.  

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Folder Structure](#folder-structure)  
- [API Endpoints](#api-endpoints)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features

### Core System Features
- **Role-Based Dashboards**  
  Separate dashboards for Admin, Warden, and Residents with role-specific functionalities.

- **Resident Management**  
  Track students, assign rooms, monitor status, and manage check-ins/check-outs.

- **Hostel Management**  
  Create and manage hostels, room types, and capacities.

- **Fee Management**  
  Track monthly fees, payments, balances, and generate financial reports.

- **Leave & Notices**  
  Residents can submit leave requests and receive official notices from admins or wardens.

- **Secure Authentication**  
  JWT-based authentication with role-based access control.

- **Modern & Responsive UI**  
  Fully responsive UI for desktop and mobile using React and TailwindCSS.

- **Search & Quick Links**  
  Easy navigation with search functionality for hostels and student records.

- **Notifications & Alerts**  
  Visual feedback for successful operations and errors.

- **Dashboard Analytics** *(Optional)*  
  Quick stats for rooms, payments, and resident activity.

---

## Tech Stack

**Frontend:**  
- React.js  
- TailwindCSS  
- React Router DOM  
- FontAwesome Icons  

**Backend:**  
- Node.js  
- Express.js  
- MongoDB & Mongoose  
- JWT Authentication  
- bcrypt for password hashing  

**Tools & Utilities:**  
- Axios for API requests  
- ESLint / Prettier for code formatting  

---

## Installation

### Prerequisites
- Node.js >= 18.x  
- MongoDB (local or cloud)  
- npm or yarn  

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/your-username/lustels.git
cd lustels

### instalation

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

## running the application
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm start
