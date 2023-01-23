import { Expose, Type } from 'class-transformer';

/**
 * @description Base properties of JWK as generated via public key
 */
export class RsaJWKBase {
  /**
   *@description Identifies cryptographic algorithm family
   **/
  @Expose()
  kty: string;
  /**
   *@description RSA exponent
   **/
  @Expose()
  e: string;
  /**
   *@description RSA modulo
   **/
  @Expose()
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
  use: string;
  /**
   *@description KeyId used to identify key when exposing multiple
   **/
  @Expose()
  kid?: string;
  /**
   *@description Algorithm
   **/
  @Expose()
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
  keys: RsaJWK[];
  constructor(data: Partial<JWKSResponse>) {
    Object.assign(this, data);
  }
}
