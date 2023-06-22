# Install dependencies only when needed
FROM python:3.10 AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
#RUN apt-get libc6-compat 

# Add build dependencies for HNSWLib
ENV PYTHONUNBUFFERED=1
#RUN apt-get cmake
#RUN apk add make g++
#RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
#RUN python3 -m ensurepip
#RUN pip3 install --no-cache --upgrade pip setuptools
RUN curl -fsSL https://deb.nodesource.com/setup_19.x | bash - && apt-get install -y nodejs
RUN apt-get install -y yarn

WORKDIR /app
COPY . .
#RUN yarn global add cmake-js
RUN npm install

# If using npm with a `package-lock.json` comment out above and use below instead
# RUN npm ci

ENV NEXT_TELEMETRY_DISABLED 1

# Add `ARG` instructions below if you need `NEXT_PUBLIC_` variables
# then put the value on your fly.toml
# Example:
# ARG NEXT_PUBLIC_EXAMPLE="value here"

#RUN yarn build

# If using npm comment out above and use below instead
RUN npm run build

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN mkdir -p /nonexistent/.npm/_logs
RUN mkdir -p /nonexistent/.npm/_cacache/tmp
RUN chown -R 1001:65534 "/nonexistent/.npm"

#USER nextjs

EXPOSE 3000

#CMD ["yarn", "start"]

# If using npm comment out above and use below instead
CMD ["npm", "run", "start"]
