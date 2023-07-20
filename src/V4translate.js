const fs = require('fs');
const path = require('path');

// console.log(config.EXPLAIN_MAP['快递公司编码']);  // 打印 EXPLAIN_MAP 对象
/**
 * 目标，将markdown文件转换成CTable控件接收的格式数据
 * 文件夹：source，存放待转换的markdown文档
 * 文件夹：output，存放转换完成的文档
 */
const sourcedir = __dirname + '/source';
const outputdir = path.join(__dirname, '../docs/apiDoc');
/** 定义的字段名，这边改过了，跟之前不一样了，现在是容错不同数量的标题 */
const titleNameList = {
  参数: 'param',
  名称: 'name',
  是否必填: 'required',
  类型: 'type',
  长度: 'lengthValue',
  示例: 'demo',
  描述: 'describe',
};
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
      const dirPath = path.dirname(`${outputdir}/${file}`);
      fs.mkdirSync(dirPath, { recursive: true });
      let markdownContent = extractRequestParams(fullPath); //这边调用主要的转换的方法
      autoCreateFloder(outputdir);
      fs.writeFileSync(`${outputdir}/${file}`, markdownContent, 'utf-8');
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
  // 用正则快速提取每个table
  const regex = /\|.*\|\r\n\|(?:[\s\-:]+\|)+\r\n(?:\|.*(?:\r\n|$))+/g;
  let debugFileIndex = 0;
  let globalKey = 1; //全局索引字段。测试过了，同文件不重复保持唯一就可以了
  let match;
  let matchList = [];
  let currentReplacementIndex = 0;
  //在table中循环替换每个table。比之前优雅了很多，现在是精准匹配
  let replacedMarkDown = markdownFile.replace(regex, function (match, capturedGroup) {
    const content = match.trim(); // 去除前后空格,match[1]跟match[3]是#号的数量

    /**
     * 这里可以把正则查询出来的内容依次输出到文件中，方便调试查看 ，文件放在debug下边
     * */
    //  autoCreateFloder(__dirname + `/debug/`)
    //  fs.writeFileSync(__dirname + `/debug/index${debugFileIndex++}.html`, match.trim(), 'utf-8');

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
      /\|([^\n|]+?)\|([^\n|]+?)\|(?:([^\n|]+?)\|)?(?:([^\n|]+?)\|)?(?:([^\n|]+?)\|)?(?:([^\n|]+?)\|)?(?:([^\n|]+?)\|)?/g;
    while ((matchLine = regexLine.exec(content))) {
      //最多7个，反正按照顺序来就可以了
      let content = [];
      content.push(matchLine[1]?.trim());
      content.push(matchLine[2]?.trim());
      content.push(matchLine[3]?.trim());
      content.push(matchLine[4]?.trim());
      content.push(matchLine[5]?.trim());
      content.push(matchLine[6]?.trim());
      content.push(matchLine[7]?.trim());
      /**
       * 第一行固定是标题，应该没啥问题
       */
      let isInColumns = true;
      if (groupIndex == 0) {
        //解析标题
        interfaceContent['columns'] = parseTitle(content);
        if (interfaceContent['columns'].length == 0) {
          return match;
        }
      }

      /**
       * 第二行是----直接跳过，从第三行开始解析
       */
      if (groupIndex > 1) {
        if (content[0].includes('[')) {
          //处理数组[]括号部分。
          content[0] = content[0].replace(/\[['"]?([^'"\[\]]+)['"]?\]/g, (_, p1) => `.${p1}`);
          content[0] = content[0].replace('.0.', '.');
        }
        let keyname = 'key';
        let dataContent = {};
        for (let i in interfaceContent['columns']) {
          dataContent[interfaceContent['columns'][i]['key']] = content[i];
        }
        dataContent['key'] = globalKey;
        dataList.push(dataContent);
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
    replacedText = replacedText.replace(/^\s*$/gm, '');
    //这变量，就是每个接口里边，要拿去替换的变量，我们为了方便，把它填充到一个新的数组里边去
    let interfaceReplaceContent =
      replacedText + '\n\n' + (dataList.length > 0 ? strCTable : '\n\n');

    return interfaceReplaceContent;
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
  let headLevel = dataList.filter((param) => !param.param?.includes('.')); //过滤顶级元素
  for (let j in headLevel) {
    let parentPath = headLevel[j]['param'] + '.'; //拿到当前元素的最后一级名字去判断他的是否有子元素集合
    let children = dataList.filter((param) => param.param?.startsWith(parentPath));
    if (children.length > 0) {
      for (let i in children) {
        //把children的param属于父元素的内容去掉，方便递归
        children[i].param = children[i].param.replace(parentPath, '');
      }
      headLevel[j]['children'] = parseData(children);
    }
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

  columnData.forEach((item) => {
    if (typeof item === 'undefined') {
      return;
    }
    let key = titleNameList[item];

    let titleObj = {
      title: item,
      width: 150,
      dataIndex: key,
      key: key,
    };
    if (typeof key === 'undefined') {
      titleObj['dataIndex'] = item;
      titleObj['key'] = item;
    }
    if (item == '参数' || item == '描述') {
      titleObj['width'] = 300;
    }
    titleColumns.push(titleObj);
  });
  return titleColumns;
}
/**
 * 自动创建文件夹
 */
function autoCreateFloder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
}
