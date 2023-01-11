##############################################################################
#  Provide a development environment on NodeJS using last versions at today
##############################################################################
FROM alpine:latest
USER root                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              

LABEL maintainer=responsivecodex@gmail.com

# Parse arguments for the build command.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
ARG VERSION=1.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
ARG VCS_URL=https://hub.docker.com/r/responsivecodex/alpine-nodejs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
ARG VCS_REF=git rev-parse --short HEAD                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
ARG BUILD_DATE=2021-04-29                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
ARG NODEJS_VERSION=18.12.1-r0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
ARG NPM_VERSION=9.1.2-r0   

# A little bit of metadata management.
# See http://label-schema.org/
LABEL org.label-schema.schema-version="1.0" \
  org.label-schema.build-date=$BUILD_DATE \
  org.label-schema.vendor="UN-OCHA" \
  org.label-schema.version=$VERSION \
  org.label-schema.vcs-url=$VCS_URL \
  org.label-schema.vcs-ref=$VCS_REF \
  org.label-schema.name="rc-alpine-php" \
  org.label-schema.description="This service provides a base nodejs platform focused to Heroku." \
  org.label-schema.architecture="x86_64" \
  org.label-schema.distribution="Alpine Linux" \
  org.label-schema.distribution-version="3.14" \
  info.humanitarianresponse.nodejs=$NODEJS_VERSION \
  info.humanitarianresponse.python="3.8.8-r0" 

#RUN npm i -g npm@latest

#define the volumes at run time - far better
#VOLUME ["${SRC_DIR}", "${NODE_APP_DIR}"]


ENV NODE_APP_DIR=/usr/src \
  NODE_PATH=/usr/lib/node_modules  \
  NPM_CONFIG_SPIN=false  \
  NPM_CONFIG_PROGRESS=false  \
  SRC_DIR=/usr/src                    


##############################################################################
#  Long string commands but minimize the size on final image
#
#  Explain line 78-79:  Configure time&date to use location on Mexico City
#  Explain line 78-79:  Create two user: admin & vscode
#    the first was added to responsivecodex group
#    the second was added to users group
#    finally grant others permission as normal users.
##############################################################################
RUN apk update && \
  apk add --update-cache \         
  bash \
  sudo=1.9.12_p1-r1 \
  ip6tables \
  iptables \
  tcptraceroute \
  build-base \
  git \
  su-exec \
  python3-dev \
  py-pip \
  gcc && \
  apk add --update-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/main \
  nodejs=${NODEJS_VERSION} \
  npm=${NPM_VERSION} && \
  mkdir -p /root/.cache/node-gyp/latest && \
  apk del build-base && \
  rm -rf /tmp /root/.node-gyp && \
  rm -rf /var/cache/apk/* && \
  mkdir -p /tmp && \
  chmod 1777 /tmp && \
  USER=root  npm --force --cache /tmp/empty-cache install -g \
  express-generator \
  npm-check-updates \
  sass \
  nodemon \          
  jsdoc \
  heroku && \
  npm --force cache clean && \
  USER=root  rm -rf /etc/localtime && \
  USER=root  ln -s /usr/share/zoneinfo/America/Mexico_City /etc/localtime && \
  echo '%responsivecodex ALL=(ALL) ALL' > /etc/sudoers.d/responsivecodex && \
  addgroup -S responsivecodex && \
  adduser -h /usr/src --disabled-password --shell /bin/ash admin -G responsivecodex && \
  adduser -h /usr/src --disabled-password --shell /bin/ash vscode -G users && \
  for u in $(ls /home); do for g in disk lp floppy audio cdrom dialout video netdev games users; do addgroup $u $g; done;done 

# Setting password for recently created users.
RUN  echo admin:#Access2010# | chpasswd && \
  echo vscode:#Access2010# | chpasswd && \
  echo '#!/usr/bin/env ash' > /etc/profile.d/rc.sh && \
  echo "export PS1=\"\e[0;33m[\u@\D{%d.%m.%Y}\A \w]\$ \e[m\"" >> /etc/profile.d/rc.sh  && \
  chmod +x /etc/profile.d/rc.sh && \
  echo 'export PS1="\e[0;33m[\u@\D{%d.%m.%Y}\A \w]\$ \e[m"' >> /root/.ashrc && \
  sudo apk update && sudo apk add --update openssh-client

# Always and for all projects my working folder is..
WORKDIR /usr/src                                   

# My application on NodeJS listen this port (on dev-env)
EXPOSE 3000                                             

# Always must execute this shell to enable redirection of traffic to real world....
# https://responsivecodex.wordpress.com
#ENTRYPOINT ["/bin/ash","forwardip.sh"]         
  
ENTRYPOINT ["/bin/ash"]
