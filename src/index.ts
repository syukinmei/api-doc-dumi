const a = [
  {
    key: 1,
    param: 'orderInfo',
    name: '订单信息',
    required: 'Y',
    type: 'object',
    demo: '',
    describe: '',
    children: [
      {
        key: 11,
        param: 'orderId',
        name: '订单号',
        required: 'Y',
        type: 'String',
        length: 32,
        demo: '',
        describe: '',
      },
    ],
  },
  {
    key: 2,
    param: 'reasonCode',
    name: '取消原因编码',
    required: 'Y',
    type: 'init',
    demo: '6',
    describe:
      '0-暂时不想寄快递了  1-运费过高，更换寄快递方式  2-信息填写错误  3-快递员原因  4-无法送达目的地  5-下错单了，需要重新下单  6-其它',
  },
  {
    key: 3,
    param: 'reasonDesc',
    name: '取消原因',
    required: 'N',
    type: 'String',
    length: 50,
    demo: '计划有变，暂不寄件',
    describe: 'reasonCode为6时必填入，最多50字  0-5默认传对应枚举值的原因，不可更改',
  },
];
