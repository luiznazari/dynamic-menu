class EnvironmentProvider {
  get(env, defaultValue = null) {
    const hasDefaultValue = defaultValue !== undefined && defaultValue !== null;
    const envValue = process.env[env];
    const hasValue = envValue !== undefined && envValue != null;
    
    if (!hasValue && !hasDefaultValue) {
      throw new Error(`Please, provide the '${env}' environment variable.'`);
    }

    return process.env[env];
  }
}

module.exports = new EnvironmentProvider();