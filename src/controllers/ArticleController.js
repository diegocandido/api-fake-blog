import { database } from "../db/index.js";
import { ARTICLE_TABLE_NAME } from "../constants/index.js";

/**
 * @author Édson Fischborn
 */
class ArticleController {
  async get(_, res) {
    try {
      const articles = await database(ARTICLE_TABLE_NAME).select();
      return res.status(200).json(articles);
    } catch (ex) {
      return res.status(500).json({ ok: false, ex: ex.toString() });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ ok: false, ex: "id is empty" });
      }

      const article = await database(ARTICLE_TABLE_NAME)
        .select()
        .where({ id })
        .first();
      return res.status(200).json(article);
    } catch (ex) {
      return res.status(500).json({ ok: false, ex: ex.toString() });
    }
  }

  async getByCategory(req, res) {
    try {
      const { cat } = req.params;

      if (!cat) {
        return res.status(400).json({ ok: false, ex: "Category is empty" });
      }

      const article = await database(ARTICLE_TABLE_NAME)
        .select()
        .where({ category: String(cat).toLowerCase() });
      return res.status(200).json(article);
    } catch (ex) {
      return res.status(500).json({ ok: false, ex: ex.toString() });
    }
  }

  async create(req, res) {
    try {
      const { body, file } = req;

      const { thumbImageAltText, title, description, profileName, category } =
        body;

      if (
        !thumbImageAltText ||
        !title ||
        !description ||
        !profileName ||
        !category ||
        !file
      ) {
        return res.status(400).json({ ok: false, ex: "Missing article props" });
      }

      if (
        category.toLowerCase() !== "games" &&
        category.toLowerCase() !== "web"
      ) {
        return res
          .status(400)
          .json({ ok: false, ex: "Category is not 'games' or 'web'" });
      }

      const article = {
        thumbImage: `/img/${file.filename}`,
        thumbImageAltText,
        title,
        description,
        profileThumbImage: `/img/profile-1.jpg`,
        profileName,
        category: String(category).toLowerCase(),
      };

      const [id] = await database(ARTICLE_TABLE_NAME).insert(article);
      return res.status(201).json({ ok: true, id });
    } catch (ex) {
      return res.status(500).json({ ok: false, ex: ex.toString() });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ ok: false, ex: "id is empty" });
      }

      const article = await database(ARTICLE_TABLE_NAME)
        .select()
        .where({ id })
        .first();

      if (!article) {
        return res.status(404).json({ ok: false, ex: "post does not exists" });
      }

      await database(ARTICLE_TABLE_NAME).delete().where({ id });
      return res.status(200).json({ ok: true });
    } catch (ex) {
      return res.status(500).json({ ok: false, ex: ex.toString() });
    }
  }
}

export const articleController = new ArticleController();
