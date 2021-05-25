# GenRe Microservices v1.03

A nodeJS(ExpressJS) microservice server that helps geolocate nearby agents, and send bulk email requests to them. Written and maintained by [@coderkoala](https://github.com/coderkoala)

# Generic Realstate Agency Microservice

##### Server ochestration

Server can easily be ochestrated with [pm2(Process Manager 2)](https://pm2.keymetrics.io/) for nodeJS(v14^). To start the server, use the following command:

` pm2 start` Starts the server

`pm2 monit` Monitor your instance.

`pm2 delete <instance_id>` Use `pm2 monit` to fetch your `instance_id` so you can temporarily remove the server from running.

`pm2 restart` restarts the fork of the server.

##### Data fetch
You might want the server to fetch newly created agents info being synced with the microservice. In that case, you can run the npm script which does the rest for you:

```
npm run import
```

This will begin import. Might take a while, so please wait patiently until the script is done running. It fetches volume data in a batch of 5000 then bulk inserts it, updating already present agent with the updated data.

### Fresh Installation
Simply follow the following commands to initialize a fresh instance of the server.
```
git clone https://github.com/coderkoala/GenericProperties www
cd www
npm install

```
The project has been initialized. Next, install sequelize CLI to perform migrations.

```
npm i sequelize-cli -g
```
This installs sequelize for you to initialize your database. Next, perform the migration.
```
sequelize-cli db:create
sequelize-cli db:migrate
```
Next, you'll need to fetch data from your Dynamics CRM 2015 online server. Setup your environment file with the require credentials. [Refer to an example here.](https://github.com/coderkoala/GenericProperties/blob/master/.env.example))

After fetching data from upstream, you will need to install pm2 to deploy.

```
# globally install PM2
npm install pm2 -g

# check if installed properly
pm2 -V
```

Finally, start your server:
```
pm2 start
```
Refer to your pm2 environment configuration with your `ecosystem.config.js` file. It lists all parameters for the server to run.

---

#### License

Copyright © 2021 [Nobel Dahal](https://nobeldahal.com.np)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Made in behalf of a Generic Limited Liability Company.
