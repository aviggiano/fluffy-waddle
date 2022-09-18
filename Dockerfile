FROM aviggiano/hack

RUN apt-get update && apt-get install -y libpq-dev

USER node
EXPOSE 3000
USER $user
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .
RUN yarn install

ENTRYPOINT ["/bin/bash"]