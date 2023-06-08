## demo

#### 原数据

| 参数         | 名称             | 是否必填 | 类型 | 长度 | 示例  | 描述         |
| ------------ | ---------------- | -------- | ---- | ---- | ----- | ------------ |
| amount       | 剩余可用余额     | Y        | int  |      | 22070 | 分           |
| consume      | 累计消费金额     | Y        | int  |      | 27668 | 分           |
| availableDay | 预计剩余可用天数 | Y        | int  |      | 10    | 预计可用天数 |

#### 目标数据

<CTable columns='[{"title":"参数","dataIndex":"param","width":297,"key":"param"},{"title":"名称","dataIndex":"name","key":"name"},{"title":"是否必填","dataIndex":"required","key":"required"},{"title":"类型","dataIndex":"type","key":"type"},{"title":"长度","dataIndex":"length","key":"length"},{"title":"示例","dataIndex":"demo","key":"demo"},{"title":"描述","dataIndex":"describe","width":375,"key":"describe"}]' data='[{"key":1,"param":"orderInfo","name":"订单信息","required":"Y","type":"object","demo":"","describe":"","children":[{"key":11,"param":"orderId","name":"订单号","required":"Y","type":"String","length":32,"demo":"","describe":""}]},{"key":2,"param":"reasonCode","name":"取消原因编码","required":"Y","type":"init","demo":"6","describe":"0-暂时不想寄快递了  1-运费过高，更换寄快递方式  2-信息填写错误  3-快递员原因  4-无法送达目的地  5-下错单了，需要重新下单  6-其它"},{"key":3,"param":"reasonDesc","name":"取消原因","required":"N","type":"String","length":50,"demo":"计划有变，暂不寄件","describe":"reasonCode为6时必填入，最多50字  0-5默认传对应枚举值的原因，不可更改"}]'>

| 参数         | 名称             | 是否必填 | 类型 | 长度 | 示例  | 描述         |
| ------------ | ---------------- | -------- | ---- | ---- | ----- | ------------ |
| amount       | 剩余可用余额     | Y        | int  |      | 22070 | 分           |
| consume      | 累计消费金额     | Y        | int  |      | 27668 | 分           |
| availableDay | 预计剩余可用天数 | Y        | int  |      | 10    | 预计可用天数 |

</CTable>
