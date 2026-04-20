import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async register(payload: RegisterUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { mail: payload.mail },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    return this.prisma.user.create({
      data: this.toCreateData(payload, passwordHash),
    });
  }

  async findByMail(mail: string) {
    return this.prisma.user.findUnique({
      where: { mail },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(payload: UpdateUserDto) {
    const user = await this.findById(payload.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (payload.mail && payload.mail !== user.mail) {
      const existingMail = await this.findByMail(payload.mail);
      if (existingMail) {
        throw new ConflictException('Mail already in use');
      }
    }

    return this.prisma.user.update({
      where: { id: payload.id },
      data: await this.toUpdateData(payload),
    });
  }

  private toCreateData(payload: RegisterUserDto, passwordHash: string): Prisma.UserCreateInput {
    return {
      role: 'user',
      name: payload.name,
      mail: payload.mail,
      passwordHash,
      street: payload.address.street,
      location: payload.address.location,
      city: payload.address.city,
      country: payload.address.country,
      cp: payload.address.cp,
      phone: payload.phone,
      birthday: new Date(payload.birthday),
    };
  }

  private async toUpdateData(payload: UpdateUserDto): Promise<Prisma.UserUpdateInput> {
    const data: Prisma.UserUpdateInput = {};

    if (payload.name !== undefined) {
      data.name = payload.name;
    }

    if (payload.mail !== undefined) {
      data.mail = payload.mail;
    }

    if (payload.password !== undefined) {
      data.passwordHash = await bcrypt.hash(payload.password, 10);
    }

    if (payload.address) {
      data.street = payload.address.street;
      data.location = payload.address.location;
      data.city = payload.address.city;
      data.country = payload.address.country;
      data.cp = payload.address.cp;
    }

    if (payload.phone !== undefined) {
      data.phone = payload.phone;
    }

    if (payload.birthday !== undefined) {
      data.birthday = new Date(payload.birthday);
    }

    return data;
  }
}
