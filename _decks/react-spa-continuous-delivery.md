---
layout: deck
title: React SPA Continuous Delivery
permalink: /presents/react-spa-continuous-delivery/
presented_at: React Chicago Meetup
date: 2017-09-27
---

## What is CI/CD?

![](https://media1.giphy.com/media/ZAX620EH7wRpe/giphy.gif)

---

- Automatic
- Conditional
- Tested
- Idempotent
- Frequent

---

## What is a CI/CD Setup in GitLab?

---

- [GitLab CI](https://about.gitlab.com/features/gitlab-ci-cd/)
- Based on Docker
- Shared or hosted
- Triggered by & linked to code
- Artifacts, etc.

---

~~~yaml
image: node:latest

before_script:
  - npm version
  - npm install &>/dev/null

test:
  script:
  - npm test -- --forceExit

staging:
  type: deploy
  script:
  - npm run build
  - ./some_deploy_script
  only:
  - master

production:
  type: deploy
  script:
  - npm run build
  - ./some_deploy_script
  only:
  - tags
  artifacts:
    paths:
    - build/
    expire_in: 1 week
~~~

---

## Pros and Cons of a Static SPA

---

- Drastic failure mode
- Clients are remote
- Poor SEO/API
- Scalable, Simple
- Zero downtime
- Treated as a client

---

## CI/CD with a Static SPA

---

- Compile and drop into bucket
- For easy rollback, [version buckets](http://docs.aws.amazon.com/AmazonS3/latest/dev/Versioning.html)
- Optionally, upgrade to Cloudfront

---

~~~yaml
staging:
  type: deploy
  script:
  - apt-get update -qy
  - apt-get install -y python-dev python-pip
  - pip install awscli
  - aws --version
  - npm run build
  - aws s3 sync build/ s3://$BUCKET_STAGING
  - ./ping_clients_staging
  only:
  - master
~~~

---

## Dynamically Upgrading Continuous Sessions

---

- On the page for months!
- How do other clients handle this?
- Signal, wait for downtime, pounce
- Polling or sockets for a version
- Watch [`visibility` API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- Watch input/progress state

~~~
    Semver Upgrade
    Invisible
    Unchanged
    Time Threshold
  + Connectivity
--------------
    Reload!
~~~

---

## Dealing with Data Upgrades on-Client

---

- Start caching early
- Store versions early
- Client cache is unreliable
- Have caching/versioning middleware

---

~~~js
import pkg from '../../package.json';
const version = pkg.version;

/**
 * get value for key
 *
 * @access public
 * @param {string} key
 * @returns {object|array} [value]
 */
export function getItem(key) {
    if (!window.localStorage) return;
    const item = localStorage.getItem(key);
    let parsed = item && JSON.parse(item);
    if (parsed && parsed.version) {
        if (version === parsed.version) {
            return parsed.data;
        }
    }
}
/**
 * set value for key
 *
 * @access public
 * @param {string} key
 * @param {object|array} value
 */
export function setItem(key, value) {
    if (!window.localStorage) return;
    return localStorage
        .setItem(
            key,
            JSON.stringify({
                version,
                data: value
            })
        );
}
~~~

---
