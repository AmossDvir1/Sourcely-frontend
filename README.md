# Sourcely Frontend Project

## Table of Contents
- [1. Introduction](#1-introduction)
- [2. Key Features](#2-key-features)
- [3. Technologies Used](#3-technologies-used)
- [4. Setup & Running](#4-setup--running)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
  - [Building for Production](#building-for-production)
- [5. Project Structure Highlights](#5-project-structure-highlights)
- [6. Theming](#6-theming)
- [7. Authentication](#7-authentication)
- [8. Components Overview](#8-components-overview)
- [9. Testing](#9-testing)
- [10. Deployment](#10-deployment)

---

## 1. Introduction

This project is the frontend application for "Sourcely," an AI-powered tool designed to provide developers with in-depth insights into public GitHub repositories. It features AI-generated summaries, setup instructions, architecture overviews, and a real-time chat interface for detailed code analysis. Sourcely aims to assist software developers, students, and anyone interested in efficiently understanding and analyzing open-source code.

## 2. Key Features

*   **Repository Analysis:** Users can input a GitHub repository URL to initiate an AI-driven code analysis.
*   **AI-Powered Summarization:** Generates AI-powered summaries, setup instructions, and architecture overviews of analyzed repositories.
*   **Settings and Model Selection:** Provides options to select the type of content to analyze and choose different AI models.
*   **User Authentication:** Includes comprehensive login, registration, and authentication flows to secure user-specific data and analyses.
*   **Saved Analyses:** Users have the ability to save their analyses and review them later.
*   **Chat Interface:** Offers a real-time chat feature for interactive discussions about the repository code with an AI bot.
*   **Theming:** Supports both light and dark themes, providing a customizable user experience.

## 3. Technologies Used

The Sourcely frontend is built with a modern stack, emphasizing performance, scalability, and developer experience:

*   **Languages:** TypeScript, JavaScript, CSS
*   **Frameworks/Libraries:**
    *   **React:** For building the user interface.
    *   **Vite:** As a fast build tool and development server.
    *   **Tailwind CSS:** For utility-first CSS styling.
    *   **MUI (Material UI):** A React component library for pre-designed UI elements.
    *   **React Router DOM:** For client-side routing.
    *   **Axios:** For making HTTP requests to the backend API.
    *   **Framer Motion:** For animations and transitions, enhancing the user experience.
    *   **React Markdown:** For rendering Markdown content (e.g., AI-generated summaries).
    *   **React Type Animation:** For animated text effects.
    *   **Socket.IO-Client:** For real-time communication in the chat feature.
*   **Build Tool:** Vite
*   **Code Quality:** ESLint, Prettier (implicitly configured for code formatting).

## 4. Setup & Running

To get the Sourcely frontend project up and running on your local machine:

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (comes with Node.js), yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [repository URL] # Replace with the actual repository URL
    cd sourcely-frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install # or `yarn install` or `pnpm install`
    ```

### Running the Development Server

To start the development server with hot-reloading:

```bash
npm run dev
```
The application will typically be accessible at `http://localhost:5173/` (or a similar address, displayed in your console).

### Building for Production

To create an optimized production build of the application:

```bash
npm run build
```
This command will generate the minified and optimized assets in the `dist` directory.

## 5. Project Structure Highlights

The project follows a standard React application structure, organized for maintainability:

*   `src/components/`: Reusable UI components (e.g., `RepoCard.tsx`, `Layout.tsx`).
*   `src/pages/`: Top-level page components (e.g., `Step1_RepoInput.tsx`, `RegisterToSaveDialog.tsx`).
*   `src/constants.ts`: Contains application-wide constants like `AUTH_TOKEN_KEY` and `THEME_MODE_KEY`.
*   `src/context/`: React Context providers (e.g., `AuthContext.tsx`, `ThemeContext.tsx`).
*   `src/App.css`: Global CSS variables for theming and other base styles.
*   `src/main.tsx`: The entry point of the React application, handling global setup like routing and providers.
*   `vite.config.ts`: Vite configuration for building and development.
*   `eslint.config.js`: ESLint configuration for code linting.

## 6. Theming

Sourcely supports dynamic theming (light/dark mode) facilitated by:

*   **`CustomThemeProvider` and `ThemeContext.tsx`:** Manages the active theme mode.
*   **`src/App.css`:** Defines CSS custom properties (variables) for colors and other stylistic elements. These variables are conditionally overridden in the `.dark` class for dark mode, ensuring theme-aware styling across the application. Examples include `--color-primary`, `--color-bg-default`, `--color-text-primary`, and various shadow and border colors.

## 7. Authentication

The application includes a robust authentication system:

*   **`AuthContext.tsx`:** Manages user authentication state and provides login/logout functionalities.
*   **`AUTH_TOKEN_KEY` (from `src/constants.ts`):** Defines the key used to store the access token in local storage.
*   **`RegisterToSaveDialog.tsx`:** A component likely used to prompt users to register or log in to save their analyses.

## 8. Components Overview

Key components responsible for the application's functionality include:

*   **`RepoCard.tsx`:** Displays information about a saved repository analysis.
*   **`Layout.tsx`:** Provides the overall structure of the application, including headers, the main content area, and a theme-aware footer.
*   **`RegisterToSaveDialog.tsx`:** A dialog for user registration/login.
*   **`Step1_RepoInput.tsx`:** The initial step where users input a GitHub repository URL and choose to analyze or chat.
*   **`Step2_ModelSelection.tsx`:** Displays the repository URL being analyzed and allows for content rendering based on AI models.
*   **`Step2_AiSettings.tsx`:** Allows users to configure AI model settings before initiating analysis.

## 9. Testing

Based on the provided context, the project currently lacks explicit unit or integration tests. A formal testing strategy is not defined within the given codebase, resulting in effectively 0% test coverage.

## 10. Deployment

The project includes a `vercel.json` configuration file, indicating that it is configured for deployment on Vercel. The rewrite rules ensure that all routes are handled by `index.html`, which is typical for single-page applications.
