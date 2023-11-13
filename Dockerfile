##################################################################################################################

FROM node:18-bullseye@sha256:31c868979073ee9ab3387bc64ea127465a841b3ef47e7d6dee0b7ee84d3eec33  AS builder

LABEL maintainer="Glenn Parreno <geparreno@senecacollege.ca>"
LABEL description="Front end for fragments microservice"

ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

WORKDIR /app

COPY package* .

RUN npm ci

COPY . .

##################################################################################################################

FROM node:18-bullseye@sha256:31c868979073ee9ab3387bc64ea127465a841b3ef47e7d6dee0b7ee84d3eec33 AS production

COPY --from=builder /app /app

WORKDIR /app

CMD ["npm", "start"]

##################################################################################################################

FROM nginx:stable-bullseye@sha256:8091c5f722b5060431042b000a742df96a586c6ecc3dcb440fbbdbdc3c261f3e

COPY --from=production /app/dist /usr/share/nginx/html/

EXPOSE 1234

HEALTHCHECK --interval=3m \
      CMD curl --fail http://localhost:8080/ || exit 1