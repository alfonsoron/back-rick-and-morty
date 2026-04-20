import { Injectable, NotFoundException } from '@nestjs/common';

type Character = {
  id: number;
  name: string;
  species: string;
  status: 'Alive' | 'Dead' | 'unknown';
};

@Injectable()
export class CharactersService {
  private readonly characters: Character[] = [
    { id: 1, name: 'Rick Sanchez', species: 'Human', status: 'Alive' },
    { id: 2, name: 'Morty Smith', species: 'Human', status: 'Alive' },
    { id: 3, name: 'Birdperson', species: 'Bird-Person', status: 'unknown' },
  ];

  findAll() {
    return {
      total: this.characters.length,
      results: this.characters,
    };
  }

  findOne(id: number) {
    const character = this.characters.find((item) => item.id === id);

    if (!character) {
      throw new NotFoundException(`Character with id ${id} not found`);
    }

    return character;
  }
}
