/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import path from "path";
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hte1oiikuo.ufs.sh",
      },
    ],
  },
  outputFileTracingRoot: path.resolve(),
  experimental: {
    workerThreads: false,
  },
};

export default config;
