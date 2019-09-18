# Mangrove Atlas

## Table of Contents

1. [Installation & development](#installation--development)
2. [Deployment](#deployment)
3. [Good practices & Style guide](#good-practices--style-guide)

## Installation & development

Requirementes:

* NodeJs v10.5.3
* Yarn

This app was created using [https://github.com/facebook/create-react-app](create-react-app).

1. Before start you have to create an env file called `.env.local` copying the content inside `.env.sample`. If you need more information about env variables you can follow [https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables](this instructions).

2. Install node dependencies:
```
yarn install
```

3. Init server for development:
```
yarn start
```

It will open automatically the browser [http://localhost:3000](http://localhost:3000).

## Deployment

We have two deployment instances.
1. Development/Staging (Automatically deployed on develop branch push)
2. Production/Release (Automatically deployed on master branch push)

The idea is to merge to master once a week and update the changelog.

### Manual deploy

Put all your code in `develop` branch.

Add heroku site:

```
heroku git:remote -a mangroves-atlas
```

And deploy:

```
git push heroku develop:master
```
**[⬆ back to top](#table-of-contents)**

## Good practices & Style guide

This is loosely based on [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript). The purpose of this section is to improve quality of code by defining some rules for create standard, clean and readable code. It is opinionated, the rules expressed are not intented to be the best or only way to write code, but they try to achieve the following:

* Establish a unique non-ambiguous convention for these repository that is expected to be followed for any contribution, internal or external.
* Help solve conflicts regarding PRs and requested changes, this is the source of truth for the repository. If it is not defined here it cannot be used as an argument for requesting changes, ADD IT by first reaching contributors concensus. Following the same logic, "I like it this way" is not an argument, please refer to this guide if you are requestiong changes.

This section is a work in progress but please don't write things to be defined at a later time, either it is in the guide or it is not, if you don't have the time to add it properly probably it is not important enough to be enforced by this guide.

### Directory structure

* Components are expected to be in its own directory inside of `src/components`.
* Components are expected to have an `index.js` file that will be used for the container part and redux connect, it can be a single line export. This is the only part of the component that should change if the component is used somewhere else.
* Do not nest components, prefix children components if you think is needed. Nesting components makes difficult to discover components by visual directory inspection because those nested components won't appear on the top-level components folder.

### Javascript

* Use arrow functions only if object context is needed, otherwise use regular functions.
* Use destructuring for function parameters whenever it is possible.
* If statements need brackets even if it is single line.

### CSS and SCSS

Style is expected to be in a `style.module.scss` file at component level. There are two exceptions.
* Top level styles.
* Plugins specific style that follows other conventions (ex. style.js).

### React

* Try to use function components.
* Use hooks whenever it is possible.