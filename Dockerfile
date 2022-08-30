########
# base #
########
FROM ubuntu:jammy AS base

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    bash-completion \
    sudo \
    python3 \
    libpython3-dev \
    python3-pip \
    python3-setuptools \
    git \
    build-essential \
    software-properties-common \
    locales-all locales \
    libudev-dev \
    gpg-agent \
    vim \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*

RUN add-apt-repository -y ppa:ethereum/ethereum && \
    apt-get update && apt-get install -y --no-install-recommends \
    solc \
    ethereum \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*

RUN curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash - && sudo apt-get install -y --no-install-recommends nodejs && apt-get clean && rm -rf /var/lib/apt/lists/*

###########
# echidna #
###########
FROM base AS echidna

COPY --from=trailofbits/echidna:latest /root/.local/bin/echidna-test /usr/local/bin/echidna-test

RUN update-locale LANG=en_US.UTF-8 && locale-gen en_US.UTF-8
ENV LANG=en_US.UTF-8 LANGUAGE=en_US:en LC_ALL=en_US.UTF-8

########
# node #
########
FROM echidna AS node
RUN yarn install

USER node
EXPOSE 3000
CMD ["ts-node", "src/main.ts"]


