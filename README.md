EduMerge Admission System - Frontend
Overview
EduMerge Admission System is a comprehensive frontend application for managing educational institution admissions. The system provides role-based access for administrators, officers, and management personnel to handle the complete admission lifecycle including applicant management, seat allocation, document verification, fee tracking, and admission confirmation.

Features
Authentication & Authorization
Secure login with JWT token-based authentication

Role-based access control (Admin, Officer, Management)

Persistent session management using localStorage

Protected routes for authenticated users only

Dashboard
Real-time statistics with summary cards (Total Intake, Total Admitted, Remaining Seats, Pending Documents)

Interactive charts using Recharts library (Bar charts and Pie charts for quota-wise analysis)

Program-wise seat availability table

Pending documents list

Fee pending applicants list

Master Data Management
Institutions: Create and manage educational institutions

Campuses: Manage campuses under institutions

Departments: Create departments under campuses

Programs: Comprehensive program management with:

Course type (UG/PG)

Entry type (Regular/Lateral)

Admission mode (Government/Management)

Academic year

Total intake capacity

Quota-wise seat allocation (KCET, COMEDK, Management)

Applicant Management
Create new applicants with complete profile information

Track applicant status (Pending/Allocated/Confirmed)

Document verification workflow (Pending/Submitted/Verified)

Fee status tracking (Pending/Paid)

View applicant details including program allocation and marks

Seat Allocation
Quota-wise seat availability checking

Allocate seats to applicants based on program and quota

Generate allotment numbers

Real-time availability updates

Prevent overallocation with seat capacity validation

Admission Workflow
Applicant creation with document submission

Seat allocation with allotment number

Fee payment tracking

Document verification

Final admission confirmation with admission number generation

Technology Stack
Framework: React 19.2.4

Routing: React Router DOM 7.13.2

Styling: Tailwind CSS 4.2.2

Charts: Recharts 3.8.1

Notifications: React Hot Toast 2.6.0

Build Tool: Vite 8.0.1

HTTP Client: Native Fetch API

Prerequisites
Node.js (v18 or higher recommended)

npm or yarn package manager

Backend API server running on http://localhost:5000

Installation & Setup
1. Clone the Repository
bash
git clone <repository-url>
cd admission-management-system
2. Install Dependencies
bash
npm install
3. Environment Configuration
Create a .env file in the root directory (optional - API URL is hardcoded in the application):

env
VITE_API_URL=http://localhost:5000/api
Note: The API URL is currently hardcoded as http://localhost:5000/api in the components. To make it configurable, you can modify the components to use environment variables.

4. Run the Development Server
bash
npm run dev
The application will be available at http://localhost:5173 (default Vite port).

5. Build for Production
bash
npm run build
The build artifacts will be in the dist directory.

6. Preview Production Build
bash
npm run preview
Project Structure
text
admission-management-system/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout component with navigation
│   │   └── PrivateRoute.jsx    # Route protection component
│   ├── contexts/
│   │   └── AuthContext.jsx     # Authentication context provider
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Dashboard.jsx       # Dashboard with analytics
│   │   ├── Programs.jsx        # Master data management
│   │   ├── Applicants.jsx      # Applicant management
│   │   └── Allocation.jsx      # Seat allocation interface
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles with Tailwind
├── public/                    # Static assets
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── README.md                # Documentation
Available Scripts
Command	Description
npm run dev	Start development server
npm run build	Build for production
npm run preview	Preview production build
npm run lint	Run ESLint for code quality
API Integration
The frontend communicates with a backend REST API running on http://localhost:5000/api. The following endpoints are used:

Endpoint	Method	Purpose
/api/auth/login	POST	User authentication
/api/dashboard	GET	Dashboard statistics
/api/applicants	GET/POST	Applicant management
/api/masters/programs	GET/POST	Program management
/api/masters/institutions	GET/POST	Institution management
/api/masters/campuses	GET/POST	Campus management
/api/masters/departments	GET/POST	Department management
/api/allocation/availability/:programId/:quotaType	GET	Check seat availability
/api/allocation/allocate	POST	Allocate seat to applicant
/api/allocation/confirm/:applicantId	POST	Confirm admission
/api/allocation/:applicantId/fee	PATCH	Update fee status
/api/applicants/:applicantId/documents	PATCH	Update document status
Authentication Flow
User submits login credentials

Backend validates and returns JWT token and user data

Token and user data are stored in localStorage

Subsequent API requests include the token in Authorization header

Protected routes check for token presence

Logout clears localStorage and redirects to login

Role-Based Access
Admin & Officer
Full access to all modules

Dashboard, Programs, Applicants, Allocation pages

Management
Limited to Dashboard view only

Read-only access to admission statistics

Key Features Implementation
Seat Allocation Logic
Validates seat availability before allocation

Checks quota-wise remaining seats

Prevents overallocation beyond total intake

Generates unique allotment numbers

Document Verification Workflow
Tracks three statuses: Pending → Submitted → Verified

Real-time status updates

Visual indicators for document status

Fee Management
Tracks fee payment status (Pending/Paid)

Only fee-paid applicants can be confirmed for admission

Generates admission number upon confirmation

Styling
The application uses Tailwind CSS 4.2.2 with the following configuration:

Custom color scheme with blue primary colors

Responsive design with mobile-first approach

Card-based UI with shadow effects

Modal dialogs for forms

Status badges with color coding

Browser Support
Chrome (latest)

Firefox (latest)

Safari (latest)

Edge (latest)

Troubleshooting
Common Issues
API Connection Error

Ensure backend server is running on http://localhost:5000

Check if API endpoints are accessible

Verify CORS configuration on backend

Authentication Issues

Clear browser localStorage

Check token expiration

Verify user credentials

Build Errors

Delete node_modules and reinstall dependencies

Clear Vite cache: npm run dev -- --force

Development Guidelines
Adding New Pages
Create component in src/pages/

Add route in App.jsx

Update navigation in Layout.jsx if needed

Add role-based access control

API Calls
Use fetch API with Authorization header

Handle loading and error states

Show toast notifications for user feedback

State Management
Use React Context for authentication state

Local component state for page-specific data

Props for component communication

Future Enhancements
Add pagination for large data sets

Implement search and filtering

Add export functionality (PDF/Excel)

Integrate real-time notifications

Add bulk operations for applicants

Implement dark mode

Add unit and integration tests

PWA support for mobile devices

Contributing
Fork the repository

Create a feature branch

Commit changes with descriptive messages

Push to the branch

Create a Pull Request

License
This project is proprietary and confidential.

Contact
For support or queries, please contact the development team.

Note: This frontend application requires the backend API to be running. Make sure to start the backend server before running the frontend application.
