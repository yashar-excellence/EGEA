import bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'chief_assessor' | 'assessor' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization: string;
  passwordHash: string;
}

// Demo users with hashed passwords
const users: User[] = [
  {
    id: '1',
    email: 'admin@egea.gov.eg',
    name: 'مدير النظام',
    role: 'admin',
    organization: 'EGEA',
    passwordHash: bcrypt.hashSync('admin123', 10),
  },
  {
    id: '2',
    email: 'assessor@egea.gov.eg',
    name: 'مقيّم',
    role: 'assessor',
    organization: 'EGEA',
    passwordHash: bcrypt.hashSync('assessor123', 10),
  },
  {
    id: '3',
    email: 'chief@egea.gov.eg',
    name: 'رئيس المقيّمين',
    role: 'chief_assessor',
    organization: 'EGEA',
    passwordHash: bcrypt.hashSync('chief123', 10),
  },
  {
    id: '4',
    email: 'viewer@egea.gov.eg',
    name: 'مشاهد',
    role: 'viewer',
    organization: 'EGEA',
    passwordHash: bcrypt.hashSync('viewer123', 10),
  },
];

export function getUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}
