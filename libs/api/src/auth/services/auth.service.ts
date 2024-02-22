import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as schema from '../../common/models';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, ilike } from 'drizzle-orm';
import {
  TLoginRequest,
  TLoginResponse,
  TRegisterRequest,
  TRegisterResponse,
  TGoogleRequest,
} from '@psu/entities';
import {
  comparePassword,
  encryptPassword,
  generateAccessToken,
  generateRefreshToken,
} from '../../common';
@Injectable()
export class AuthService {
  constructor(
    @Inject('drizzle') private drizzle: NodePgDatabase<typeof schema>
  ) {}
  async login(payload: TLoginRequest): Promise<TLoginResponse> {
    try {
      const { email, password } = payload;
      const res = await this.drizzle
        .select({
          id: schema.users.id,
          fullname: schema.users.fullname,
          email: schema.users.email,
          password: schema.users.password,
          role: {
            id: schema.roles.id,
            name: schema.roles.name,
            permissions: schema.roles.permissions,
          },
        })
        .from(schema.users)
        .leftJoin(schema.roles, eq(schema.roles.id, schema.users.roleId))
        .where(eq(schema.users.email, email))
        .then((res) => res.at(0));

      const isPasswordValid =
        res && comparePassword(password as string, res.password as string);

      if (!res || !isPasswordValid) {
        throw new UnauthorizedException('Email atau password tidak valid');
      }

      const [accessToken, refreshToken, expired] = await Promise.all([
        generateAccessToken({
          sub: res.id,
          email: res.email,
          role: {
            name: res.role?.name || '',
            permissions: res.role?.permissions || [],
          },
        }),

        generateRefreshToken({
          sub: res.id,
          email: res.email,
          role: {
            name: res.role?.name || '',
            permissions: res.role?.permissions || [],
          },
        }),
        (() => {
          const expiresIn = 15 * 60 * 1000;
          const now = Date.now();
          return now + expiresIn;
        })(),
      ]);

      return {
        id: res.id,
        token: {
          expired,
          refreshToken,
          accessToken,
        },
        user: {
          id: res.id,
          fullname: res.fullname as string,
          email: res.email,
          role: {
            id: res.role?.id as string,
            name: res.role?.name || '',
            permissions: res.role?.permissions || [],
          },
        },
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async register(payload: TRegisterRequest): Promise<TRegisterResponse> {
    try {
      const { email, password, fullname } = payload;

      const [isEmailExist, findRole] = await Promise.all([
        this.drizzle
          .select({
            id: schema.users.id,
          })
          .from(schema.users)
          .where(eq(schema.users.email, email))
          .then((res) => res.at(0)),
        this.drizzle
          .select({
            id: schema.roles.id,
          })
          .from(schema.roles)
          .where(ilike(schema.roles.name, 'Ormawa'))
          .then((res) => res.at(0)),
      ]);

      if (isEmailExist) {
        throw new ConflictException('Email telah digunakan');
      }
      await this.drizzle.insert(schema.users).values({
        email,
        password: await encryptPassword(password),
        fullname,
        roleId: findRole?.id,
      });

      return {
        message: 'Akun berhasil dibuat, silahkan login!',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async google(payload: TGoogleRequest) {
    try {
      const { email, avatar, fullname } = payload;

      let res = await this.drizzle
        .select({
          id: schema.users.id,
          fullname: schema.users.fullname,
          email: schema.users.email,
          role: {
            id: schema.roles.id,
            name: schema.roles.name,
            permissions: schema.roles.permissions,
          },
        })
        .from(schema.users)
        .leftJoin(schema.roles, eq(schema.roles.id, schema.users.roleId))
        .where(eq(schema.users.email, email as string))
        .then((res) => res.at(0));

      if (!res) {
        const [insertUser, findRole] = await Promise.all([
          this.drizzle
            .insert(schema.users)
            .values({
              email,
              avatar,
              fullname,
            })
            .returning({
              id: schema.users.id,
              fullname: schema.users.fullname,
              email: schema.users.email,
            })
            .then((res) => res.at(0)),
          this.drizzle
            .select({
              id: schema.roles.id,
              name: schema.roles.name,
              permissions: schema.roles.permissions,
            })
            .from(schema.roles)
            .where(ilike(schema.roles.name, 'Ormawa'))
            .then((res) => res.at(0)),
        ]);

        if (!insertUser || !findRole) {
          throw new BadRequestException();
        }

        res = {
          id: insertUser.id,
          fullname: insertUser.fullname,
          email: insertUser.email,
          role: {
            id: findRole.id,
            name: findRole.name,
            permissions: findRole.permissions,
          },
        };
      }

      const [accessToken, refreshToken, expired] = await Promise.all([
        generateAccessToken({
          sub: res.id,
          email: res.email,
          role: {
            name: res.role?.name || '',
            permissions: res.role?.permissions || [],
          },
        }),

        generateRefreshToken({
          sub: res.id,
          email: res.email,
          role: {
            name: res.role?.name || '',
            permissions: res.role?.permissions || [],
          },
        }),
        (() => {
          const expiresIn = 15 * 60 * 1000;
          const now = Date.now();
          return now + expiresIn;
        })(),
      ]);

      return {
        id: res.id,
        token: {
          expired,
          refreshToken,
          accessToken,
        },
        user: {
          id: res.id,
          fullname: res.fullname as string,
          email: res.email,
          role: {
            id: res.role?.id as string,
            name: res.role?.name || '',
            permissions: res.role?.permissions || [],
          },
        },
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
