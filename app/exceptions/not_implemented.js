class NotImplemented extends Error{
  constructor(message){
    super(message);
    this.status = 'NOT_IMPLEMENTED';
    this.statusCode = 501;
  }
}

module.exports = NotImplemented;
