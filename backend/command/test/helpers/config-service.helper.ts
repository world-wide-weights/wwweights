/**
 * @description Mock of the configservice. Returns preset values
 */
export class MockConfigService {
  public values = {
    SKIP_READ_DB_REBUILD: 'false',
    TEST_MODE: 'true',
  };

  /**
   * @description Reset values to default
   */
  reset() {
    this.values = {
      SKIP_READ_DB_REBUILD: 'false',
      TEST_MODE: 'true',
    };
  }

  /**
   * @description Return value if existant in predetermined object
   */
  get(key: string) {
    return this.values[key];
  }
}
