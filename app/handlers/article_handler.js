const response = require('../responses/responses');

class ArticleHandler {
  constructor(service) {
    this.service = service;
  }

  async getOneArticle(req, res) {
    try {
      const result = await this.service.getOneArticle(req.params.id);
      response.success(res, 200, 'OK', 'detail of an article', result, null);
    } catch (err) {
      response.error(res, err);
    }
  }

  async getManyArticle(req, res) {
    try {
      const result = await this.service.getManyArticle();
      response.success(res, 200, 'OK', 'bunch of articles', result, null);
    } catch (err) {
      response.error(res, err);
    }
  }

  async createArticle(req, res) {
    try {
      const result = await this.service.createArticle(req.body);
      response.success(res, 201, 'CREATED', 'an article has successfuly created', result, null);
    } catch (err) {
      response.error(res, err);
    }
  }

  async updateArticle(req, res) {
    const id = req.params.id;
    const update = req.body;

    try {
      const result = await this.service.updateArticle(id, update);
      response.success(res, 200, 'MODIFIED', 'an article has successfuly modified', result, null);
    } catch (err) {
      response.error(res, err);
    }
  }

  async deleteArticle(req, res) {
    const id = req.params.id;

    try {
      const result = await this.service.deleteArticle(id);
      response.success(res, 200, 'DELETED', 'an article has successfuly deleted', result, null);
    } catch (err) {
      response.error(res, err);
    }
  }
}

module.exports = ArticleHandler;
