Data
==============================

Here lives all exploration and processing pipes developed for Mangrove Atlas platform.

Project Organization
------------

    ├── LICENSE                 <- The LICENSE using this project.
    ├── README.md               <- The top-level README for developers using this project.
    ├── CHANGELOG.md            <- The top-level CHANGELOG for developers using this project.
    ├── env.default     <- Environment vars definition
    ├── Makefile             <- Makefile with commands
    ├── .editorconfig   <- Helps maintain consistent coding styles
    ├── .pre-commit-config  <- Helps setup github basic precommit hooks
    ├── docker-compose.yml   <- Docker configs environment definition
    ├── .gitignore     <- files don't want to copy in githubs
    |
    ├── data
    │   ├── processed           <- The final, canonical data sets for modeling.
    │   └── raw                 <- The original, immutable data dump.
    |
    |
    └── notebooks           <- Naming convention is a number (for ordering),
        │                       the creator's initials, and a short `-` delimited e.g.
        │                       `1.0-jqp-initial-data-exploration`.
        │
        ├── .env
        ├── .dockerignore
        ├── requirements.txt           <- Notebooks requirements
        ├── Dockerfile                 <- Sets up Jupyter notebooks environment
        ├── jupyter_notebook_config.py / jupyter_server_config.py <- Configure Jupyter notebooks
        │
        ├── template_notebooks        <- where the notebooks template will live.
        └── Lab                 <- Testing and development
            │
            ├── data_exploration
            ├── data_processing
                ├── GEE
                ├── layers
                └── widgets-v2

--------

## How to use

The notebooks are organized in two main folders:
`data_exploration` and `data_processing`. The first one is used to explore the data and the second one is used to store the notebook pipes used to process the data.

Data is
## Steps for use

### Docker

- With [docker and docker-compose](https://docs.docker.com/) in your system, you can develop inside containers:

``` bash
make up
```

And if you want to get into the main container:

``` bash
make inside
```

------------

### Local

- Install requirements on your machine:

``` bash
make requirements
```

- Set up a new environment in your machine

``` bash
make create_environment && make requirements
```

------------

--------
<p><small>Project based on the <a target="_blank" href="https://drivendata.github.io/cookiecutter-data-science/">cookiecutter data science project template</a>. #cookiecutterdatascience</small></p>
