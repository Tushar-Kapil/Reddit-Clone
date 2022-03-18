const rootDir = process.env.NODE_ENV === "development" ? "src" : "build";

module.exports = {
  type: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: "",
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [rootDir + "/entity/**/*{.ts,.js}"],
  migrations: [rootDir + "/migration/**/*{.ts,.js}"],
  subscribers: [rootDir + "/subscriber/**/*{.ts,.js}"],
  seeds: [rootDir + "/seeds/**/*{.ts,.js}"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};
