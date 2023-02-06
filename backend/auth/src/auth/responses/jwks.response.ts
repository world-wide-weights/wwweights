import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

/**
 * @description Base properties of JWK as generated via public key
 */
export class RsaJWKBase {
  /**
   *@description Identifies cryptographic algorithm family
   **/
  @Expose()
  @ApiProperty()
  kty: string;
  /**
   *@description RSA exponent
   **/
  @Expose()
  @ApiProperty()
  e: string;
  /**
   *@description RSA modulo
   **/
  @Expose()
  @ApiProperty()
  n: string;

  constructor(data: Partial<RsaJWKBase>) {
    Object.assign(this, data);
  }
}

/**
 *@description JWK with metadata necessary for proper usage within a JWKS
 **/
export class RsaJWK extends RsaJWKBase {
  /**
   *@description identify purpose of public key => "sig" for signature or "enc" for encryption
   **/
  @Expose()
  @ApiProperty({ description: 'Identify purpose of the key' })
  use: string;
  /**
   *@description KeyId used to identify key when exposing multiple
   **/
  @Expose()
  @ApiPropertyOptional({
    description:
      'Id of the key. Used for finding relevant information when looking up JWKS from client side',
  })
  kid?: string;
  /**
   *@description Algorithm
   **/
  @Expose()
  @ApiProperty({ description: 'Algorithm of the key' })
  alg: string;

  constructor(data: Partial<RsaJWK>) {
    super(data);
    Object.assign(this, data);
  }
}

/**
 * @description Wrapping Object for the JWKS Response
 */
export class JWKSResponse {
  @Expose()
  @Type(() => RsaJWK)
  @ApiProperty({
    isArray: true,
    type: RsaJWK,
    description: 'Key information list',
  })
  keys: RsaJWK[];
  constructor(data: Partial<JWKSResponse>) {
    Object.assign(this, data);
  }
}
