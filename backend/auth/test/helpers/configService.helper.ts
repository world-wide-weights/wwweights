/**
 * @description Mock of the configservice. Returns preset values
 */
export class MockConfigService {
  public values = {
    JWT_PRIVATE_KEY:
      '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAl3MdIsdaQQVGaEbyWCet4sHcjsXQ4l56RN0YKqXNgyqFLEHM\ntEdRrlpFbFcDIwQtSWeDldZTali6R/z3Z+cX+7SGVw3/+7syPYerPfVbGQlIoNNv\nhXNH0uXxn8iKPykAIsK09zkmop+8Sg6SCBiVQ43gFNg/7noqec4n9+ectVUZg3AV\ntfHVJXQjc9yI2X3eD5/wAuMcdYjps2ZEj/dv2VyFEkZWX1IS+cgGxx2LO0IYTQSr\nQyOrL3fjOloH74ChQAE/ampTG2aVOz3bXEtaogyjplf0cdwbM+qib2god8TNFhMn\nmtjoFIOdK2UwB1Fyy8kVoCffDDPNn+YhygAFrwIDAQABAoIBABAb+35mjBAceoe+\n/CoqVlGnY0mAex6JBCJtDhQDPN/11uKFQTvv1h1glr/WZYwE9rg3HYUDni3SsEXV\n/476ws9QPXXnFFJ3b/mhg7J8dastFJ+evd8JCxvAv7nKQAJF3zDTWyJs3tIvgXyz\nHg9kZgQghDRTaEF6lygLqK6y4TVcZPjbCMqQJaQ5Qlf2ROOXfG3t28z8A63j17ZS\nZqDp//+FiUau/2YQ1oAsW8nRS7ruGTWdPnBHpeE2Pw5dnGAa1z0SNr5lKKKsXpVm\nHkTEmRqFxczLhrLAe99Wo2q+oI2JsmXN4xFBaZbKf562nB6jXOnztKhPg3AofWlq\nJT04qHECgYEA0ZhapRqc2CITJTgisYTaRJ1HoKdtb0A3PNi3QdjKdQyxnzITjxSx\nmhCPhHasA4rEjPRxuttszxODW52iHJdnm5a6qx3R9C86ptvnaQZMUHDKdfXOK41l\nX2AQEJCkhIHB7U1aukcEM4pT2u6CAo3WoZIefYmjm1S8l9zElQtfVzkCgYEAuPsh\nt/BQBexkwToyoWOI+Vp2zOvA3LIDW8M2jyKIRxeG/V7r3LxZ3mogKag1r+4ebNbZ\nhRRipZRwyt4GcZ2uU9lUioIkSVXTO/pSdLoldRcdqdTFvHg7lfjaNihIftPP+kez\nN48VyPzCyOnroVQKbEK238WSVsBkYvjyhQTrnCcCgYAnvwiRfrZ3lh6jVD3gBB2Q\nHXNT1+w8yKSw+TfnWMEr6ThVxB1JaNc1LCbLK+X61fnn8QMQOEQuELk8SmxPl7ai\nHrdPc9w4viwVMGZ12CfoqTr7m515TNsIdyMUwRkxt5ma8qxd3tHBJF46ijhFW7hz\n802s6MkJz8vj0I3G5d0yoQKBgGkgJ5h+VSwYnWYG6hE4HPcBB3UMIk4KSMhUl+Qe\nju5AG7JQyKBo1nYFQAQMmX5DSD04mOP9otZRFwzjwyu8nf7/CwGwVmjrAqIab9Pw\nmisCGRSUXE/w0IQ5qeGPYSvaul6Vcu+HPK09oIFIF2ZW+ZlvDLj9cl4k9qgcrM8V\n7cSPAoGBALv8PgLDZWHgeLz7nGmK1N8ejcL2JSo+zyoLNIea4C/lkWi2dPoyucF0\nP6wF4i7vk5rN4EQPz2yESlbppzs3l1bHFZ21sN1cuc4rM+ZQf+LhmoIHzDvSGalq\nPWVQlnWphdMWwXwWV+sgvCQWET1Qs7Ll1R7v7z5p8LrQpvImingP\n-----END RSA PRIVATE KEY-----',
    JWT_PUBLIC_KEY:
      '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAl3MdIsdaQQVGaEbyWCet\n4sHcjsXQ4l56RN0YKqXNgyqFLEHMtEdRrlpFbFcDIwQtSWeDldZTali6R/z3Z+cX\n+7SGVw3/+7syPYerPfVbGQlIoNNvhXNH0uXxn8iKPykAIsK09zkmop+8Sg6SCBiV\nQ43gFNg/7noqec4n9+ectVUZg3AVtfHVJXQjc9yI2X3eD5/wAuMcdYjps2ZEj/dv\n2VyFEkZWX1IS+cgGxx2LO0IYTQSrQyOrL3fjOloH74ChQAE/ampTG2aVOz3bXEta\nogyjplf0cdwbM+qib2god8TNFhMnmtjoFIOdK2UwB1Fyy8kVoCffDDPNn+YhygAF\nrwIDAQAB\n-----END PUBLIC KEY-----',
    JWT_AUTH_KID: 'auth-base-key',
    API_KEYS: 'abc,def',
    JWT_EXPIRE_TIME: '15m',
    JWT_REFRESH_EXPIRE_TIME: '10h',
  };

  /**
   * @description Return value if existant in predetermined object
   */
  get(key: string) {
    return this.values[key];
  }
}
