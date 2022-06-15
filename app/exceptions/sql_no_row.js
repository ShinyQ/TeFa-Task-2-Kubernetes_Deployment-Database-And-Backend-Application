class SQLNoRow extends Error{
  constructor(){
    super('sql: no row error');
  }
}

module.exports = SQLNoRow;
