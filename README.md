# Task-Tracker

Task-Tracker is a minimalistic task management app built within 2 evenings to practice NestJS framework. It offers a suite of functionalities for task management, secured with JWT-based role-based authorization.

## Features

- **Tasks CRUD**: Create, Read, Update, and Delete operations for task management.

  - Create new tasks with details like title, description, due date, and priority.
  - Read or retrieve tasks with various filtering options.
  - Update existing tasks to modify their details.
  - Delete tasks that are no longer needed.

- **JWT Role-Based Authorization**:
  - Secure API endpoints with JWT (JSON Web Tokens).
  - Role-based access control for different types of users (e.g., Admin, Regular User).
  - Secure routes to ensure that only authenticated and authorized users can access certain functionalities.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

- [Node.js](https://nodejs.org/en/)
- [NestJS CLI](https://docs.nestjs.com/cli/overview)
- [Docker](https://docs.docker.com/engine/install/ubuntu/)
- [docker-compose](https://docs.docker.com/compose/install/linux/)

### Installing

A step-by-step series of examples that tell you how to get a development environment running:

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/task-tracker.git
cd task-tracker
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

Create a .env file in the root directory and fill in your database credentials and JWT secret according to .env.example file.

4. **Database Setup:**

Ensure that your PostgreSQL database is running and accessible. You will need to start docker container using docker-compose.

```bash
docker-compose up -d
```

5. **Start the Application:**

```bash
npm run start:dev
```
