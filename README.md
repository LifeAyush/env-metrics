# Metrics Frontend ![React](https://img.shields.io/badge/React-19.1.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue) ![Ant Design](https://img.shields.io/badge/Ant%20Design-5.26.5-green) ![Vite](https://img.shields.io/badge/Vite-7.0.4-orange)

A modern React-based frontend application for managing and visualizing environmental metrics data. Built with TypeScript, Ant Design, and Vite.

## Features

- **Authentication & Authorization**: JWT-based authentication with secure token management
- **Metrics Management**: CRUD operations for environmental metrics (Energy, Water, Waste)
- **Responsive Design**: Mobile-friendly interface with Ant Design components
- **URL State Management**: Filter and sort state persisted in URL parameters
- **Data Visualization**: Interactive charts and trend analysis with Recharts
- **Global Toast Notifications**: Centralized error and success messaging
- **Protected Routes**: Authentication-based route protection
- **Service Layer Architecture**: Modular API service structure

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd metrics-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## Configuration

### Required Environment Variables

Create a `.env` file with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Environment
NODE_ENV=development
```

## Running the Application

### Development Mode

1. **Start the development server**

   ```bash
   npm run dev
   ```

2. **Build for production**

   ```bash
   npm run build
   ```

3. **Preview production build**

   ```bash
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Architecture

### Service Layer
The application uses a modular service layer for API communication:

- **`api.ts`**: Base axios configuration with interceptors
- **`auth.ts`**: Authentication-related API calls
- **`metrics.ts`**: Metrics CRUD operations

### State Management
- **Context API**: For global authentication state
- **URL State**: Filter and sort state managed in URL parameters
- **Local State**: Component-specific state using React hooks

### Error Handling
- **Centralized Error Handling**: All API errors handled through `apiErrorHandler`
- **Toast Notifications**: User-friendly error and success messages
- **Graceful Degradation**: Fallback to dummy data when API fails

## UI/UX Features

### Ant Design Integration
- Consistent design system
- Responsive components
- Accessibility features
- Dark/light theme support

### Data Visualization
- Recharts integration for trend graphs
- Interactive charts in metric drawer
- Responsive chart containers

### User Experience
- Loading states for all async operations
- Form validation with helpful error messages
- Keyboard navigation support
- Mobile-responsive design

## Security Features

- **JWT Token Management**: Secure token storage and handling
- **Protected Routes**: Authentication-based access control
- **API Interceptors**: Automatic token injection and error handling
- **Input Validation**: Client-side and server-side validation

