import { User } from '@prisma/client';

export function presentUser(user: User) {
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    mail: user.mail,
    address: {
      street: user.street,
      location: user.location,
      city: user.city,
      country: user.country,
      cp: user.cp,
    },
    birthday: user.birthday.toISOString(),
    phone: user.phone,
    date: user.date.toISOString(),
  };
}
