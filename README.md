# Gather

A modern full-stack event planning application that allows users to create hangouts, share invitation links, and manage RSVPs through a responsive web interface.

Gather was built as a portfolio project to demonstrate production-style full-stack software engineering using React, Java, Spring Boot, PostgreSQL, and JWT authentication.

---

## Highlights

- Full-stack application built with React and Spring Boot
- Secure JWT authentication with BCrypt password hashing
- PostgreSQL database with Flyway migrations
- Public RSVP flow that does not require guest accounts
- QR code and shareable invitation links
- Responsive web interface
- RESTful API architecture

---

## Features

### Authentication

- User registration
- Secure login
- JWT-based authentication
- Password encryption using BCrypt

### Hangout Management

- Create new hangouts
- View all created hangouts
- View detailed event information
- Generate unique invite links
- QR code generation for invitations

### Public RSVP

Guests do not need an account.

Using the shared invite link, guests can:

- View event details
- RSVP (Going / Maybe / Not Going)
- Add the event to Google Calendar

### Organizer Dashboard

Organizers can:

- View RSVP responses
- Refresh RSVP data
- Share invite links
- Track attendance

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Lucide React

### Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT Authentication

### Database

- PostgreSQL
- Flyway

### Other

- REST APIs
- BCrypt Password Hashing
- QR Code Generation

---

## Architecture

```text
                    +----------------------+
                    |   React + Vite App   |
                    +----------+-----------+
                               |
                               | REST API
                               |
                               v
                    +----------------------+
                    | Spring Boot Backend  |
                    +----------+-----------+
                               |
                      Spring Data JPA
                               |
                               v
                    +----------------------+
                    |      PostgreSQL      |
                    +----------------------+
```

Authentication is handled using JWT access tokens, while data persistence is managed through Spring Data JPA and PostgreSQL.

---

## API Endpoints

### Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |

### Hangouts

| Method | Endpoint |
|---------|----------|
| POST | `/api/hangouts` |
| GET | `/api/hangouts` |
| GET | `/api/hangouts/{id}` |

### Public

| Method | Endpoint |
|---------|----------|
| GET | `/api/public/invites/{inviteCode}` |
| POST | `/api/public/invites/{inviteCode}/rsvps` |

### Organizer

| Method | Endpoint |
|---------|----------|
| GET | `/api/hangouts/{id}/rsvps` |

---

## Screenshots

### Login

*Add screenshot*

### Dashboard

*Add screenshot*

### Create Hangout

*Add screenshot*

### Event Details

*Add screenshot*

### Public RSVP

*Add screenshot*

---

## Running Locally

### Clone the repository

```bash
git clone https://github.com/your-username/gather.git
cd gather
```

### Backend

```bash
cd backend
./gradlew bootRun
```

The backend runs at:

```
http://localhost:8080
```

### Frontend

```bash
cd web-app
npm install
npm run dev
```

The frontend runs at:

```
http://localhost:5173
```

---

## Project Structure

```text
gather/
│
├── backend/
│   ├── src/
│   ├── gradle/
│   ├── build.gradle
│   └── ...
│
├── web-app/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## Future Improvements

- Edit and delete events
- Email invitations
- Push notifications
- Event image uploads
- Recurring events
- Multiple calendar providers
- Real-time RSVP updates using WebSockets
- Native mobile application

---

## License

This project was created for educational and portfolio purposes.
