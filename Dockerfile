# Step 1: Build the client application
FROM node:16.17.1 as client-build
WORKDIR /app/client
COPY ./client/package*.json ./
RUN npm install
COPY ./client ./
RUN npm run build

# Step 2: Build the server application
FROM node:16.17.1 as server-build
WORKDIR /app/server
COPY ./server/package*.json ./
RUN npm install
COPY ./server ./

# Step 3: Copy the built client into the server
COPY --from=client-build /app/client/dist ./dist

# Set any other environment variables or configurations needed for the server here
CMD ["node", "server.js"]
