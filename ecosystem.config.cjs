/** PM2 — keeps Flow X dev server running after terminal/agent sessions end */
module.exports = {
  apps: [
    {
      name: "flow-x",
      cwd: __dirname,
      script: "npm",
      args: "run dev",
      autorestart: true,
      watch: false,
      max_memory_restart: "800M",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
