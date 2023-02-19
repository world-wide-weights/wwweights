import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

/**
 * @description Base properties of JWK as generated via public key
 */
export class RsaJWKBase {
  @Expose()
  @ApiProperty({
    description: 'Identifies cryptographic algorithm family',
    example: 'RSA',
  })
  kty: string;

  @Expose()
  @ApiProperty({ description: 'RSA exponent', example: 'AQAB' })
  e: string;

  @Expose()
  @ApiProperty({
    description: 'RSA module',
    example:
      'u8sRC2J7ZLiyA0hgRRJ0mlWbSYCqphQO__e2funNhgMBsRNz3YFGHot9AHYOo4PcSMRQ1VDcMIeSrDnNwC3D-xmcXsBh9qJPMEkrDM6wzuKBQKIUZV7EinevQdErwUjM9V5eU-sZSAvX0wWrRg6UxUg_RUAXqMYBs5GtPsA_uOM',
  })
  n: string;

  constructor(data: Partial<RsaJWKBase>) {
    Object.assign(this, data);
  }
}

/**
 *@description JWK with metadata necessary for proper usage within a JWKS
 **/
export class RsaJWK extends RsaJWKBase {
  @Expose()
  @ApiProperty({
    description: 'Identify purpose of the key',
    examples: ['sig', 'enc'],
  })
  use: string;

  @Expose()
  @ApiPropertyOptional({
    description:
      'Id of the key. Used for finding relevant information when looking up JWKS from client side',
    example: 'auth-base-key',
  })
  kid?: string;

  @Expose()
  @ApiProperty({ description: 'Algorithm of the key', example: 'RS256' })
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
