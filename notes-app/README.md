# Meazy Notes — AWS Notes App

A cloud-deployed notes application built to practise AWS infrastructure, backend development, database integration, and Linux server administration.

## Project Overview

Meazy Notes is a web application that allows users to create, view, update, and delete notes. The application is deployed on Amazon EC2, uses Nginx as a reverse proxy, runs on Node.js and Express, and stores notes in an Amazon RDS MySQL database.

This project demonstrates practical experience connecting an application server to a managed relational database in AWS.

## Architecture

```text
User's Browser
      |
      | HTTP (Port 80)
      v
Amazon EC2
  ├── Nginx (Reverse Proxy)
  └── Node.js / Express (Port 3000)
              |
              | MySQL (Port 3306)
              v
       Amazon RDS
        MySQL Database
```

## Technologies Used

- **Amazon EC2:** Hosts the application.
- **Amazon RDS for MySQL:** Stores notes in a managed relational database.
- **Nginx:** Receives HTTP requests and forwards them to the Node.js application.
- **Node.js:** JavaScript runtime for the backend.
- **Express.js:** Handles application routes and API requests.
- **MySQL2:** Connects the backend to MySQL.
- **PM2:** Keeps the Node.js application running as a managed process.
- **Git and GitHub:** Version control and source code hosting.
- **Ubuntu Linux:** Server operating system.

## Features

- Create notes with a title and content.
- Retrieve saved notes from the database.
- Update existing notes.
- Delete notes.
- Responsive web interface.
- API-based communication between the frontend and backend.
- Persistent note storage using Amazon RDS.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/notes` | Retrieve notes |
| POST | `/api/notes` | Create a note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |

## Deployment Summary

1. Provisioned an Ubuntu EC2 instance.
2. Configured security group rules for SSH and HTTP access.
3. Installed Node.js, Nginx, and PM2.
4. Configured an Amazon RDS MySQL database.
5. Connected the application to RDS using environment variables.
6. Configured Nginx as a reverse proxy to the Express application.
7. Managed the application process with PM2.
8. Tested database connectivity and CRUD operations.
9. Synchronized project changes with GitHub.

## Security Considerations

- Database credentials are stored in an environment file and must not be committed to GitHub.
- The RDS security group permits database access from the EC2 security group rather than exposing MySQL publicly.
- The Node.js application port is not intended to be publicly accessible.
- SSH access should be restricted to trusted IP addresses.
- HTTPS has not yet been configured.

## Cost Management

A manual RDS snapshot named `meazy-notes-before-stop` was created before stopping the database instance.

The RDS instance was stopped to reduce instance-hour charges while it is not being used for learning. Storage and backup charges may continue, and stopped RDS instances automatically restart after seven consecutive days.

## Key Learning Outcomes

Through this project, I practised:

- Deploying a Node.js application on Amazon EC2.
- Connecting an application to Amazon RDS MySQL.
- Configuring Nginx as a reverse proxy.
- Managing application processes with PM2.
- Configuring AWS security groups and database connectivity.
- Testing REST API CRUD operations.
- Using Git and GitHub to manage project changes.
- Taking database snapshots and managing AWS costs.

## Future Improvements

- Configure HTTPS with a domain and TLS certificate.
- Add user authentication and authorization.
- Improve input validation and error handling.
- Add automated testing and deployment.
- Implement additional monitoring and security controls.

## Author

**Azeez Sodiq Oluwasegun (MeazyBrain)**

GitHub: [Meazybrain](https://github.com/Meazybrain)
