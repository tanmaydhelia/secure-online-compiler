# CodeRunner - Online Compiler

A modern online compiler supporting C++, Python, and Java with Docker containerization.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker Desktop
- Git

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Build Docker images:**
```bash
npm run docker:build
```

3. **Start the application:**
```bash
# Start both frontend and backend
npm run final

# Or start separately:
npm run dev          # Frontend (Next.js)
npm run dev:server   # Backend API
```

## 🐳 Docker Setup

The application uses separate Docker containers for each language:

- **C++**: GCC 12 with compilation and execution
- **Python**: Python 3.11 with standard library
- **Java**: OpenJDK 17 with compilation and execution

### Building Docker Images

```bash
cd docker
chmod +x build-images.sh
./build-images.sh
```

## 🔧 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Docker        │
│   (Next.js)     │───▶│   (Express.js)  │───▶│   Containers    │
│   Port 3000     │    │   Port 3001     │    │   Isolated      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### API Endpoints

- `POST /api/compile` - Compile and execute code
- `GET /api/health` - Health check

### Request Format
```json
{
  "language": "cpp|python|java",
  "code": "source code string",
  "input": "optional input string"
}
```

### Response Format
```json
{
  "output": "execution output",
  "success": true,
  "exitCode": 0,
  "executionTime": 1.23,
  "language": "cpp"
}
```

## 🔒 Security Features

- **Container Isolation**: Each execution runs in a separate Docker container
- **Resource Limits**: Memory (128MB) and CPU (50%) restrictions
- **Time Limits**: 10s compilation, 5s execution timeout
- **Network Isolation**: Containers have no network access
- **Read-only Mounts**: Source code mounted as read-only
- **Auto Cleanup**: Containers and temp files automatically removed

## 🛠️ Development

### Frontend Development
```bash
npm run dev
```

### Backend Development
```bash
npm run dev:server
```

### Full Stack Development
```bash
npm run final
```

## 📁 Project Structure

```
├── app/                 # Next.js frontend
│   ├── api/            # API routes
│   ├── components/     # React components
│   └── globals.css     # Global styles
├── server/             # Express.js backend
│   └── index.js        # Main server file
├── docker/             # Docker configurations
│   ├── cpp/           # C++ runtime
│   ├── python/        # Python runtime
│   ├── java/          # Java runtime
│   └── build-images.sh # Build script
└── components/         # Shared UI components
```

## 🚀 Deployment

For production deployment:

1. **Build Docker images** on your server
2. **Configure environment variables**
3. **Set up reverse proxy** (nginx)
4. **Enable HTTPS**
5. **Configure rate limiting**

## 🔧 Environment Variables

```env
PORT=3001
DOCKER_HOST=unix:///var/run/docker.sock
MAX_EXECUTION_TIME=15000
MAX_MEMORY=128
```

## 📝 Supported Languages

| Language | Version | Compiler/Runtime |
|----------|---------|------------------|
| C++      | GCC 12  | g++              |
| Python   | 3.11    | python           |
| Java     | 17      | javac + java     |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker containers
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.