'use strict';

/** IPC进程间交互信息，和主线程交互 */

const Excel = require('./lib/excel');

module.exports = {
  load() {
    // execute when package loaded
  },

  unload() {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    'open'() {
      Editor.Panel.open('excel');
    },
    'import-file'(event, file) {
      Excel.import(file, (error, data) => {
        if (event.reply) {
          event.reply(error, data);
        }
      });
    }
  },
};