Much u o me and i o u
=========

Prerequisites
---------------
- [Node.js](http://nodejs.org)

Getting Started
---------------

To get started, clone the repository:

```bash
git clone https://github.com/harrisonzhao/ics

cd ics

npm install

node app.js

#point the browser to localhost:3000 to visit the site
```

HOW TO ACCESS DATABASE (need mysql client):
mysql --host=us-cdbr-azure-east-a.cloudapp.net --user=b6bf084c45dab9 --password=c2bed79d iouuomeA14Hvih1b

Project Structure
-----------------

| Name                               | Description                                                 |
| ---------------------------------- |:-----------------------------------------------------------:|
| **config**/auth/passport.js        | Passport local and OAuth strategies                         |
| **config**/settings/auth.js        | Your API keys                                               |
| **config**/settings/secrets.js     | Database url and other settings                             |
| **config**/settings/exports.js     | Exports all files inside settings folder                    |
| **config**/config.js               | Has application configurations and middleware               |
| **controllers**/auth.js            | Controller for authentication                               |
| **controllers**/error.js           | Controller for handling errors                              |
| **controllers**/pages.js           | Controller for serving pages                                |
| **models**/User.js                 | Mongoose schema and model for User                          |
| **lib**/                           | User-created libraries to be included in controllers        |
| **public**/                        | Static assets such as fonts, css, js, img                   |
| **views**/                         | Templates for client pages                                  |
| app.js                             | Main application file where all routes are loaded           |