FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install nodemon
COPY prisma ./prisma
RUN npx prisma generate 
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]