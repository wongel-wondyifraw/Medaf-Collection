import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const res = http.post(
    'http://localhost:3000/auth/login',
    JSON.stringify({
      email: 'john@gmail.com',
      password: '123456',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  // 1. Parse body safely
  let body;
  try {
    body = JSON.parse(res.body);
  } catch (e) {
    body = {};
  }

  // 2. Log response if something goes wrong
  console.log(`Status: ${res.status} | Body: ${res.body}`);

  check(res, {
    'status is 201':        (r) => r.status === 201,  // ← NestJS POST returns 201
    'has token':            (r) => body.token !== undefined,
    'response under 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}