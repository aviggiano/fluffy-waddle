FROM aviggiano:hack

USER node
EXPOSE 3000
USER $user
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .
RUN yarn install && yarn build
CMD ["node", "dist/docker/main.ts"]