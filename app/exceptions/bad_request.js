class BadRequest extends Error{
  constructor(message){
    super(message);
    this.status = 'BAD_REQUEST';
    this.statusCode = 400;
  }
}

module.exports = BadRequest;
