import * as assert from 'node:assert/strict';
import { AppService } from './src/app.service';
import { presentUser } from './src/user/user.presenter';

const appService = new AppService();
const status = appService.getStatus();

assert.equal(status.name, 'Auth API');
assert.equal(status.status, 'ok');
assert.ok(status.timestamp);

const response = presentUser({
  id: 'user_1',
  role: 'user',
  name: 'Federico Morel',
  mail: 'federico@example.com',
  passwordHash: 'hash',
  street: 'Av. 9 de julio 1925',
  location: '-',
  city: 'CABA',
  country: 'Argentina',
  cp: '1072',
  phone: '1128382932',
  birthday: new Date('2001-02-20T00:00:00.000Z'),
  date: new Date('2022-11-21T23:42:19.183Z'),
  updatedAt: new Date('2022-11-21T23:42:19.183Z'),
});

assert.equal(response.address.city, 'CABA');
assert.equal(response.mail, 'federico@example.com');

console.log('Tests passed');
