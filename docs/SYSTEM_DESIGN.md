# System Design Documentation

This document provides detailed system design information for the Real-Time Chat Application, including database schemas, API endpoints, and architectural decisions.

## Database Design

### Auth Service Database (MongoDB)

#### Users Collection
```javascript
{
  _id: ObjectId,
  username: String, // Unique
  email: String,   // Unique
  password: String, // Hashed
  profilePicture: String, // URL to media file
  status: String,   // 'online' | 'offline' | 'away'
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- Unique index on username
- Unique index on email

### Chat Service Database (MongoDB)

#### Conversations Collection
```javascript
{
  _id: ObjectId,
  participants: [Participant], // Array of participant objects
  type: String, // 'private' | 'group'
  name: String, // For group chats
  createdAt: Date,
  updatedAt: Date
}
```

#### Messages Collection
```javascript
{
  _id: ObjectId,
  conversationId: ObjectId, // Reference to conversation
  senderId: ObjectId,       // Reference to user
  content: String,          // Encrypted content
  mediaId: ObjectId,        // Optional reference to media
  timestamp: Date,
  readBy: [ObjectId],       // Array of user IDs who read the message
  deliveredTo: [ObjectId]   // Array of user IDs who received the message
}
```

#### Participants Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,         // Reference to user
  conversationId: ObjectId, // Reference to conversation
  joinedAt: Date,
  leftAt: Date,            // Optional, if user left the conversation
  role: String             // 'admin' | 'member' (for group chats)
}
```

**Indexes**:
- Index on conversationId in Messages collection
- Index on userId in Participants collection
- Index on conversationId in Participants collection

### Media Service Database (MongoDB)

#### Media Collection
```javascript
{
  _id: ObjectId,
  originalName: String,
  fileName: String,        // Generated unique name
  path: String,           // S3 path
  size: Number,           // File size in bytes
  mimeType: String,       // File type
  uploadedBy: ObjectId,   // Reference to user
  compressed: Boolean,    // Whether file was compressed
  compressionRatio: Number, // Compression ratio if compressed
  uploadTimestamp: Date
}
```

**Indexes**:
- Index on uploadedBy

### Notification Service Database (MongoDB)

#### Notifications Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,       // Reference to user
  type: String,          // 'message' | 'system'
  title: String,
  content: String,
  read: Boolean,
  timestamp: Date,
  metadata: Object        // Additional data for the notification
}
```

**Indexes**:
- Index on userId
- Index on timestamp

## API Design

### Auth Service Endpoints

#### POST /api/auth/register
Register a new user

**Request Body**:
```javascript
{
  username: String,
  email: String,
  password: String
}
```

**Response**:
```javascript
{
  success: Boolean,
  user: {
    id: String,
    username: String,
    email: String,
    profilePicture: String,
    status: String
  },
  token: String
}
```

#### POST /api/auth/login
Login with existing credentials

**Request Body**:
```javascript
{
  email: String,
  password: String
}
```

**Response**:
```javascript
{
  success: Boolean,
  user: {
    id: String,
    username: String,
    email: String,
    profilePicture: String,
    status: String
  },
  token: String
}
```

#### GET /api/auth/profile
Get user profile (requires authentication)

**Response**:
```javascript
{
  success: Boolean,
  user: {
    id: String,
    username: String,
    email: String,
    profilePicture: String,
    status: String
  }
}
```

#### PUT /api/auth/profile
Update user profile (requires authentication)

**Request Body**:
```javascript
{
  username: String,
  email: String,
  profilePicture: String
}
```

**Response**:
```javascript
{
  success: Boolean,
  user: {
    id: String,
    username: String,
    email: String,
    profilePicture: String,
    status: String
  }
}
```

### Chat Service Endpoints

#### POST /api/chat/conversations
Create a new conversation

**Request Body**:
```javascript
{
  participants: [String], // Array of user IDs
  type: String,          // 'private' | 'group'
  name: String           // Required for group chats
}
```

**Response**:
```javascript
{
  success: Boolean,
  conversation: {
    id: String,
    participants: [Participant],
    type: String,
    name: String,
    createdAt: Date
  }
}
```

#### GET /api/chat/conversations
Get all conversations for the authenticated user

**Response**:
```javascript
{
  success: Boolean,
  conversations: [
    {
      id: String,
      participants: [Participant],
      type: String,
      name: String,
      createdAt: Date,
      lastMessage: {
        id: String,
        content: String,
        senderId: String,
        timestamp: Date
      }
    }
  ]
}
```

#### GET /api/chat/conversations/:id
Get a specific conversation by ID

**Response**:
```javascript
{
  success: Boolean,
  conversation: {
    id: String,
    participants: [Participant],
    type: String,
    name: String,
    createdAt: Date
  }
}
```

#### GET /api/chat/conversations/:id/messages
Get messages for a specific conversation

**Query Parameters**:
- limit: Number (default: 50)
- offset: Number (default: 0)
- before: Date (optional)
- after: Date (optional)

**Response**:
```javascript
{
  success: Boolean,
  messages: [
    {
      id: String,
      conversationId: String,
      senderId: String,
      content: String,
      mediaId: String,
      timestamp: Date,
      readBy: [String],
      deliveredTo: [String]
    }
  ]
}
```

#### POST /api/chat/messages
Send a new message

**Request Body**:
```javascript
{
  conversationId: String,
  content: String,
  mediaId: String // Optional
}
```

**Response**:
```javascript
{
  success: Boolean,
  message: {
    id: String,
    conversationId: String,
    senderId: String,
    content: String,
    mediaId: String,
    timestamp: Date,
    readBy: [String],
    deliveredTo: [String]
  }
}
```

#### PUT /api/chat/messages/:id/read
Mark a message as read

**Response**:
```javascript
{
  success: Boolean,
  message: {
    id: String,
    readBy: [String]
  }
}
```

### Media Service Endpoints

#### POST /api/media/upload
Upload a new media file

**Request Body**:
- multipart/form-data with file field

**Response**:
```javascript
{
  success: Boolean,
  media: {
    id: String,
    originalName: String,
    fileName: String,
    path: String,
    size: Number,
    mimeType: String,
    uploadedBy: String,
    compressed: Boolean,
    compressionRatio: Number,
    uploadTimestamp: Date
  }
}
```

#### GET /api/media/:id
Get media file information by ID

**Response**:
```javascript
{
  success: Boolean,
  media: {
    id: String,
    originalName: String,
    fileName: String,
    path: String,
    size: Number,
    mimeType: String,
    uploadedBy: String,
    compressed: Boolean,
    compressionRatio: Number,
    uploadTimestamp: Date
  }
}
```

### Notification Service Endpoints

#### GET /api/notifications
Get all notifications for the authenticated user

**Query Parameters**:
- limit: Number (default: 50)
- offset: Number (default: 0)
- unreadOnly: Boolean (default: false)

**Response**:
```javascript
{
  success: Boolean,
  notifications: [
    {
      id: String,
      userId: String,
      type: String,
      title: String,
      content: String,
      read: Boolean,
      timestamp: Date,
      metadata: Object
    }
  ]
}
```

#### PUT /api/notifications/:id/read
Mark a notification as read

**Response**:
```javascript
{
  success: Boolean,
  notification: {
    id: String,
    read: Boolean
  }
}
```

#### DELETE /api/notifications/:id
Delete a notification

**Response**:
```javascript
{
  success: Boolean,
  message: "Notification deleted successfully"
}
```

## WebSocket Events

### Client to Server Events

#### 'join_conversation'
Join a conversation room to receive real-time updates

**Payload**:
```javascript
{
  conversationId: String
}
```

#### 'leave_conversation'
Leave a conversation room

**Payload**:
```javascript
{
  conversationId: String
}
```

#### 'send_message'
Send a message in real-time

**Payload**:
```javascript
{
  conversationId: String,
  content: String,
  mediaId: String // Optional
}
```

### Server to Client Events

#### 'new_message'
Broadcast a new message to all participants in a conversation

**Payload**:
```javascript
{
  id: String,
  conversationId: String,
  senderId: String,
  content: String,
  mediaId: String,
  timestamp: Date
}
```

#### 'message_delivered'
Notify sender that message was delivered to recipient

**Payload**:
```javascript
{
  messageId: String,
  userId: String
}
```

#### 'message_read'
Notify sender that message was read by recipient

**Payload**:
```javascript
{
  messageId: String,
  userId: String
}
```

#### 'user_typing'
Notify conversation participants that a user is typing

**Payload**:
```javascript
{
  conversationId: String,
  userId: String
}
```

#### 'user_online'
Notify when a user comes online

**Payload**:
```javascript
{
  userId: String
}
```

#### 'user_offline'
Notify when a user goes offline

**Payload**:
```javascript
{
  userId: String
}
```

## Message Queue Events

### Shared Event Types
Defined in `shared/events/event-types.js`:
```javascript
module.exports = {
  MESSAGE_CREATED: 'message.created',
  USER_REGISTERED: 'user.registered',
  CONVERSATION_CREATED: 'conversation.created'
};
```

### Message Created Event
When a new message is created in the Chat Service, it publishes a `message.created` event to RabbitMQ:

**Payload**:
```javascript
{
  messageId: String,
  conversationId: String,
  senderId: String,
  contentPreview: String, // First 50 characters of message
  timestamp: Date
}
```

The Notification Service consumes this event to send notifications to recipients.

## Security Design

### Authentication Flow
1. Client sends credentials to Auth Service
2. Auth Service validates credentials using bcrypt
3. Auth Service generates JWT token with user information
4. Token is stored in Redis with expiration time
5. Client receives token and includes it in Authorization header for subsequent requests
6. API Gateway validates token with Redis before forwarding requests to services

### Password Security
- Passwords are hashed using bcrypt with salt rounds = 12
- Passwords are never stored in plain text
- Password validation happens in Auth Service only

### Message Encryption
- Messages are encrypted at rest using AES-256-GCM
- Encryption key is stored as environment variable
- Messages are decrypted when retrieved by authorized users only

### Rate Limiting
- API Gateway implements rate limiting using Redis
- Default limit: 100 requests per 15 minutes per IP
- Can be configured differently for authenticated vs unauthenticated requests

## Error Handling Design

### Error Response Format
All services return errors in a consistent format:
```javascript
{
  success: false,
  error: {
    code: String,
    message: String,
    details: Object // Optional additional details
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Request validation failed
- `AUTHENTICATION_ERROR`: User not authenticated
- `AUTHORIZATION_ERROR`: User not authorized for action
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Unexpected server error

### Error Propagation
1. Services handle errors internally and return appropriate HTTP status codes
2. API Gateway catches all errors and applies consistent formatting
3. Client application receives formatted errors and displays user-friendly messages

## Scalability Design

### Database Sharding Strategy
- Conversations are sharded by conversationId
- Messages are sharded by conversationId to keep related data together
- Users are sharded by userId
- Media files are stored in S3 with unique identifiers

### Service Scaling
- Each service can be scaled horizontally based on demand
- Redis handles session storage for load balancing
- RabbitMQ handles message queuing for asynchronous processing

### Caching Strategy
- Redis used for session storage
- Future enhancement: Redis caching for frequently accessed conversations/messages

### Load Balancing
- Nginx reverse proxy distributes requests among service instances
- WebSocket connections are sticky to maintain session consistency

## Data Flow Design

### User Registration
1. Client sends registration request to API Gateway
2. API Gateway forwards to Auth Service
3. Auth Service validates input and hashes password
4. Auth Service stores user in MongoDB
5. Auth Service generates JWT token
6. Auth Service stores token in Redis
7. Auth Service returns user data and token to client

### Message Sending
1. Client sends message to API Gateway
2. API Gateway validates authentication token with Redis
3. API Gateway forwards to Chat Service
4. Chat Service encrypts message content
5. Chat Service stores message in MongoDB
6. Chat Service publishes message event to RabbitMQ
7. Chat Service broadcasts message via WebSocket to conversation participants
8. Notification Service consumes message event from RabbitMQ
9. Notification Service sends notifications to recipients

### Media Upload
1. Client sends file to API Gateway
2. API Gateway validates authentication token with Redis
3. API Gateway forwards to Media Service
4. Media Service compresses file if applicable
5. Media Service uploads file to AWS S3
6. Media Service stores metadata in MongoDB
7. Media Service returns file information to client

## Monitoring Design

### Health Check Endpoints
Each service implements a `/health` endpoint that:
1. Checks database connectivity
2. Checks Redis connectivity (if applicable)
3. Checks RabbitMQ connectivity (if applicable)
4. Checks AWS S3 connectivity (if applicable)
5. Returns 200 OK if all systems are operational

### Logging Strategy
- All services use structured JSON logging
- Logs include timestamp, service name, log level, and message
- Error logs include stack traces
- Request logs include user ID, request path, and response time

### Metrics Collection
- Response time metrics for each endpoint
- Error rate metrics for each service
- Throughput metrics for message processing
- Connection metrics for WebSocket connections

## Deployment Design

### Environment Configuration
- All services use environment variables for configuration
- `.env.example` files provided for each service
- Docker images built with environment variables
- Kubernetes secrets used for sensitive data in production

### Service Dependencies
- Auth Service depends on MongoDB and Redis
- Chat Service depends on MongoDB, Redis, and RabbitMQ
- Media Service depends on MongoDB and AWS S3
- Notification Service depends on MongoDB and RabbitMQ
- API Gateway depends on Redis

### Network Configuration
- Services communicate internally over HTTP
- Client communicates with API Gateway only
- WebSocket connections handled by Chat Service
- Nginx reverse proxy handles SSL termination and routing

## Testing Design

### Unit Testing
- Each service has unit tests for controllers and services
- Jest used as testing framework
- Mocking used for external dependencies

### Integration Testing
- Docker Compose used for integration testing
- Test databases used for each service
- End-to-end tests for critical user flows

### API Testing
- Postman collections provided for API testing
- Automated API tests in CI/CD pipeline
- Load testing scripts for performance evaluation

## Future Enhancements

### Real-Time Features
- Typing indicators
- Online presence
- Message reactions
- Voice/video calling

### Advanced Messaging
- Message threading
- Scheduled messages
- Message expiration
- Rich media messages

### Search and Analytics
- Full-text search for messages
- Conversation analytics
- User behavior tracking

### Performance Improvements
- Database indexing optimization
- Caching layer implementation
- CDN for media files
- Database connection pooling
