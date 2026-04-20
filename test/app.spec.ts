import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AppService } from '../src/app.service';
import { CharactersService } from '../src/characters/characters.service';

describe('AppService', () => {
  it('returns api status information', () => {
    const service = new AppService();
    const status = service.getStatus();

    assert.equal(status.name, 'Rick and Morty API');
    assert.equal(status.status, 'ok');
    assert.ok(status.timestamp);
  });
});

describe('CharactersService', () => {
  it('returns a seeded list of characters', () => {
    const service = new CharactersService();
    const response = service.findAll();

    assert.equal(response.total, 3);
    assert.equal(response.results[0]?.name, 'Rick Sanchez');
  });
});
