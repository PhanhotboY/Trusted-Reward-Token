import { QueryInterface, Sequelize } from "sequelize";
import { SequelizeStorage, Umzug, MigrationFn } from "umzug";

import { pgConfig } from "../configs/postgres.config";

const config = pgConfig[process.env.NODE_ENV || "development"];

class PostgreSQL {
  private static instance: PostgreSQL;
  private static sequelize: Sequelize;
  private static migrator: Umzug<QueryInterface>;

  private constructor() {
    PostgreSQL.createConnection();
  }

  private static createConnection() {
    if (!PostgreSQL.sequelize) {
      PostgreSQL.sequelize = new Sequelize({
        dialect: "postgres",
        host: config.host,
        port: config.port,
        username: config.user,
        password: config.password,
        database: config.database,
      });

      PostgreSQL.migrator = new Umzug({
        migrations: {
          glob: ["../api/migrations/*.ts", { cwd: __dirname }],
        },
        context: PostgreSQL.sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize: PostgreSQL.sequelize }),
        logger: console,
      });
    }
  }

  public async connect() {
    try {
      await PostgreSQL.sequelize.authenticate();
      console.log("Database connection has been established successfully.");
      return true;
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      return false;
    }
  }

  public async closeConnection() {
    try {
      await PostgreSQL.sequelize.close();
      console.log("Database connection has been closed successfully.");
      return true;
    } catch (error) {
      console.error("Unable to close the database:", error);
      return false;
    }
  }

  public static getInstance() {
    if (!PostgreSQL.instance) {
      PostgreSQL.instance = new PostgreSQL();
    }
    return PostgreSQL.instance;
  }

  public getSequelize() {
    PostgreSQL.createConnection();

    return PostgreSQL.sequelize;
  }

  public getMigrator() {
    PostgreSQL.createConnection();

    return PostgreSQL.migrator;
  }
}

export const pgInstance = PostgreSQL.getInstance();
export type Migration = MigrationFn<QueryInterface>;
