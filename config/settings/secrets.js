module.exports = {
  mysqlConfigs: {
    host: 'us-cdbr-azure-east-a.cloudapp.net',
    user: 'b6bf084c45dab9',
    password: 'c2bed79d',
    database: 'iouuomeA14Hvih1b'
  },
  sessionSecret: process.env.SESSION_SECRET || 'Custom session secret',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000
};
