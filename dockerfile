FROM node:16-slim
RUN mkdir -p /app
WORKDIR /app
COPY package.json .
RUN yarn
COPY . .
EXPOSE 3100
CMD ["yarn","dev"]