# Database Setup Guide

## MongoDB Setup

This project uses MongoDB with Mongoose for user data management.

### 1. Install MongoDB

#### Option A: Local MongoDB Installation
```bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/blinkfi-mini-app
# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blinkfi-mini-app?retryWrites=true&w=majority
```

### 3. Database Schema

The project includes a single Mongoose schema:

#### User Schema
- `_id`: User ID (auto-generated)
- `fid`: Farcaster ID (unique, optional)
- `username`: Username (optional)
- `displayName`: Display name (optional)
- `pfpUrl`: Profile picture URL (optional)
- `bio`: User bio (optional)
- `walletAddress`: Connected wallet address (unique, required)
- `createdAt`: Creation timestamp (auto-generated)
- `updatedAt`: Last update timestamp (auto-generated)

### 4. API Endpoints

#### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/[id]` - Get user by FID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

#### Database Test
- `GET /api/test-db` - Test database connection

### 5. Usage Examples

#### Using the Service Layer
```typescript
import { userService } from '@/lib/services';

// Create or update a user
const user = await userService.createOrUpdateUser({
  fid: '12345',
  username: 'alice',
  displayName: 'Alice',
  walletAddress: '0x...'
});

// Get user by ID
const user = await userService.getUserByFid('12345');

// Update user
const updatedUser = await userService.updateUser('12345', {
  displayName: 'Alice Updated',
  bio: 'New bio text'
});
```

#### Using API Routes
```typescript
// Create a user
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fid: '12345',
    username: 'alice',
    displayName: 'Alice'
  })
});

// Get user by ID
const user = await fetch('/api/users/12345');
```

### 6. Testing Database Connection

Visit `http://localhost:3001/api/test-db` to test your database connection.

### 7. Development Tips

- The database connection is cached globally to prevent multiple connections in development
- All API routes automatically connect to the database
- Use the service layer (`lib/services.ts`) for complex operations
- Use direct API calls for simple CRUD operations
- The User model uses `upsert` for createOrUpdateUser, so it will create if not exists or update if exists

### 8. CURL Testing commands

#### User

Basic Test:
```shell
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "fid": "12345",
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "username": "alice",
    "displayName": "Alice",
    "email": "alice@example.com",
    "bio": "Hello from BlinkFi!"
  }'
```

Minimal Test (only required fields - wallet):
```shell
  curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0xabcdef1234567890abcdef1234567890abcdef12"
  }'
```

##### Test Duplicate Prevention:

Try to create user with existing FID:
```shell
  curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "fid": "12345",
    "walletAddress": "0x9999999999999999999999999999999999999999"
  }'
```

Try to create user with existing wallet address:
```shell
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "fid": "99999",
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678"
  }'
```

##### Test Validation (Missing Required Fields):

Missing Wallet Address:
```shell
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "fid": "12345"
  }'
```

##### Test Other Endpoints:

Get All Users:
``` shell
curl http://localhost:3000/api/users
```

Get User by Wallet Address:
``` shell
curl http://localhost:3000/api/users/wallet/0x1234567890abcdef1234567890abcdef12345678
```