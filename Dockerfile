# Stage 1: Build the Vue.js application
FROM node:18 as builder

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies (using pnpm)
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Serve with optimized NGINX
FROM nginx:alpine

# Remove default NGINX config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (HTTP) and 443 (HTTPS)
EXPOSE 80 443

# Start NGINX in foreground
CMD ["nginx", "-g", "daemon off;"]