export class RegisterUserDto {
  email: string;
  password: string;
  organizationId: number;
  role: 'Owner' | 'Admin' | 'Viewer';
}
