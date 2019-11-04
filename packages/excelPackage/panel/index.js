// panel/index.js, this filename needs to match the one registered in package.json

//文件读取库
const Fs = require('fs');

var createVue = function (elem) {
  return new Vue({
    el: elem,
    data: {
      file: null,
      table: {
        head: null,
        body: null
      }
    },
    methods: {
      _import() {
        var result = Editor.Dialog.openFile({
          defaultPath: Editor.url('packages://excel'),
          properties: ['openFile'],
          filters: [
            { name: 'Excel File', extensions: ['xlsx'] }
          ]
        });

        if (!result || !result[0]) {
          alert("选择的文件出错啦~·亲...");
          return;
        }

        this.file = result[0];
        var table = this.table;
        Editor.Ipc.sendToMain('excel:import-file', result[0], function (error, json) {
          if (error) return;
          //取出表1的数据
          var data = json[0].data;
          table.head = data.splice(0, 1)[0];
          table.body = data;
        });
      },
      _save() {
        var result = Editor.Dialog.saveFile({
          defaultPath: Editor.url('packages://excel'),
          filters: [
            { name: 'Json File', extensions: ['.json'] }
          ]
        });

        if (!result) {
          return Editor.warn('选择文件错误');
        }

        var json = [];
        var table = this.table;
        table.body.forEach((item) => {
          var temp = {};
          table.head.forEach((key, index) => {
            temp[key] = item[index];
          });
          json.push(temp);
        });

        Fs.writeFileSync(result, JSON.stringify(json, null, 4));
      },
      _refresh() {
        var file = this.file;
        var table = this.table;
        Editor.Ipc.sendToMain('excel:import-file', file, function (error, json) {
          if (error) return;
          //取出表1的数据
          var data = json[0].data;
          table.head = data.splice(0, 1)[0];
          table.body = data;
        });
      }
    }
  });
};

Editor.Panel.extend({
  style: Fs.readFileSync(Editor.url('packages://excel/panel/index.css')) + "",

  template: Fs.readFileSync(Editor.url('packages://excel/panel/index.html')) + "",

  $: {
    btn: '#btn',
    label: '#label',
  },

  ready() {
    this._vm = createVue(this.shadowRoot);
  },

});