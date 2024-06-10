/** @type {import('next').NextConfig} */
const setupCronJobs = require('./src/app/libs/cronjobs/cronjobs');
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['thefabcode.org', 'example.com', 'anotherdomain.org', 'yetanotherdomain.com'],
    },
    webpack: (config, { isServer }) => {
      if (isServer) {
        setupCronJobs(); // Initialize the cron jobs
      }
      return config;
    },
  }
    module.exports = nextConfig
