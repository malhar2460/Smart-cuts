# Object-Context-Information – SmartCuts System

A breakdown of key concepts in the SmartCuts salon booking system.

## 1. Customer

- **Context:** Using the system to book and manage appointments.
- **Information:**
  - Name
  - Contact Info
  - Login Credentials
  - Booking History
  - Reviews

## 2. Admin

- **Context:** Managing overall operations, staff, and services.
- **Information:**
  - Admin Credentials
  - List of Services
  - Staff Assignments
  - Appointment Overview

## 3. Staff

- **Context:** Viewing schedules and managing availability.
- **Information:**
  - Name
  - Role
  - Availability Timings
  - Assigned Appointments

## 4. Appointment

- **Context:** Represents a booking between customer and staff.
- **Information:**
  - Appointment ID
  - Date & Time
  - Customer ID
  - Staff ID
  - Service ID
  - Status (Scheduled, Completed, Cancelled)

## 5. Service

- **Context:** The actual salon service being booked.
- **Information:**
  - Name
  - Duration
  - Price
  - Category (Hair, Skin, Nails, etc.)

## 6. Payment

- **Context:** Completing a transaction for an appointment.
- **Information:**
  - Payment ID
  - Appointment ID
  - Amount
  - Method (Card, UPI, Cash)
  - Date

## 7. Review

- **Context:** Customer feedback post service.
- **Information:**
  - Rating (1–5)
  - Comments
  - Related Service ID
  - Customer ID

## 8. Authentication

- **Context:** Logging in and validating users.
- **Information:**
  - Email/Username
  - Password (encrypted)
  - User Role (Customer, Admin, Staff)

<br/><br/>

# CRC Cards - SmartCuts System

---

## **Customer**

**Responsibilities:**
- Register/Login  
- Book Appointment  
- View Services  
- Make Payment  
- Give Review  

**Collaborators:**
- Appointment  
- Service  
- Payment  
- Review  
- Authentication  

---

## **Admin**

**Responsibilities:**
- Manage Appointments  
- Manage Staff  
- Add/Edit Services  
- Assign Staff  

**Collaborators:**
- Appointment  
- Staff  
- Service  
- Review  
- Authentication  

---

## **Staff**

**Responsibilities:**
- Login  
- View Schedule  
- Update Availability  

**Collaborators:**
- Appointment  
- Admin  
- Authentication  

---

## **Appointment**

**Responsibilities:**
- Store Booking Info  
- Link Service/Customer/Staff  
- Update Status  

**Collaborators:**
- Customer  
- Admin  
- Staff  
- Service  

---

## **Service**

**Responsibilities:**
- Maintain Service Info  
- Price, Duration, Category  

**Collaborators:**
- Admin  
- Appointment  
- Customer  

---

## **Payment**

**Responsibilities:**
- Record Payment Info  
- Method, Amount, Date  

**Collaborators:**
- Appointment  
- Customer  

---

## **Review**

**Responsibilities:**
- Store Ratings & Comments  

**Collaborators:**
- Customer  
- Admin  
- Service  

---

## **StaffManagement**

**Responsibilities:**
- Add/Edit Staff  
- Set Availability  

**Collaborators:**
- Admin  
- Staff  

---

## **Authentication**

**Responsibilities:**
- Handle Login/Register  
- Validate Credentials  

**Collaborators:**
- Customer  
- Admin  
- Staff  
