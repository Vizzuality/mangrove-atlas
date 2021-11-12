FROM jupyter/datascience-notebook:python-3.8.6

SHELL [ "/bin/bash", "-l", "-c" ]

USER root

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

# Enable extensions
RUN jupyter contrib nbextension install --sys-prefix && \
                jupyter nbextensions_configurator enable  && \
                jupyter nbextension install --sys-prefix --py vega && \
                jupyter nbextension enable vega --py --sys-prefix &&  \
                jupyter nbextension enable --py --sys-prefix ipyleaflet && \
                jupyter labextension install jupyterlab_templates &&\
                jupyter serverextension enable --py jupyterlab_templates

# Add requirements file
COPY jupyter_notebook_config.py /etc/jupyter/
COPY requirements.txt /app/
RUN pip install wheel -r /app/requirements.txt
RUN mkdir /opt/app
# Jupyter with Docker Compose
EXPOSE 8888
