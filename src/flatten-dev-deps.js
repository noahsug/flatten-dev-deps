import shell from 'shelljs'
import fs from 'fs'
import config from './config'

function exec(command) {
  console.log(command)
  shell.exec(command, { silent: !!config.silent })
}

function getDepVersionMap() {
  const packageJson = fs.readFileSync('package.json')
  const packageObj = JSON.parse(packageJson)
  return packageObj.devDependencies || {}
}

function installDevDeps(depVersionMap) {
  let depStrings = []
  Object.keys(depVersionMap).forEach(depName => {
    const version = depVersionMap[depName]
    depStrings.push(`${depName}${version ? '@' : ''}${version}`)
  })
  exec(`npm i ${config.modifyPackageJson ? '-D' : ''} ${depStrings.join(' ')}`)
}

export default function flattenDevDeps() {
  exec('rm -rf node_modules')
  exec('npm i')
  exec(`rm npm-shrinkwrap.json`)
  exec(`rm package-lock.json`)
  exec(`mv package.json orig__package.json`)
  exec(
    `sed 's/devDependencies/xdevDependencies/' orig__package.json > package.json`
  )
  exec('npm prune')
  exec(`mv orig__package.json package.json`)
  const depVersionMap = getDepVersionMap()
  config.preFlatten({ depVersionMap, exec, fs })
  installDevDeps(depVersionMap)
  config.preShrinkwrap({ depVersionMap, exec, fs })
  exec('npm shrinkwrap --dev')
}
