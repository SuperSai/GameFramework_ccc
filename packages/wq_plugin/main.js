/****************************************************************************
Copyright (c) 2016-2017 zilongshanren

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/

'use strict';
const Fs = require('fire-fs');
const Path = require('fire-path');
const Async = require('async');
const Del = require('del');

let sharpPath;
if (Editor.dev) {
	sharpPath = 'sharp';
} else {
	sharpPath = Editor.url('unpack://utils/sharp');
}
const Sharp = require(sharpPath);

const dontSelectCorrectAssetMsg = {
	type: 'warning',
	buttons: ['OK'],
	titile: 'Unpack Texture Packer Atlas',
	message: 'Please select a Texture Packer asset at first!',
	defaultId: 0,
	noLink: true
};

module.exports = {
	load() {
		// execute when package loaded
	},

	unload() {
		// execute when package unloaded
	},

	// register your ipc messages here
	messages: {
		'gen'() {
			Editor.Scene.callSceneScript('gen_ui', 'gen_ui', function (err, node_name) {
				if (node_name) {
					var projectPath = Editor.projectPath;
					if (!projectPath) { // 新版本走这里
						projectPath = Editor.Project.path;
					}

					var path = Path.join(projectPath, 'assets/script/game/' + node_name);

					if (!Fs.existsSync(path)) {
						Fs.mkdirSync(path);
					}

					var className = node_name + "_Ctrl";
					var data = "import ViewCtrl from \"\.\.\/\.\.\/framework\/ui\/ViewCtrl\";\n\nconst { ccclass, property } = cc._decorator;\n\n@ccclass\nexport default class " + className + " extends ViewCtrl {\n\n\tonLoad(){\n\t\tsuper.onLoad();\n\t}\n\n\tstart(){\n\t}\n\n}";

					var file_name = Path.join(path, className + ".ts");

					if (!Fs.existsSync(file_name)) {
						Fs.writeFileSync(file_name, data);
						Editor.assetdb.refresh('db://assets/script/game/' + node_name, () => {
							Editor.success('Gen file: ' + file_name);
						});
					}
					else {
						Editor.log(file_name + " 已经存在");
					}
				}
				else {
					Editor.log("生成失败，请选择一个UI节点");
				}
			});
		},
	},
};
