# Architecture Documentation

This document provides a comprehensive overview of the architecture of the Real-Time Chat Application.

## High-Level Architecture

The application follows a microservices architecture pattern with the following components:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Client Application                         │
│                              (React)                              │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           API Gateway                               │
│                        (Node.js + Express)                          │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  │  Auth       │  │  Chat       │  │  Media      │  │  Notification │
│  │  Service    │  │  Service    │  │  Service    │  │  Service      │
│  │             │  │             │  │             │  │               │
│  │ - User      │  │ - Messages  │  │ - File      │  │ - Push        │
│  │   Registration│  │ - Real-time │  │   Uploads   │  │   Notifications│
│  │ - Login     │  │   Communication│  │ - AWS S3    │  │ - Email       │
│  │ - JWT       │  │ - Conversation │  │ - Compression│  │               │
│  │   Authentication│  │   Management│  │             │  │               │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Infrastructure Services                     │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │   MongoDB   │  │    Redis    │  │   RabbitMQ  │               │
│  │  (Database) │  │  (Cache/    │  │  (Message   │               │
│  │             │  │   Sessions) │  │   Queue)    │               │
│  └─────────────┘  └─────────────┘  └─────────────┘               │
└─────────────────────────────────────────────────────────────────────┘
```

## Service Interactions

### API Gateway
The API Gateway acts as the central entry point for all client requests. It handles:
- Request routing to appropriate microservices
- Authentication and authorization
- Rate limiting
- Centralized error handling
- Load balancing

### Auth Service
The Auth Service manages user authentication and profiles:
- User registration and login
- JWT token generation and validation
- Password encryption with bcrypt
- Session management with Redis

### Chat Service
The Chat Service handles conversations and real-time messaging:
- Conversation creation and management
- Message sending and retrieval
- Real-time communication with Socket.io
- Message encryption at rest
- Publishing message events to RabbitMQ

### Media Service
The Media Service manages media file uploads and storage:
- File uploads via multipart form data
- File compression for optimization
- Storage in AWS S3
- Media metadata storage in MongoDB

### Notification Service
The Notification Service sends notifications to users:
- Consumes message events from RabbitMQ
- Email notifications via Nodemailer
- Push notifications via Firebase Cloud Messaging
- Notification storage in MongoDB

## Data Flow Diagram

```
1. User Registration/Login
Client → API Gateway → Auth Service → MongoDB
                              ↘
                               Redis (Session Storage)

2. Real-Time Messaging
Client → API Gateway → Chat Service → MongoDB
       ↖                    ↙
        Socket.io Connection
                              ↘
                               RabbitMQ (Message Events)

3. Media Upload
Client → API Gateway → Media Service → AWS S3
                              ↘
                               MongoDB (Media Metadata)

4. Notification Processing
RabbitMQ → Notification Service → Email/Firebase
                        ↘
                         MongoDB (Notification Storage)
```

## Technology Stack

### Backend Services
- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-Time Communication**: Socket.io
- **Database**: MongoDB
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **Authentication**: JWT
- **File Storage**: AWS S3
- **Containerization**: Docker
- **Orchestration**: Kubernetes

### Frontend
- **Framework**: React
- **Routing**: React Router
- **Real-Time Communication**: Socket.io Client
- **State Management**: Redux (optional)
- **Build Tool**: Webpack
- **Containerization**: Docker

### Infrastructure
- **Reverse Proxy**: Nginx
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Databases**: MongoDB
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **Storage**: AWS S3

## Communication Patterns

### Synchronous Communication
- REST APIs over HTTP/HTTPS
- WebSocket connections for real-time messaging

### Asynchronous Communication
- Message queues (RabbitMQ) for event-driven processing
- Notifications sent in the background without blocking user requests

## Security Architecture

### Authentication Flow
1. User sends credentials to Auth Service via API Gateway
2. Auth Service validates credentials
3. JWT token is generated and returned to client
4. Token is stored in Redis for session management
5. Client includes token in Authorization header for subsequent requests

### Authorization
- Role-based access control (RBAC)
- Token validation at API Gateway level
- Service-level authorization checks

### Data Protection
- Passwords encrypted with bcrypt
- Messages encrypted at rest using AES
- HTTPS encryption for all communication
- Environment variables for sensitive configuration

## Scalability Architecture

### Horizontal Scaling
- Each service can be scaled independently based on demand
- Kubernetes handles pod replication and load distribution

### Load Balancing
- Nginx reverse proxy distributes requests across service instances
- Kubernetes services handle internal load balancing

### Database Scaling
- MongoDB replication sets for high availability
- Sharding for large datasets (future enhancement)

### Caching Strategy
- Redis used for session storage
- Redis can be used for caching frequently accessed data (future enhancement)

## Deployment Architecture

### Container Orchestration
- Docker containers for each service
- Kubernetes for production deployments
- Docker Compose for development environments

### Service Discovery
- Kubernetes internal DNS for service discovery
- Environment variables for service URLs in development

### Network Architecture
- Internal communication between services over HTTP
- External access through Nginx reverse proxy
- WebSocket connections upgraded through Nginx

## Monitoring and Observability

### Logging
- Centralized logging through Kubernetes or Docker logging drivers
- Structured logs in JSON format
- Log levels: error, warn, info, debug

### Health Checks
- Each service implements `/health` endpoint
- Kubernetes liveness and readiness probes
- Docker health checks

### Metrics
- Service-level metrics collection
- Response times, error rates, and throughput
- Integration with monitoring solutions (Prometheus, Grafana)

### Error Handling
- Centralized error handling in API Gateway
- Service-specific error handlers
- Error tracking and reporting

## Data Persistence

### MongoDB Collections
Each service has its own MongoDB database with specific collections:

1. **Auth Service**: Users collection
2. **Chat Service**: Conversations and Messages collections
3. **Media Service**: Media collection
4. **Notification Service**: Notifications collection

### Redis Usage
- Session storage for JWT tokens
- Real-time features support (future enhancement)

### AWS S3 Storage
- Media files (images, videos, audio, documents)
- File compression and optimization

## Future Architecture Enhancements

1. **Service Mesh**: Implement Istio for better service-to-service communication
2. **Circuit Breaker**: Add circuit breaker pattern for fault tolerance
3. **API Documentation**: Integrate Swagger/OpenAPI for API documentation
4. **Caching Layer**: Add Redis caching for frequently accessed data
5. **Search Service**: Implement Elasticsearch for message search capabilities
6. **Analytics Service**: Add analytics service for user behavior tracking
7. **Content Delivery Network**: Use CDN for media file delivery
8. **Database Migration**: Implement database migration tools
