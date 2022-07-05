import knex from "knex";
import path from "path";
import { fileURLToPath } from "url";

// Constants
import { ARTICLE_TABLE_NAME } from "../constants/index.js";

// Mocks
import { articles } from "../mocks/index.js";

// ES module resolve
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Database {
  constructor() {
    this.client = "sqlite3";
    this.sqliteFile = `${__dirname}/db.sqlite`;

    this.database = knex({
      client: this.client,
      connection: {
        filename: this.sqliteFile,
      },
      debug: true,
    });

    this._start();
  }

  async _start() {
    await this._createTables();
    await this._seed();
  }

  async _createTables() {
    const hasArticleTable = await this.database.schema.hasTable(
      ARTICLE_TABLE_NAME
    );

    if (!hasArticleTable) {
      await this.database.schema.createTableIfNotExists(
        ARTICLE_TABLE_NAME,
        (tbl) => {
          tbl.increments("id").primary();
          tbl.text("thumbImage", 2000).notNullable();
          tbl.text("thumbImageAltText", 255).notNullable();
          tbl.text("title", 255).notNullable();
          tbl.text("description", 2000).notNullable();
          tbl.text("profileThumbImage", 2000);
          tbl.text("profileName", 255).notNullable();
          tbl.text("category", 255).notNullable();
          tbl
            .timestamp("postDate")
            .notNullable()
            .defaultTo(this.database.raw("CURRENT_TIMESTAMP"));
        }
      );
    }
  }

  async _seed() {
    const [articleDataCount] = Object.values(
      await this.database(ARTICLE_TABLE_NAME).count().first()
    );

    if (articleDataCount === 0) {
      articles.map(async (article) => {
        await this.database(ARTICLE_TABLE_NAME).insert(article);
      });
    }
  }
}

export const database = new Database().database;
