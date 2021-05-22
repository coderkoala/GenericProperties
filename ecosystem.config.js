module.exports = {
  apps: [
    {
      script: "./bin/www",
      ignore_watch: ["logs", "node_modules", "public"],
      watch: "./",
      "log": "./logs/server.log",
      "log_type": "json",
      "log_date_format": "DD-MM-YYYY hh:mm"
    },
  ],

  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
