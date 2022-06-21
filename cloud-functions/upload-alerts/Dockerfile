FROM osgeo/gdal:alpine-normal-latest

ENV CPL_GS_CREDENTIALS_FILE=/home/credentials.json
ENV GOOGLE_APPLICATION_CREDENTIALS=/home/credentials.json

RUN apk add --update make nodejs npm

WORKDIR /home

COPY package.json package-lock.json ./
RUN npm install

COPY index.js credentials.json ./
