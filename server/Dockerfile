FROM node:18-alpine

WORKDIR /app

# Copy CSVs from root context
COPY *.csv ./
COPY *.xlsx ./

# Setup server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ .

EXPOSE 3001

CMD ["npm", "start"]
