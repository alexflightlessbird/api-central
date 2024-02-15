# Use an official Node.js runtime as a base image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the application code to the container
COPY . .

COPY ./config/fonts/Oswald-SemiBold.otf /usr/share/fonts/
COPY ./config/fonts/eb-garamond-latin-400-normal.ttf /usr/share/fonts/
RUN fc-cache -f -v

# Define the command to run your application
CMD ["npm", "start"]