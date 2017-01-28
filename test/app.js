const request = require('supertest');
const app = require('../app.js');

describe('GET /', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /ingresar', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/ingresar')
      .expect(200, done);
  });
});

describe('GET /registrar', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/registrar')
      .expect(200, done);
  });
});

describe('GET /api', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/api')
      .expect(200, done);
  });
});

describe('GET /contacto', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/contacto')
      .expect(200, done);
  });
});

describe('GET /random-url', () => {
  it('should return 404', (done) => {
    request(app)
      .get('/prueba')
      .expect(404, done);
  });
});
