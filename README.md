# MyWorkoutPro

This repository contains both the backend and frontend code for **MyWorkoutPro**, a comprehensive workout tracking application designed to help users plan, execute, and monitor their workout routines effectively. The app is built with a React Native frontend and an Express.js backend, utilizing MongoDB for data storage. The entire application can be run using Docker for a streamlined setup and deployment process.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Workout Calendar**: View and schedule workouts on a calendar interface.
- **Dynamic Workouts**: Upload workout plans, dynamically parse, and display them on the app.
- **Exercise Tracking**: Track sets, reps, weight, and RPE during workouts.
- **Timer Integration**: Start and stop workouts with a built-in timer.
- **Progress Monitoring**: Save workout progress to MongoDB and retrieve it for future sessions.
- **Responsive Design**: Mobile-first design with React Native, optimized for iOS devices.
- **Dockerized Setup**: Simplified deployment using Docker for both backend and database.

## Technologies Used

- **Frontend**: 
  - React Native
  - Axios
  - React Navigation
  - Native UI Components
  
- **Backend**: 
  - Node.js with Express.js
  - MongoDB (with Mongoose)
  - Multer for file uploads
  - XLSX for Excel file parsing
  
- **Database**: 
  - MongoDB, running in a Docker container

- **DevOps**:
  - Docker for containerization

## Setup and Installation

### Prerequisites

- Node.js (v14+)
- Docker
- React Native CLI

### Clone the Repository

```bash
git clone https://github.com/asimak4/myworkoutpro.git
cd myworkoutpro
