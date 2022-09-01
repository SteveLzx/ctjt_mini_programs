module.exports = plop => {
  plop.setGenerator('vuefile', {
    description: 'create vue file',
    prompts: [
      {
        type: 'input',
        name: 'fileName',
        message: '输入文件夹名称,多层用/隔开',
        default: 'page'
      },
      {
        type: 'input',
        name: 'className',
        message: '输入文件类名',
        default: '{{fileName}}'
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/pages/{{fileName}}/index.vue',
        templateFile: './plop_template/index.hbs'
      }
    ]
  });
};
