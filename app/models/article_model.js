const joi = require('joi');

const getCreateArticleModel = function(){
  const model = joi.object({
    title: joi.string().required(),
    subtitle: joi.string().required(),
    content: joi.string().required()
  });

  return model;
}

const getUpdateArticleModel = function(){
  const model = joi.object({
    title: joi.string().required(),
    subtitle: joi.string().required(),
    content: joi.string().required()
  });

  return model;
}

module.exports = {
  getCreateArticleModel: getCreateArticleModel,
  getUpdateArticleModel: getUpdateArticleModel
}
