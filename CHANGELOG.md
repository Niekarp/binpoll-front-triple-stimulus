# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.0.7](https://github.com/pawel-antoniuk/binpoll-b2-docker/compare/v3.0.6...v3.0.7) (2019-10-12)


### Bug Fixes

* **renew:** adjust timeout and interval times ([2838d08](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/2838d08))



### [3.0.6](https://github.com/pawel-antoniuk/binpoll-b2-docker/compare/v3.0.5...v3.0.6) (2019-10-12)



### [3.0.5](https://github.com/pawel-antoniuk/binpoll-b2-docker/compare/v3.0.4...v3.0.5) (2019-10-11)


### Bug Fixes

* **debug:** change url again ([060783f](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/060783f))



### [3.0.4](https://github.com/pawel-antoniuk/binpoll-b2-docker/compare/v3.0.3...v3.0.4) (2019-10-11)


### Bug Fixes

* **debug:** change url to api ([448022f](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/448022f))



### [3.0.3](https://github.com/pawel-antoniuk/binpoll-b2-docker/compare/v3.0.2...v3.0.3) (2019-10-11)


### Bug Fixes

* **debug:** import module change ([aed9292](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/aed9292))



### [3.0.2](https://github.com/pawel-antoniuk/binpoll-b2-docker/compare/v3.0.1...v3.0.2) (2019-10-11)


### Bug Fixes

* resolve minor production problems ([f72e5bf](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/f72e5bf))



### [3.0.1](https://github.com/pawel-antoniuk/binpoll-b2-docker/compare/v3.0.0...v3.0.1) (2019-10-11)


### Bug Fixes

* **403:** remove state & reason fields ([ea4f038](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/ea4f038))
* **403:** stop app on session expire ([d93a83b](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/d93a83b))



## [3.0.0](https://github.com/pawel-antoniuk/binpoll-b2-docker/compare/v2.2.2...v3.0.0) (2019-10-11)


### Bug Fixes

* **403:** adjust no audio sets error ([5d3200f](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/5d3200f))
* **403:** handle 403 errors ([84d3bb8](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/84d3bb8))
* **captcha:** remove error messages ([b970796](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/b970796))
* **captcha:** resolve captcha once per test ([8f6eb31](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/8f6eb31))
* **comment:** remove pollData field ([586611d](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/586611d))
* **fatal-error:** change text ([785cc1d](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/785cc1d))
* **keyboard-nav:** remove captcha skipping ([1f6b292](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/1f6b292))
* **log-service:** start log service after auth ([9c63f79](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/9c63f79))
* **poll-data:** remove the use of audio-set-id ([653261f](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/653261f))
* **sample-set-model:** remove setId ([b2b979c](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/b2b979c))


### Features

* **captcha:** add captcha failed message ([0d307d6](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/0d307d6))
* **debug:** add debug module ([88db416](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/88db416))
* **nav-button:** add loading state with animation ([48fef10](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/48fef10))
* **retain:** add problem message when no audioSets available ([32048d5](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/32048d5))
* **session:** add interval renew request ([631a397](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/631a397))
* **siteKey:** add siteKey to config ([3e6a991](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/3e6a991))
* add captcha protection, change api, add debug panel ([99785a3](https://github.com/pawel-antoniuk/binpoll-b2-docker/commit/99785a3))


### BREAKING CHANGES

* start test B2



### [2.2.2](https://github.com/Niekarp/binpoll-front-triple-stimulus/compare/v2.2.1...v2.2.2) (2019-08-28)


### Bug Fixes

* **api-client:** change some big resources strategy ([ea50279](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/ea50279))



### [2.2.1](https://github.com/Niekarp/binpoll-front-triple-stimulus/compare/v2.2.0...v2.2.1) (2019-08-27)


### Bug Fixes

* api slashes ([b9ccf8a](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/b9ccf8a))
* delete log loop ([1a0aceb](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/1a0aceb))
* hide spinner on fatal error ([0b4aa43](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/0b4aa43))
* remove slash at the end of urls ([45c325d](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/45c325d))



## [2.2.0](https://github.com/Niekarp/binpoll-front-triple-stimulus/compare/v2.1.2...v2.2.0) (2019-08-23)


### Bug Fixes

* prevent sending multiple comments/reports ([9f88219](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/9f88219))
* **config.json:** config download once ([306f6e9](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/306f6e9))


### Features

* refactor snake case & add request handling strategy ([792e0d1](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/792e0d1))



### [2.1.2](https://github.com/Niekarp/binpoll-front-triple-stimulus/compare/v2.1.1...v2.1.2) (2019-08-14)


### Bug Fixes

* const/readonly properties capitalized ([8347188](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/8347188))
* **audio:** move audio requests to api service, add message after redownload audio success ([d55310c](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/d55310c))
* remove debug console logs ([6a2f835](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/6a2f835))
* resolve eslint indicated problems ([bcbedb5](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/bcbedb5))
* stop audio download on report page ([82846e5](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/82846e5))



### [2.1.1](https://github.com/Niekarp/binpoll-front-triple-stimulus/compare/v2.1.0...v2.1.1) (2019-08-09)


### Bug Fixes

* **log-service:** more detailed error message ([07fc0e7](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/07fc0e7))
* **page-navigation:** style, alignment and standarisation ([e4787ba](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/e4787ba))



## [2.1.0](https://github.com/Niekarp/binpoll-front-triple-stimulus/compare/v2.0.0...v2.1.0) (2019-08-07)


### Features

* add and apply pop-up service ([00c1a26](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/00c1a26))



## [2.0.0](https://github.com/Niekarp/binpoll-front-triple-stimulus/compare/v1.2.3...v2.0.0) (2019-08-07)


### refactor

* changes in many parts of the application ([202f396](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/202f396))


### BREAKING CHANGES

* rename & move & delete files, add models, api.service change, shared-config remove and move to config.service, seed download once and save to data.service, log.service error handling, code refactor



### [1.2.3](https://github.com/Niekarp/binpoll-front-triple-stimulus/compare/v1.2.2...v1.2.3) (2019-08-07)


### Bug Fixes

* **data-service:** stupidThing renamed ([0e54d49](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/0e54d49))
* **files:** move further-help-comp to common ui elements ([26dc5e0](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/26dc5e0))
* **poll-page:** remove snackbar cover by drag button ([b952567](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/b952567))



### [1.2.2](https://github.com/Niekarp/binpoll-front-triple-stimulus/compare/v1.2.1...v1.2.2) (2019-08-03)


### Bug Fixes

* **example-page:** video updated ([7215ec9](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/7215ec9))
* **poll-page:** img shadow flickering on safari removed ([ec9d739](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/ec9d739))
* **resources:** predownload images and movie ([d9d368d](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/d9d368d))



### [1.2.1](https://github.com/Niekarp/binpoll-front-triple-stimulus/compare/v1.2.0...v1.2.1) (2019-07-31)



## [1.2.0](https://github.com/Niekarp/binpoll-front-triple-stimulus/compare/v1.1.5...v1.2.0) (2019-07-30)


### Bug Fixes

* **poll-page:** audio button width adjusted ([7bdee56](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/7bdee56))
* **poll-page:** remove shadow flickering ([37fc085](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/37fc085))
* **poll-page:** removed border-content gap ([b8fd600](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/b8fd600))


### Features

* **poll-page:** add keyboard navigation ([3e78e88](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/3e78e88))



### [1.1.5](https://github.com/Niekarp/binpoll-front-triple-stimulus/compare/v1.1.4...v1.1.5) (2019-07-29)


### Bug Fixes

* **component-names:** replaced terms-sounds-page with acoustic-scenes-page ([8fae1c6](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/8fae1c6))
* **components-names:** added page to headphones-component name ([9931ff7](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/9931ff7))



### [1.1.4](https://github.com/Niekarp/binpoll-front-triple-stimulus/compare/v1.1.3...v1.1.4) (2019-07-27)


### Bug Fixes

* **poll-page:** add move style once ([4320274](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/4320274))
* **poll-page:** init poll data despite audio loaded ([9d092ec](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/9d092ec))
* **poll-page:** preserve poll data across pages ([c413050](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/c413050))
* **poll-page:** task counter text aligned vertically ([dd1c753](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/dd1c753))



### [1.1.3](https://github.com/Niekarp/binpoll-front-triple-stimulus/compare/v1.1.2...v1.1.3) (2019-07-25)


### Bug Fixes

* **poll-page:** stop music on further help open ([ea29c09](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/ea29c09))
* **welcome-page:** html elements aligned ([2702053](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/2702053))



### [1.1.2](https://github.com/Niekarp/binpoll-front-triple-stimulus/compare/v1.1.1...v1.1.2) (2019-07-25)



### [1.1.1](https://github.com/Niekarp/binpoll-front-triple-stimulus/compare/v1.1.0...v1.1.1) (2019-07-25)



## [1.1.0](https://github.com/Niekarp/binpoll-front-triple-stimulus/compare/v1.0.0...v1.1.0) (2019-07-23)


### Features

* add logService ([3970956](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/3970956))



## [1.0.0](https://github.com/Niekarp/binpoll-front-triple-stimulus/compare/v0.0.0...v1.0.0) (2019-07-22)


### Features

* application of standard-version package ([7b47679](https://github.com/Niekarp/binpoll-front-triple-stimulus/commit/7b47679))


### BREAKING CHANGES

* commit messages should now conform 'Conventional Commits specification'



## 0.0.0 (2019-07-22)
