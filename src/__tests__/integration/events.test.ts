import request from 'supertest';
import { createTestApp, createTestUser, getAuthToken, cleanupDatabase } from '../helpers';

const app = createTestApp();

const validEvent = {
  title: 'Test Concert',
  description: 'An integration-test event',
  date: '2026-06-15',
  startTime: '20:00',
  ticketPrice: 50.0,
  totalTickets: 100,
};

// ─── GET /api/events ──────────────────────────────────────────────────────────

describe('GET /api/events', () => {
  it('returns 200 with an array', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// ─── POST /api/events ─────────────────────────────────────────────────────────

describe('POST /api/events', () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  it('returns 401 without an auth token', async () => {
    const res = await request(app).post('/api/events').send(validEvent);
    expect(res.status).toBe(401);
  });

  it('returns 201 and the created event with a valid token', async () => {
    const { user, plainPassword } = await createTestUser();
    const token = await getAuthToken(app, user.email, plainPassword);

    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send(validEvent);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(validEvent.title);
  });
});

// ─── GET /api/events/:id ──────────────────────────────────────────────────────

describe('GET /api/events/:id', () => {
  let createdEventId: string;

  beforeAll(async () => {
    const { user, plainPassword } = await createTestUser({ email: 'get-by-id@example.com' });
    const token = await getAuthToken(app, user.email, plainPassword);

    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send(validEvent);

    createdEventId = res.body.id;
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  it('returns 200 for an existing event', async () => {
    const res = await request(app).get(`/api/events/${createdEventId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdEventId);
  });

  it('returns 404 for a non-existent UUID', async () => {
    const res = await request(app).get('/api/events/00000000-0000-0000-0000-000000000000');
    expect(res.status).toBe(404);
  });
});
