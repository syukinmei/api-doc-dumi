const fs = require('fs');
const path = require('path');
/**
 * 目标，将markdown文件转换成CTable控件接收的格式数据
 * 文件夹：source，存放待转换的markdown文档
 * 文件夹：output，存放转换完成的文档
 */
const sourcedir = 'source';
const outputdir = 'output';
/** 定义的字段名，观察了一下，应该暂时不会变。后边做解析数据的时候要用到 */
const titleNameList = ['param', 'name', 'required', 'type', 'length', 'demo', 'describe'];

traverseFolder(sourcedir);

// let filePath = '风火递寄件服务开放平台接口文档.md'
// let markdownContent = extractRequestParams(filePath)
// fs.writeFileSync(`output/${filePath}`, markdownContent, 'utf-8');
/**
 * 递归遍历目标文件夹下边的所有文件，然后进行数据的转换。
 * 并按照原来文件夹路径输出到指定的目录。不同系统路径可能需要重写
 * 文件/文件夹的权限可能需要考量一下
 * @param {dir} dir
 */
function traverseFolder(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseFolder(fullPath);
    } else {
      // 对于指定的文件路径，先创建它所在的目录
      const dirPath = path.dirname(`${outputdir}/${fullPath}`);
      fs.mkdirSync(dirPath, { recursive: true });
      let markdownContent = extractRequestParams(fullPath); //这边调用主要的转换的方法
      fs.writeFileSync(`${outputdir}/${fullPath}`, markdownContent, 'utf-8');
    }
  });
}
/**
 * 主要的方法，读取文件，然后分层次用正则匹配解析，最后把解析出来的内容，按照CTable需要的格式给替换回去
 * @param {filepath} 文件路径
 * @returns 替换完成的markdown的内容
 */
function extractRequestParams(filePath) {
  //文件读取指定的文件
  let markdownFile = fs.readFileSync(filePath, 'utf-8');
  let spaLatter = 'x89757x'; //专门用来处理\|,因为比较能有影响的大概就是这个了，其他需要转义的字符，在这边都不大会受到影响。影响的话，也是先影响到markdown语法
  markdownFile = markdownFile.replace(/\\\|/g, spaLatter);
  //#### 请求参数
  //#### 返回参数
  // 用正则快速提取两部分之间的内容，能直接拿到请求参数的主体
  // 需要注意的地方是markdown的文档里边的【 请求参数】跟【返回参数】的写法不能变。有其他地方有不一致的没办法的地方，再处理
  const regex = /#### 请求参数([\s\S]*?)#### 返回参数/g;
  let debugFileIndex = 0;
  let globalKey = 1; //全局索引字段。测试过了，同文件不重复保持唯一就可以了
  let match;
  let matchList = [];

  while ((match = regex.exec(markdownFile)) !== null) {
    const content = match[1].trim(); // 去除前后空格
    /**
     * 这里可以把正则查询出来的内容依次输出到文件中，方便调试查看 ，文件放在debug下边
     * */
    // fs.writeFileSync(`debug/index${debugFileIndex++}.html`, content, 'utf-8');

    let matchLine;
    let groupIndex = 0; //每个接口的每一行的索引标记
    let interfaceContent = {
      //这个变量用于记录当前文件的每个接口的信息，最后要拿出来去替换原文件的东西
      columns: [],
      data: [],
    };
    let dataList = []; //未整理的data数据
    /**
     * 接下来处理读取到的接口的每一行的内容，匹配    | 参数 | 名称 | 是否必填 | 类型 | 长度 | 示例 | 描述 |
     * 这种固定格式，按照我的理解，长度都是 7
     * 只要匹配  |*|*|*|*|*|*|这种格式的就可以了
     */
    const regexLine =
      /\|([\s\S]*?)\|([\s\S]*?)\|([\s\S]*?)\|([\s\S]*?)\|([\s\S]*?)\|([\s\S]*?)\|([\s\S]*?)\|/g;

    while ((matchLine = regexLine.exec(content))) {
      let param = matchLine[1].trim();
      const name = matchLine[2].trim();
      const required = matchLine[3].trim();
      const type = matchLine[4].trim();
      const length = matchLine[5].trim();
      const demo = matchLine[6].trim();
      const description = matchLine[7].trim();
      //这里可以打开注释打印调试过程
      // console.log(param, name, required, type, length, demo, description);

      /**
       * 第一行固定是标题，应该没啥问题
       */
      if (groupIndex == 0) {
        //解析标题
        interfaceContent['columns'] = parseTitle([
          param,
          name,
          required,
          type,
          length,
          demo,
          description,
        ]);
      }
      /**
       * 第二行是----直接跳过，从第三行开始解析
       */
      if (groupIndex > 1) {
        if (param.includes('[')) {
          param = param.replace(/\[['"]?([^'"\[\]]+)['"]?\]/g, (_, p1) => `.${p1}`);
        }

        //解析每个字段的内容
        let dataTmp = {
          key: globalKey,
          param: param,
          name: name,
          required: required,
          type: type,
          demo: demo,
          describe: description,
        };
        dataList.push(dataTmp);
      }
      groupIndex++;
      globalKey++;
    }
    interfaceContent['data'] = parseData(dataList);
    let strCTable =
      "<CTable columns='" +
      JSON.stringify(interfaceContent['columns']) +
      "' data='" +
      JSON.stringify(interfaceContent['data']) +
      "'>\n</CTable>\n\n";
    //将接口的发送参数的每一行源数据替清空，然后追加咱们构造的CTable的字符串。这里可能会有很多个换行，但是不影响。

    let replacedText = content.replace(regexLine, '');

    //这变量，就是每个接口里边，要拿去替换的变量，我们为了方便，把它填充到一个新的数组里边去
    let interfaceReplaceContent =
      replacedText + '\n\n' + (dataList.length > 0 ? strCTable : '\n\n');

    matchList.push(interfaceReplaceContent);
  }
  // 这里已经是用正则匹配并替换完了咱们的源数据了。现在调用String.propotry.replace方法，用咱们开头声明的正则表达式：const regex = /#### 请求参数([\s\S]*?)#### 返回参数/g
  // 来依次对每个接口进行替换，这边分开写，为了避免阅读不流畅
  let currentReplacementIndex = 0;
  let replacedMarkDown = markdownFile.replace(regex, function (match, capturedGroup) {
    const replacement = matchList[currentReplacementIndex];
    currentReplacementIndex = (currentReplacementIndex + 1) % matchList.length;
    return '#### 请求参数\n' + replacement + '#### 返回参数\n';
  });
  replacedMarkDown = replacedMarkDown.replace(/x89757x/g, '|');
  return replacedMarkDown;
}
/**
 * 处理data数据
 *
 * @param {Array} dataList
 * @returns
 */
function parseData(dataList) {
  let headLevel = dataList.filter((param) => !param.param.includes('.')); //过滤顶级元素
  for (let j in headLevel) {
    let parentPath = headLevel[j]['param'] + '.'; //拿到当前元素的最后一级名字去判断他的是否有子元素集合
    let children = dataList.filter((param) => param.param.startsWith(parentPath));

    if (children.length > 0) {
      for (let i in children) {
        //把children的param属于父元素的内容去掉，方便递归
        children[i].param = children[i].param.replace(parentPath, '');
      }
      headLevel[j]['children'] = parseData(children);
    }
  }
  //说明应该有子元素，但是缺失了父级元素，通常发生在[0]或者['code']这种数组格式上。我们默认给他补一级父元素，就用.拆分开的第一个元素去当作他的父元素
  if (headLevel.length == 0 && dataList.length > 0) {
    let data = dataList[0];
    let head = data.param.split('.')[0];
    let dataTmp = {
      key: data['key'] * 10000,
      param: head,
      name: '',
      required: '',
      type: '',
      demo: '',
      describe: '',
    };
    dataList.push(dataTmp);
    return parseData(dataList);
  }
  return headLevel;
}
/**
 *  解析标题。暂且认为标题是固定的，从match索引1-7返回
 * @param {Array} columnData 内容依次是param, name, required, type, length, demo, description
 * @returns
 */
function parseTitle(columnData) {
  //标题的索引为0-6，对应这边match的索引为1-7,只需要索引+1去映射就好了
  let titleColumns = [];
  for (let i = 0; i < titleNameList.length; i++) {
    let titleObj = {
      title: columnData[i].trim(),
      dataIndex: titleNameList[i],
      key: titleNameList[i],
    };
    titleColumns.push(titleObj);
  }
  return titleColumns;
  /**
   * 底下是不解析标题的，直接写死的
   */
  // return [{
  //     "title": "参数",
  //     "dataIndex": "param",
  //     "width": 297,
  //     "key": "param"
  // }, {
  //     "title": "名称",
  //     "dataIndex": "name",
  //     "key": "name"
  // }, {
  //     "title": "是否必填",
  //     "dataIndex": "required",
  //     "key": "required"
  // }, {
  //     "title": "类型",
  //     "dataIndex": "type",
  //     "key": "type"
  // }, {
  //     "title": "长度",
  //     "dataIndex": "length",
  //     "key": "length"
  // }, {
  //     "title": "示例",
  //     "dataIndex": "demo",
  //     "key": "demo"
  // }, {
  //     "title": "描述",
  //     "dataIndex": "describe",
  //     "width": 375,
  //     "key": "describe"
  // }]
}
