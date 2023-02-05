FROM node:16

ADD package.json /tmp/package.json
ADD yarn.lock /tmp/yarn.lock

RUN rm -fr build

RUN cd /tmp && yarn install 

ADD ./ /src

RUN rm -rf src/