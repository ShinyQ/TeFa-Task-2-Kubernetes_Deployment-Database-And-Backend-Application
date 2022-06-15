class InternalServerError extends Error{
  constructor(message){
    super(message);
    this.status = 'INTERNAL_SERVER_ERROR';
    this.statusCode = 500;
  }
}

module.exports = InternalServerError;
