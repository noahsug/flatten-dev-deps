# Flatten Dev Deps

> Flatten npm devDependencies by pruning them and reinstalling.


### Install

```
npm i -g flatten-dev-deps
```


### Usage

```sh
cd PROJECT_ROOT
flatten-dev-deps
```

This runs the following commands on your npm package:

```
rm -rf node_modules
npm install
rm package-lock.json  // or npm-shrinkwrap.json, whichever exists
sed -i '' 's/devDependencies/xdevDependencies/' package.json
npm prune
sed -i '' 's/xdevDependencies/devDependencies/' package.json
{ forEach devDependencies do npm install --save-dev dependency }
npm shrinkwrap --dev
```


### Configuration

Create `flatten-dev-deps.config.js` in the root of your project:

```js
module.exports = {
  quiet: false,  // default
  modifyPackageJson: false,  // default - whether to pass '--save' to 'npm install <devDeps>'
  preFlatten: ({depVersionMap, exec, fs}) => {
    // Runs before re-installing each dev dependency, can modify which dependencies get installed at
    // which version.
    delete depVersionMap['npm-shrinkwrap']  // skip dep
    Object.keys(depVersionMap, (depName) => {
      let version = ''  // use latest minor version
      if (depName === 'eslint') version = '4.9.0'
      if (depName === 'react') version = '~15.6.2'
      depVersionMap[depName] = version
    })
  },
  preShrinkwrap: ({depVersionMap, exec, fs}) => {
    // Runs before 'npm shrinkwrap'
    exec('rm -rf node_modules/fsevents')
  })
}
```


### Development

```sh
npm install
npm start
node dist/index.js
```
