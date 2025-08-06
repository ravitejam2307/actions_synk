const request = require('supertest');
const app = require('../src/index');

describe('App Tests', () => {
  test('GET / should return hello world', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);
    
    expect(response.body.message).toBe('Hello World!');
    expect(response.body.version).toBe('1.0.0');
  });

  test('GET /health should return health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.status).toBe('healthy');
    expect(response.body.timestamp).toBeDefined();
  });
});
