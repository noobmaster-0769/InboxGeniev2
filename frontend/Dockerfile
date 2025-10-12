# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the application with a lightweight server
FROM node:18-alpine

WORKDIR /app

# Install a simple static server
RUN npm install -g serve

COPY --from=build /app/dist .

EXPOSE 5173

CMD ["serve", "-s", ".", "-l", "5173"]
