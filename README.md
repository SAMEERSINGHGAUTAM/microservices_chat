# Real-Time Chat Application

A full-stack real-time chat application built with a microservices architecture using Node.js, React, Socket.io, MongoDB, Redis, and RabbitMQ.

## Features

- User authentication (register, login, logout)
- Real-time messaging with Socket.io
- Media file sharing (images, videos, audio, documents)
- Push notifications for new messages
- Rate limiting for API protection
- Docker containerization for all services
- Kubernetes deployment configurations

## Architecture

This application follows a microservices architecture with the following services:

1. **API Gateway**: Routes requests to appropriate services and handles authentication
2. **Auth Service**: Manages user authentication and profiles
3. **Chat Service**: Handles conversations, messages, and real-time communication
4. **Media Service**: Manages media file uploads and storage
5. **Notification Service**: Sends push notifications and emails for new messages

## Prerequisites

- Docker
- Docker Compose
- Node.js (v14 or higher)
- npm or yarn
- MongoDB
- Redis
- RabbitMQ

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd chat-microservices
   ```

2. Set up environment variables:
   Copy the `.env.example` files in each service directory to `.env` and fill in the appropriate values.

3. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: http://localhost:3001
   - API Gateway: http://localhost:3000

## Project Structure

```
chat-microservices/
├── client/                 # React frontend
├── services/
│   ├── api-gateway/        # API Gateway service
│   ├── auth-service/       # Authentication service
│   ├── chat-service/      # Chat service with Socket.io
│   ├── media-service/     # Media file handling service
│   └── notification-service/  # Notification service
├── infrastructure/
│   ├── docker-compose.yml      # Production Docker Compose
│   ├── docker-compose.dev.yml # Development Docker Compose
│   ├── k8s/                   # Kubernetes configurations
│   └── nginx/                # Nginx reverse proxy configuration
├── shared/                    # Shared code between services
├── docs/                      # Documentation files
├── scripts/                   # Utility scripts
└── README.md                  # This file
```

## Services Overview

### API Gateway
- Routes requests to appropriate microservices
- Implements authentication middleware
- Handles rate limiting
- Provides centralized error handling

### Auth Service
- User registration and login
- JWT token generation and validation
- Password encryption with bcrypt
- Email verification (optional)

### Chat Service
- Conversation creation and management
- Message sending and retrieval
- Real-time communication with Socket.io
- Message encryption at rest

### Media Service
- Media file uploads to AWS S3
- File compression for optimization
- Media metadata storage in database

### Notification Service
- Email notifications via Nodemailer
- Push notifications via Firebase Cloud Messaging
- Message queue processing with RabbitMQ

## Development

To run the application in development mode:

1. Start the infrastructure services:
   ```bash
   docker-compose -f infrastructure/docker-compose.dev.yml up
   ```

2. Start the client application:
   ```bash
   cd client
   npm start
   ```

3. Start each service individually:
   ```bash
   cd services/api-gateway
   npm start
   
   cd services/auth-service
   npm start
   
   cd services/chat-service
   npm start
   
   cd services/media-service
   npm start
   
   cd services/notification-service
   npm start
   ```

## Testing

Run all tests with:
```bash
./scripts/test-all.sh
```

Or test individual services:
```bash
cd services/<service-name>
npm test
```

## Deployment

### Docker
```bash
docker-compose up -d
```

### Kubernetes
```bash
kubectl apply -f infrastructure/k8s/
```

## API Documentation

See [docs/API.md](docs/API.md) for detailed API documentation.

## System Design

See [docs/SYSTEM_DESIGN.md](docs/SYSTEM_DESIGN.md) for system design details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.
