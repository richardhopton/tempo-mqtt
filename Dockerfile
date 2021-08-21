FROM node:14-alpine

COPY package.json /tempo-mqtt/
WORKDIR /tempo-mqtt

RUN yarn install

COPY src /tempo-mqtt/src/
COPY tsconfig.build.json /tempo-mqtt/
COPY tsconfig.json /tempo-mqtt/

RUN yarn build

FROM node:14-alpine

# Add env
ENV LANG C.UTF-8


RUN apk add --no-cache bash curl jq && \
    curl -J -L -o /tmp/bashio.tar.gz "https://github.com/hassio-addons/bashio/archive/v0.13.1.tar.gz" && \
    mkdir /tmp/bashio && \
    tar zxvf /tmp/bashio.tar.gz --strip 1 -C /tmp/bashio && \
    mv /tmp/bashio/lib /usr/lib/bashio && \
    ln -s /usr/lib/bashio/bashio /usr/bin/bashio

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

WORKDIR /tempo-mqtt
COPY run.sh /tempo-mqtt/
RUN chmod a+x run.sh

COPY --from=0 /tempo-mqtt/dist/tsc/ /tempo-mqtt/
COPY --from=0 /tempo-mqtt/node_modules /tempo-mqtt/node_modules

ENTRYPOINT [ "/tempo-mqtt/run.sh" ]
#ENTRYPOINT [ "node", "index.js" ]
LABEL \
    io.hass.name="Tempo Integration via MQTT" \
    io.hass.description="Home Assistant Community Add-on for Tempo Studios" \
    io.hass.type="addon" \
    io.hass.version="1.0.0" \
    maintainer="Richard Hopton <richard@thehoptons.com>"