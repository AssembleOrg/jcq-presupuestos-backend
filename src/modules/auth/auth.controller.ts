import { Controller, Post, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto';
import { UserResponseDto } from '~/modules/users/dto';
import { Public, Auditory, Roles } from '~/common/decorators';
import { JwtAuthGuard, RolesGuard } from '~/common/guards';
import { AuditInterceptor } from '~/common/interceptors';
import { UserRole } from '@prisma/client';

@ApiTags('Autenticación')
@Controller('auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN)
  @Auditory({ action: 'CREATE', entity: 'User' })
  @ApiOperation({ 
    summary: 'Registrar nuevo usuario',
    description: 'Endpoint protegido para registrar usuarios. Solo Admin y Subadmin pueden registrar nuevos usuarios. La contraseña se hashea automáticamente.'
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token inválido o no proporcionado.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado. Solo Admin y Subadmin pueden registrar usuarios.',
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya está registrado',
  })
  async register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    return this.authService.register(registerDto);
  }
}

