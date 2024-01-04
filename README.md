# TMS - Task Management System (Backend)

Your Personal Task Management System.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)

## About

A handy task management system in which users can create tasks for their reference. The backend part of this project is built using Express.js and uses MongoDB Atlas as a persistent storage. It features authentication using JSON Web Token and password encryption using Bcrypt.js Library. Users can create, update and delete tasks as per requirement, and access them securely as and when required.  

This repository contains the backend part of the TMS web application. You can refer the frontend part here: https://github.com/RohanRana10/tms_frontend.git

## Features

- Authentication using JSON Web Token.
- Password encryption using Bcrypt.js.
- Presistent cloud storage using MongoDb Atlas.

## Installation

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)

### Clone the Repository

git clone https://github.com/RohanRana10/tms_backend.git  
cd tms_backend   
npm install  

## Setting up Environment Variables

1. Copy the contents of `.env.example` to a new file named `.env`.
2. Replace the placeholder values with your actual JWT secret and database URL.

## Run the Application

npm start
