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

## Create a javascript module

1. crete folder: `mkdir shared-module && $_`
2. initialize bower.sjon and package.json `bower init && npm init`
3. create module, example `shared-service.js`:
 	```
 	'use strict';

	function SharedService(param1) {
		console.log('Ola', param1);
	}

	module.exports = SharedService;
 	``` 


## Compile

`shared-pack ./shared-service.js`

## Results

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
## Set properly `main` field in bower.json and package.json




