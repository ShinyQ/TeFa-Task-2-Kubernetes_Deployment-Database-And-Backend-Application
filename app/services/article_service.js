const Joi = require('joi');
const SQLNoRow = require('../exceptions/sql_no_row');
const NotFoundError = require('../exceptions/not_found_error');
const InternalServerError = require('../exceptions/internal_server_error');
const NotImplemented = require('../exceptions/not_implemented');
const BadRequest = require('../exceptions/bad_request');
const ArticleModel = require('../models/article_model');

class ArticleService {
  constructor(promiseMysqlPool) {
    this.dbPool = promiseMysqlPool;
  }

  async getOneArticle(id) {
    try {
      const connection = await this.dbPool.getConnection();

      const queryResult = await connection.execute('SELECT id, title, subtitle, content, createdAt, updatedAt FROM article WHERE id = ?', [id]);
      if (queryResult[0].length < 1) {
        throw new SQLNoRow();
      }

      connection.release();

      return queryResult[0][0]

    } catch (err) {
      console.error(err.message);

      let error;

      if (err instanceof SQLNoRow) {
        error = new NotFoundError('article is not found');
      } else {
        error = new InternalServerError('an error occurred while getting article');
      }

      throw error;
    }
  }

  async getManyArticle() {

    try {
      const connection = await this.dbPool.getConnection();

      const queryResult = await connection.execute('SELECT id, title, subtitle, content, createdAt, updatedAt FROM article ORDER BY createdAt DESC');
      if (queryResult[0].length < 1) {
        throw new NotFoundError('article is not found');
      }

      connection.release();

      return queryResult[0]

    } catch (err) {
      console.error(err.message);

      let error;

      if (err instanceof SQLNoRow) {
        error = new NotFoundError('article is not found');
      } else {
        error = new InternalServerError('an error occurred while getting article');
      }

      throw error;
    }
  }

  async createArticle(params) {
    try {

      // validate the request body of new article.
      await ArticleModel.getCreateArticleModel().validateAsync(params);
      
      // construct an article entity, it would be the object that used to store to database.
      const article = {
        id: null,
        title: params.title,
        subtitle: params.subtitle,
        content: params.content,
        createdAt: new Date(),
        updatedAt: null,
      };

      // get db connection.
      const connection = await this.dbPool.getConnection();

      // execute query, it will run the command to store article object to db.
      const queryResult = await connection.execute('INSERT INTO article SET title = ?, subtitle = ?, content = ?, createdAt = ?', [
        article.title, article.subtitle, article.content, article.createdAt
      ]);

      // release the db connection, it will send the unused connection back to the pool.
      connection.release();

      // override the article id with the new id that returned in query result.
      article.id = queryResult[0].insertId;

      // return the resolved object that could be the demanded data result.
      return article;

    } catch (err) {
      // this block will collect the errors if occurred.

      console.error(err.message);

      if (err instanceof Joi.ValidationError) {
        throw new BadRequest(err.message);
      }

      throw new InternalServerError('an error occurred while getting article');
    }
  }

  async updateArticle(id, params) {
    try {

      // validate the request body of new article.
      await ArticleModel.getUpdateArticleModel().validateAsync(params);

      // get db connection.
      const connection = await this.dbPool.getConnection();

      // execute query for getting the existing article
      const queryResultForExistingArticle = await connection.execute('SELECT id, title, subtitle, content, createdAt, updatedAt FROM article WHERE id = ?', [id]);
      if (queryResultForExistingArticle[0].length < 1) {
        throw new SQLNoRow();
      }

      const existingArticle = queryResultForExistingArticle[0][0]

      const updatedArticle = {
        id: existingArticle.id,
        title: params.title,
        subtitle: params.subtitle,
        content: params.content,
        createdAt: existingArticle.createdAt,
        updatedAt: new Date(),
      };

      // execute query, it will run the command to update article object to db.
      await connection.execute('UPDATE article SET title = ?, subtitle = ?, content = ?, updatedAt = ? WHERE id = ?', [
        updatedArticle.title, updatedArticle.subtitle, updatedArticle.content, updatedArticle.updatedAt, updatedArticle.id
      ]);

      // release the db connection, it will send the unused connection back to the pool.
      connection.release();

      // return the resolved object that could be the demanded data result.
      return updatedArticle;

    } catch (err) {
      // this block will collect the errors if occurred.

      console.error(err.message);

      if (err instanceof Joi.ValidationError) {
        throw new BadRequest(err.message);
      }

      if (err instanceof SQLNoRow){
        throw new NotFoundError('article is not found');
      }

      throw new InternalServerError('an error occurred while getting article');
    }
  }

  async deleteArticle(id) {
    try {

      // get db connection.
      const connection = await this.dbPool.getConnection();

      // execute query for getting the existing article
      const queryResultForExistingArticle = await connection.execute('SELECT id, title, subtitle, content, createdAt, updatedAt FROM article WHERE id = ?', [id]);
      if (queryResultForExistingArticle[0].length < 1) {
        throw new SQLNoRow();
      }

      const deletedArticle = queryResultForExistingArticle[0][0]

      // execute query, it will run the command to remove article object from db.
      await connection.execute('DELETE FROM article WHERE id = ?', [
        deletedArticle.id
      ]);

      // release the db connection, it will send the unused connection back to the pool.
      connection.release();

      // return the resolved object that could be the demanded data result.
      return deletedArticle;

    } catch (err) {
      // this block will collect the errors if occurred.

      console.error(err.message);

      if (err instanceof Joi.ValidationError) {
        throw new BadRequest(err.message);
      }

      if (err instanceof SQLNoRow){
        throw new NotFoundError('article is not found');
      }

      throw new InternalServerError('an error occurred while getting article');
    }
  }
}

module.exports = ArticleService;
