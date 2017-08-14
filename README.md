# RHMAP WebSocket Cloud Application

## Introduction
A WebSocket server that can be deployed on Red Hat Mobile Application Platform
3.X and 4.X.

## Client Application
This server powers a chat application that can be found [here](https://github.com/evanshortiss/rhmap-websockets-client).


## Prerequisites

* Node.js v4.4.3 or v6.9.1
* npm v2.15 or newer
* MongoDB 2.4 or newer
* Redis 2.X or newer

If you need to install node.js then [nvm](https://github.com/creationix/nvm) is
a great way to do so since it will allow you to run multiple node.js versions
concurrently on the same machine across different terminal sessions.

Installing MongoDB and Redis using Docker is probably the best option since you
can then easily change versions without need to modify your host machine.
[Here's a guide](https://developers.redhat.com/blog/2017/06/14/local-development-setup-for-red-hat-mobile-using-docker/) to setup MongoDB and Redis with Docker.

## Running the Server

```
git clone $REPO_URL websocket-cloud
cd websocket-cloud
npm install
```

While dependencies are installing you should create a new file inside the cloned
folder, call this file `.env` and add the following to it:

```
FH_USE_LOCAL_DB=true
FH_MONGODB_CONN_URL=mongodb://localhost:27017/FH_LOCAL
```

These variables will be injected into the application on startup by the `dotenv`
module when running locally. They configure the `fh-mbaas-api` module to use the
locally running MongoDB.

Once the `npm install` has completed you can start the server using:

* `npm start` - Start the application
* `npm run serve` - Start the application with auto-reload. Useful during
development when making changes to files.

If the server started correctly you'll see the following output:

```
➜ in rhmap-websockets-cloud git:(master [?]) npm start

> rhmap-websockets-cloud@0.1.0 start /Users/eshortis/workspaces/rhmap-websockets-cloud
> NODE_PATH=. node application.js | bunyan

[2017-08-14T17:15:50.984Z]  WARN: application/52255 on eshortis-OSX.local: loaded vars from .env file - should only happen locally
[2017-08-14T17:15:52.667Z]  INFO: application/52255 on eshortis-OSX.local: performing startup tasks
[2017-08-14T17:15:53.151Z]  INFO: sockets/52255 on eshortis-OSX.local: initialising socket.io server
[2017-08-14T17:15:53.234Z]  INFO: application/52255 on eshortis-OSX.local: application started on 0.0.0.0:8001
```
