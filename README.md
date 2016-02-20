# shared-pack
Easily share code between angular.js and node.js.


# Index
 
* [`Requirements`](#requirements)
* [`Installation`](#installation)
* [`Usage`](#usage)

<a name="requirements" id="requirements"></a>
# Requirements

* npm
* node.js

<a name="installation" id="installation"></a>
# Installation

`npm install -g shared-pack`

<a name="usage"></a>
# Usage

1. [Create a node.js module](#createModule)
2. [Compile](#compile)
3. [Configure properly package.json and bower.json](#setMain)

<a name="createModule"></a>
## Create a javascript module

1. crete folder: `mkdir shared-module && cd $_`
2. initialize bower.json and package.json `bower init && npm init`
3. create module, example `shared-service.js`:
 	```
 	'use strict';

	function SharedService(param1) {
		console.log('Ola', param1);
	}

	module.exports = SharedService;
 	``` 

<a name="compile"></a>
## Compile

```
shared-pack ./shared-service.js
```

<a name="result"></a>
### Results

The results fo compilation will be a foldr `./build` containing 2 files

* `./build/shared-service.angular.js`

	```
	function SharedService(param1) {
		console.log('Ola', param1);
	}

	angular.module('SharedService', ['param1'])
		.factory('SharedService', ['param1', SharedService]);
	```

* `./build/shared-service.node.js`

	```
	function SharedService(param1) {
		console.log('Ola', param1);
	}

	 module.exports = SharedService(require('param1.js'));
	```

<a name="setMain"></a>
## Configure properly `main` field in bower.json and package.json

*bower.json*

```
	...
	"main":"./build/shared-service.angular.js",
	...
```

*package.json*

```
	...
	"main":"./build/shared-service.node.js",
	...
```



