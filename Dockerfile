# Stage 1: Build and serve fragments-ui with Parcel
FROM node:18-bullseye@sha256:31c868979073ee9ab3387bc64ea127465a841b3ef47e7d6dee0b7ee84d3eec33  AS builder

LABEL maintainer="Glenn Parreno <geparreno@senecacollege.ca>"
LABEL description="Front end for fragments microservice"

ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy our package.json/package-lock.json in
COPY package* .

# Install node dependencies defined in package.json and package-lock.json
RUN npm ci

# Copy everything else into /app
COPY . .

# Stage 2: Create a minimal image for serving the application
FROM node:18-bullseye@sha256:31c868979073ee9ab3387bc64ea127465a841b3ef47e7d6dee0b7ee84d3eec33 

# Copy only necessary files from the builder stage
COPY --from=builder /app /app

WORKDIR /app

# Run the server
CMD ["npm", "start"]

# Expose the port
EXPOSE 1234
