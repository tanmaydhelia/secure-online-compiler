const express = require('express');
const cors = require('cors');
const Docker = require('dockerode');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const { log } = require('util');

const app = express();
const docker = new Docker();

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Language configurations
const languageConfigs = {
  cpp: {
    image: 'coderunner-cpp',
    extension: 'cpp',
    compileCmd: 'g++ -o program main.cpp',
    runCmd: './program'
  },
  python: {
    image: 'coderunner-python',
    extension: 'py',
    compileCmd: null,
    runCmd: 'python main.py'
  },
  java: {
    image: 'coderunner-java',
    extension: 'java',
    compileCmd: 'javac Main.java',
    runCmd: 'java Main'
  }
};

// Ensure temp directory exists
const ensureTempDir = async () => {
  const tempDir = path.join(__dirname, 'temp');
  try {
    await fs.access(tempDir);
  } catch {
    await fs.mkdir(tempDir, { recursive: true });
  }
  return tempDir;
};

// Clean up old containers and files
const cleanup = async (containerId, tempDir) => {
  try {
    const container = docker.getContainer(containerId);
    await container.remove({ force: true });
  } catch (error) {
    console.log('Container cleanup error:', error.message);
  }
  
  try {
    await fs.rm(tempDir, { recursive: true });
  } catch (error) {
    console.log('Directory cleanup error:', error.message);
  }
};

// Execute code in Docker container
const executeCode = async (language, code, input = '') => {
  const config = languageConfigs[language];
  if (!config) {
    throw new Error('Unsupported language');
  }

  const sessionId = uuidv4();
  const tempDir = path.join(await ensureTempDir(), sessionId);
  await fs.mkdir(tempDir, { recursive: true });

  // Write code to file
  const filename = language === 'java' ? 'Main.java' : `main.${config.extension}`;
  const filePath = path.join(tempDir, filename);
  await fs.writeFile(filePath, code);

  // Write input file if provided
  if (input) {
    await fs.writeFile(path.join(tempDir, 'input.txt'), input);
  }

  let containerId = null;
  
  try {
    // Create and start container
    const container = await docker.createContainer({
      Image: config.image,
      Cmd: ['/bin/bash', '-c', `
        cd /app && 
        ${config.compileCmd ? `timeout 10s ${config.compileCmd} && ` : ''}
        timeout 5s ${config.runCmd} ${input ? '< input.txt' : ''}
      `],
      WorkingDir: '/app',
      HostConfig: {
        Memory: 128 * 1024 * 1024, // 128MB limit
        CpuQuota: 50000, // 50% CPU limit
        NetworkMode: 'none', // No network access
        AutoRemove: true,
        Binds: [`${tempDir}:/app`]
      },
      AttachStdout: true,
      AttachStderr: true
    });

    containerId = container.id;
    await container.start();

    // Get output
    const stream = await container.attach({
      stream: true,
      stdout: true,
      stderr: true
    });
    

    let output = '';

    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup(containerId, tempDir);
        reject(new Error('Execution timeout'));
      }, 15000);

      stream.on('data', (chunk) => {
        output += chunk.toString();
      });

      stream.on('end', async () => {
        clearTimeout(timeout);
        
        try {
          const containerInfo = await container.inspect();
          const exitCode = containerInfo.State.ExitCode;
          
          await cleanup(containerId, tempDir);
          output = output.slice(8); // remove first 8 bytes
          
          resolve({
            output: output.trim(),
            exitCode,
            success: exitCode === 0
          });
        } catch (error) {
          await cleanup(containerId, tempDir);
          reject(error);
        }
      });

      stream.on('error', async (error) => {
        clearTimeout(timeout);
        await cleanup(containerId, tempDir);
        reject(error);
      });
    });

  } catch (error) {
    if (containerId) {
      await cleanup(containerId, tempDir);
    }
    throw error;
  }
};

// API Routes
app.post('/api/compile', async (req, res) => {
  try {
    const { language, code, input } = req.body;
    
    if (!language || !code) {
      return res.status(400).json({
        error: 'Language and code are required'
      });
    }

    if (!languageConfigs[language]) {
      return res.status(400).json({
        error: 'Unsupported language'
      });
    }

    const startTime = Date.now();
    const result = await executeCode(language, code, input);
    const executionTime = (Date.now() - startTime) / 1000;

    res.json({
      ...result,
      executionTime,
      language
    });

  } catch (error) {
    console.error('Compilation error:', error);
    res.status(500).json({
      error: error.message,
      output: `Error: ${error.message}`,
      success: false
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 CodeRunner API server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});