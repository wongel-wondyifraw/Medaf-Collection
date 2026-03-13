import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 50  },  // ramp up to 50 users
    { duration: '20s', target: 100  },  // ramp up to 100 users
    { duration: '10s', target: 0   },  // ramp down
  ],
};

export default function () {
  const res = http.get('http://localhost:3000/categories');

  let body;
  try {
    body = JSON.parse(res.body);
  } catch (e) {
    body = [];
  }

  check(res, {
    'status is 200':        (r) => r.status === 200,
    'returns array':        (r) => Array.isArray(body),
    'has categories':       (r) => body.length > 0,
    'response under 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}