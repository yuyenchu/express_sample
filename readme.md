# Express Sample
This is a simple express server to showcase basic REST api methods, using ejs with express for simple login/out app.

# Installation guide:
- download the project with git clone or zip
- open terminal and cd into the directory
- install npm packages by entering ```npm i & npm i pm2 -g```
- start express server by entering ```pm2 start ecosystem.config.js```
- enter ```pm2 log sample-api-app``` to see the logs (optional)
- go to [localhost:3000](https://localhost:3000) and edit app.js to see what changes
- stop express server by entering ```pm2 stop sample-api-app```, and later start server with ```pm2 start sample-api-app``` if needed
- download [postman](https://www.postman.com/downloads/) for debugging (optional)

# Resources:
- [REST explanined](https://www.infoq.com/articles/rest-introduction/)
- [Express Tutorial](https://www.robinwieruch.de/node-express-server-rest-api)
- [Express docs](https://expressjs.com/en/4x/api.html)
- [EJS docs](https://ejs.co/#docs)
- [Moment.js docs](https://momentjs.com/docs/)
- [MySQL Tutorial](https://www.w3schools.com/mysql/)
- [mysql(npm) docs](https://www.npmjs.com/package/mysql)
- [PM2 ecosystem](https://pm2.keymetrics.io/docs/usage/application-declaration/)