module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        // test: /\.(js|ts)x?$/,
        // for webpack 5 use
        and: [/\.(js|ts)x?$/],
      },

      use: ["@svgr/webpack"],
    });

    return config;
  },
  images: {
    domains: ["www.gravatar.com", "localhost"],
  },
};
