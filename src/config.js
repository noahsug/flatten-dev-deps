import cosmiconfig from 'cosmiconfig'

const defaultConfig = {
  quiet: false,
  modifyPackageJson: false,
  preFlatten: () => {},
  preShrinkwrap: () => {},
}

const configResult = cosmiconfig('flatten-dev-deps', { sync: true }).load()
const userConfig = configResult && configResult.config

export default { ...defaultConfig, ...userConfig }
