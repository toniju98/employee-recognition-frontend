# Employee Recognition System

A modern, full-stack employee recognition platform built with React, TypeScript, and Keycloak authentication. This application allows organizations to create, manage, and track employee recognitions with a points-based reward system.

## 🚀 Features

- **User Authentication**: Secure login with Keycloak integration
- **Recognition Management**: Create and view employee recognitions
- **Points System**: Award points for different types of recognitions
- **User Profiles**: Manage user information and profile images
- **Real-time Updates**: Live recognition feed with instant updates
- **Responsive Design**: Modern UI that works on all devices
- **Role-based Access**: Different permissions for admin and regular users

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for modern UI components
- **Vite** for fast development and building
- **React Router** for navigation
- **Axios** for API communication
- **Keycloak-js** for authentication

### Backend Integration
- **RESTful API** integration
- **JWT Token** authentication
- **File upload** support for profile images
- **CORS** enabled for cross-origin requests

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Keycloak Server** running (for authentication)
- **Backend API** running (for data management)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd employee-recognition
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=employee-recognition
VITE_KEYCLOAK_CLIENT_ID=employee-recognition-frontend
```

### 4. Keycloak Setup

Run the Keycloak setup script to configure the frontend client:

```bash
node setup-keycloak.js
```

Or set environment variables for non-interactive setup:

```bash
$env:KEYCLOAK_USERNAME="admin"
$env:KEYCLOAK_PASSWORD="admin"
node setup-keycloak.js
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard-specific components
│   ├── recognition/    # Recognition-related components
│   └── profile/        # Profile management components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   ├── auth/           # Authentication utilities
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Helper functions
├── pages/              # Page components
└── App.tsx             # Main application component
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication

This application uses Keycloak for authentication. Users must:

1. Have a valid Keycloak account
2. Be assigned to the appropriate realm
3. Have the necessary roles for the application

## 📱 Features Overview

### Dashboard
- View all recognitions in a feed
- Create new recognitions
- Real-time updates

### Recognition Management
- Create recognitions with categories (Teamwork, Innovation, Excellence, Customer Service)
- Award points (1-10 points)
- Add personalized messages
- Select recipients from organization

### User Management
- View user profiles
- Upload profile images
- Manage user information

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliant components

## 🔧 Configuration

### Vite Configuration
The application uses Vite with the following proxies:
- `/api` → Backend API server
- `/uploads` → File uploads

### Keycloak Configuration
- PKCE enabled for security
- Automatic token refresh
- Secure logout handling

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_KEYCLOAK_URL=https://your-keycloak-domain.com
VITE_KEYCLOAK_REALM=your-realm
VITE_KEYCLOAK_CLIENT_ID=your-client-id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Open an issue in the repository

## 🎯 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Integration with HR systems
- [ ] Advanced reporting features