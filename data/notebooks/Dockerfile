FROM mambaorg/micromamba:1.4.4 AS base

SHELL [ "/bin/bash", "-l", "-c" ]

USER root


# Update repos and install dependencies
RUN apt-get update && \
    apt-get install -y \
    make \
    git \
    python3-rtree \
    software-properties-common \
    graphviz \
    tini \
    ca-certificates \
    build-essential \
    sqlite3 \
    libsqlite3-dev \
    zlib1g-dev \
    manpages-dev \
    curl \
    tzdata \
    unzip \
    xclip \
    libedit-dev \
    g++ && export CXX=g++ && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN sed -i 's/^#force_color_prompt=yes/force_color_prompt=yes/' /etc/skel/.bashrc

# Create a directory and copy in all files
RUN mkdir -p /tmp/tippecanoe-src
RUN git clone https://github.com/mapbox/tippecanoe.git /tmp/tippecanoe-src
WORKDIR /tmp/tippecanoe-src

# Build tippecanoe
RUN make \
    && make install

# Remove the temp directory and unneeded packages
WORKDIR /
RUN rm -rf /tmp/tippecanoe-src \
    && apt-get -y remove --purge build-essential && apt-get -y autoremove

FROM base AS stage_1
# Downloading gcloud package
RUN curl https://dl.google.com/dl/cloudsdk/release/google-cloud-sdk.tar.gz > /tmp/google-cloud-sdk.tar.gz

# Installing the package
RUN mkdir -p /usr/local/gcloud \
    && tar -C /usr/local/gcloud -xvf /tmp/google-cloud-sdk.tar.gz \
    && /usr/local/gcloud/google-cloud-sdk/install.sh

# Adding the package path to local
ENV PATH $PATH:/usr/local/gcloud/google-cloud-sdk/bin

FROM stage_1 AS stage_2
# Installing the basic packages
USER $MAMBA_USER
COPY --chown=$MAMBA_USER:$MAMBA_USER environment.yml /tmp/environment.yml

RUN micromamba install -n base --yes --file /tmp/environment.yml && \
    micromamba clean --all --yes

# TODO: export .env in here
# Otherwise python will not be found
ARG MAMBA_DOCKERFILE_ACTIVATE=1
RUN mkdir -p /home/$MAMBA_USER/.config
USER root
RUN npm install -g mapshaper@latest

FROM stage_2 AS stage_3

USER $MAMBA_USER

WORKDIR /home/$MAMBA_USER
# Add requirements file
COPY --chown=$MAMBA_USER:$MAMBA_USER jupyter_notebook_config.py /etc/jupyter/
COPY --chown=$MAMBA_USER:$MAMBA_USER jupyter_server_config.py .jupyter/jupyter_server_config.py
# Jupyter with Docker Compose

EXPOSE 8888

ENTRYPOINT ["/usr/local/bin/_entrypoint.sh", "jupyter", "lab", "--ip=0.0.0.0","--allow-root", "--no-browser", "--collaborative", "--ServerApp.disable_check_xsrf=True", "--ServerApp.token=''"]
