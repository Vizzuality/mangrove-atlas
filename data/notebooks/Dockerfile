FROM jupyter/datascience-notebook:python-3.8.6 AS base

SHELL [ "/bin/bash", "-l", "-c" ]

USER root


# Update repos and install dependencies
RUN apt-get update \
  && apt-get -y upgrade \
  && apt-get -y install git build-essential libsqlite3-dev zlib1g-dev

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
RUN pip install jupyter_contrib_nbextensions \
                jupyter_nbextensions_configurator \
                version_information \
                jupyterlab \
                nbdev \
                autopep8 \
                nbdime \
                vega \
                ipyleaflet \
                jupyterlab_templates

### GDAl trhough conda because it fails through pip
RUN conda update -n base conda && conda install -c conda-forge \
            python-blosc \
            cytoolz \
            gdal \
            dask==2.30 \
            xhistogram \
            lz4 \
            nomkl \
            dask-labextension==5.0 \
            python-graphviz \
            tini==0.18.0 \
            xarray=0.16.1
# Enable extensions
RUN jupyter contrib nbextension install --sys-prefix && \
                jupyter nbextensions_configurator enable  && \
                jupyter nbextension install --sys-prefix --py vega && \
                jupyter nbextension enable vega --py --sys-prefix &&  \
                jupyter nbextension enable --py --sys-prefix ipyleaflet && \
                jupyter labextension install jupyterlab_templates &&\
                jupyter serverextension enable --py jupyterlab_templates

FROM stage_2 AS stage_3

# Add requirements file
COPY jupyter_notebook_config.py /etc/jupyter/
COPY requirements.txt /app/
RUN pip install wheel -r /app/requirements.txt
RUN mkdir /opt/app
# Jupyter with Docker Compose
EXPOSE 8888
