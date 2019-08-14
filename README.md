# Mangrove Atlas


## Installation

Requirementes:

* NodeJs v10.5.3
* Yarn

This app was created using [https://github.com/facebook/create-react-app](create-react-app).

Before start you have to create an env file called `.env.local` copying the content inside `.env.sample`.
If you need more information about env variables you can follow [https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables](this instructions).

Install node dependencies:

```
yarn install
```

Init server for development:

```
yarn start
```

It will open automatically the browser [http://localhost:3000](http://localhost:3000).

# Deploy to staging

Put all your code in `develop` branch.

Add heroku site:

```
heroku git:remote -a mangroves-atlas
```

And deploy:

```
git push heroku develop:master
```

