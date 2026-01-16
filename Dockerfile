FROM node:22-alpine
RUN echo "Building Frontend with Node 22"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7777

CMD ["npm", "run", "dev", "--", "--host", "--port", "7777"]
