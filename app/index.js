require('dotenv').config();
const configs = require('./configs/configs');
const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const ArticleService = require('./services/article_service');
const ArticleHandler = require('./handlers/article_handler');

const responses = require('./responses/responses');

// instantiate configs
const appConfig = configs.get('app');
const mysqlConfig = configs.get('mysql');

/**
 * main() will run the application.
 */
async function main() {
  const mysqlPool = mysql.createPool({
    ...mysqlConfig,
    timezone: '+07:00'
  })
  const promiseMysqlPool = mysqlPool.promise();

  const articleService = new ArticleService(promiseMysqlPool);
  const articleHandler = new ArticleHandler(articleService);

  const router = express();
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

  router.get('/v1/articles', articleHandler.getManyArticle.bind(articleHandler));
  router.post('/v1/articles', articleHandler.createArticle.bind(articleHandler));
  router.get('/v1/articles/:id', articleHandler.getOneArticle.bind(articleHandler));
  router.put('/v1/articles/:id', articleHandler.updateArticle.bind(articleHandler));
  router.delete('/v1/articles/:id', articleHandler.deleteArticle.bind(articleHandler));
  router.get('/', function (_, res) {
    responses.success(res, 200, 'OK', 'application is running properly', null, null);
  });

  const server = router.listen(appConfig.port, function () {
    console.info('application is running on port', appConfig.port);
  });

  process.on('SIGINT', function () {
    server.close(function (err) {
      if (err) {
        console.error(err.message);
      }
      console.info('server is gracefully shutdown')
    });

    mysqlPool.end(function (err) {
      if (err) {
        console.error(err.message);
      }
      console.info('mysql is gracefully shutdown')
    })

    setTimeout(function () {
      process.exit(0);
    }, 5 * 1000)
  })
}

main();
