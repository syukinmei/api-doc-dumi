console.log('这是cli文件');

const fs = require('fs');
const path = require('path');
const md = require('markdown-it')();
const cheerio = require('cheerio');

const filePath = path.join(__dirname, '..', 'docs', 'test.md'); // D:\workingDir\code\fhdApiDoc\docs\test.md

// 读取 MarkDown 文件内容
const markdown = fs.readFileSync(filePath, 'utf-8');

// 将 Markdown 转换成 HTML
const html = md.render(markdown);

// console.log(markdown);
console.log(html);

// 使用 cheerio 从 HTML 中提取表格数据
const $ = cheerio.load(html);
const tableData = [];
$('table').each((i, table) => {
  const headers = [];
  $(table)
    .find('thead th')
    .each((j, th) => {
      headers.push($(th).text());
    });
  const rows = [];
  $(table)
    .find('tbody tr')
    .each((j, tr) => {
      const row = {};
      $(tr)
        .find('td')
        .each((k, td) => {
          row[headers[k]] = $(td).text();
        });
      rows.push(row);
    });
  tableData.push({ headers, rows });
});

// console.log(tableData, tableData[0].rows);

// 使用 Ant Design 的 Table 组件渲染表格
tableData.forEach(({ headers, rows }) => {
  const columns = headers.map((header) => ({ title: header, dataIndex: header }));
  const dataSource = rows.map((row) => ({ key: Math.random(), ...row }));
});

// 使用正则表达式替换 a 标签为 b 标签
// const replacedMarkdown = markdown.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '<b>$1</b>');

// fs.appendFileSync(filePath, replacedMarkdown);
