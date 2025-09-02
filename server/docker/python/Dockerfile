# Python Runtime Container
FROM python:3.11-slim-bullseye

# Install essential tools
RUN apt-get update && apt-get install -y \
    coreutils \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Set security limits
RUN useradd -m -s /bin/bash coderunner
USER coderunner

# Default command
CMD ["/bin/bash"]