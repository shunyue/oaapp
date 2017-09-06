/**
 * Created by web360 on 2017/6/15.
 * 大写的逐步放弃,操作太麻烦,全部增加小写,大写原则不动(2017-6-19 15:58:44)
 * 编辑原则:只增加不修改(2017-6-27 10:44:54)
 * 使用技巧:(2017-6-27 10:46:08)
 *    混合模式是各种属性使用次数大于3次的整合到一起,
 *    单个模式是自身属性的简写
 */
import {
  StyleSheet,
  Dimensions,
} from 'react-native';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
const com = StyleSheet.create({
  body: {
    flex: 1,
  },
  nav: {//头部导航
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
  },
  sz: {//导航图标
    width: 24,
    height: 24
  },
  fSelf: {//导航字体相关
    color: '#000',
    fontSize: 16,
  },

  //修改图标的颜色
  tcccc: {
    tintColor: '#ccc'
  },
  tcbe: {
    tintColor: '#bebebe'
  },
  tcfff: {
    tintColor: '#fff'
  },
  tcec4: {
    tintColor: '#EC4B58'
  },
  tcr: {
    tintColor: '#EC4B58'
  },
  tcf7: {
    tintColor: '#f7cf31'
  },
  tco: {
    tintColor: 'orange'
  },
  tcy: {
    tintColor: 'yellow'
  },
  tcg: {
    tintColor: 'green'
  },
  tcb: {
    tintColor: 'blue'
  },
  tcp: {
    tintColor: 'purple'
  },
  tcc: {
    tintColor: 'cyan'
  },
  tc2: {
    tintColor: '#25D28F'
  },
  tcf: {
    tintColor: '#FDB33A'
  },
  tc6: {
    tintColor: '#67798D'
  },
  tc7: {
    tintColor: '#7181EE'
  },
  tc3: {
    tintColor: '#39C6F1'
  },
  tc49: {
    tintColor: '#494949'
  },
  tc67: {
    tintColor: '#67798C'
  },
  tc6873: {
    tintColor: '#ef6873'
  },
  tc285: {
    tintColor: '#F2858D'
  },
  //公共自定义样式
  //布局样式
  //混合样式
  rjarsc: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rsc:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flex: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
  },
  jcsb: {
    justifyContent: 'space-between',
  },
  jcsa: {
    justifyContent: 'space-around',
  },
  jcc: {
    justifyContent: 'center',
  },
  jcfe: {
    justifyContent: 'flex-end',
  },
  JCC: {
    justifyContent: 'center',
  },
  aic: {
    alignItems: 'center',
  },
  aife: {
    alignItems: 'flex-end',
  },
  flww: {
    flexWrap: 'wrap'
  },

  //混淆模式
  //下边框宽度/颜色,背景颜色,paddingt5l15(paddingt10l15),
  mix: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#ebebeb',
    backgroundColor: '#fff',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15
  },
  mix_nobt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ebebeb',
    backgroundColor: '#fff',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15
  },
  mix_nob: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15
  },
  mixa: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15
  },
  mixf: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixf_nob: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixf8: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbbp: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f8f8f8',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixf3_nob: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixf3: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbgf3: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#f3f3f3',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbgfff: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#ffffff',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbgcfff: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#ffffff',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbgcfff_nobb: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#ffffff',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbgcfff_nobt: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#ffffff',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbgcfff_nob: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbgf8: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#f8f8f8',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbgcf3: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#f3f3f3',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbgcf3_nobt: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#f3f3f3',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbgcf3_nobb: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#f3f3f3',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbgcf3_nob: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbgcfff: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#ffffff',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbgcf8: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#f8f8f8',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbe: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#bebebe',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixf8_nob: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbbp515: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f8f8f8',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbbp1015: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f8f8f8',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbbpe6: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#e6e6e6',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbbpe6_nob: {
    backgroundColor: '#e6e6e6',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mixbbpe61015: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#e6e6e6',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },

  //边框样式
  bw: {borderWidth: 1},
  br: {borderRadius: 3},
  br5: {borderRadius: 5},
  br10: {borderRadius: 10},
  br15: {borderRadius: 15},
  br200: {borderRadius: 200},
  btw: {borderTopWidth: 1},
  brw: {borderRightWidth: 1},
  blw: {borderLeftWidth: 1},
  bbw: {borderBottomWidth: 1},
  bce6: {borderColor: '#e6e6e6'},

  brtl: {borderTopLeftRadius: 3},
  brtl5: {borderTopLeftRadius: 5},
  brtl10: {borderTopLeftRadius: 10},
  brtl15: {borderTopLeftRadius: 15},
  brtl20: {borderTopLeftRadius: 20},
  brtl200: {borderTopLeftRadius: 200},

  brbl: {borderBottomLeftRadius: 3},
  brbl5: {borderBottomLeftRadius: 5},
  brbl10: {borderBottomLeftRadius: 10},
  brbl15: {borderBottomLeftRadius: 15},
  brbl20: {borderBottomLeftRadius: 20},
  brbl200: {borderBottomLeftRadius: 200},

  brtr: {borderTopRightRadius: 3},
  brtr5: {borderTopRightRadius: 5},
  brtr10: {borderTopRightRadius: 10},
  brtr15: {borderTopRightRadius: 15},
  brtr20: {borderTopRightRadius: 20},
  brtr200: {borderTopRightRadius: 200},

  brbr: {borderBottomRightRadius: 3},
  brbr5: {borderBottomRightRadius: 5},
  brbr10: {borderBottomRightRadius: 10},
  brbr15: {borderBottomRightRadius: 15},
  brbr20: {borderBottomRightRadius: 20},
  brbr200: {borderBottomRightRadius: 200},

  brtlr5: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,

  },
  brtlr10: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,

  },
  brtlr15: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,

  },
  brtlr20: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

  },
  brtlr200: {
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,

  },

  brblr5: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,

  },
  brblr10: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,

  },
  brblr15: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,

  },
  brblr20: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,

  },
  brblr200: {
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,

  },

  brltb5: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,

  },
  brltb10: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,

  },
  brltb15: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,

  },
  brltb20: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,

  },
  brltb200: {
    borderTopLeftRadius: 200,
    borderBottomLeftRadius: 200,

  },

  brrtb5: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,

  },
  brrtb10: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,

  },
  brrtb15: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,

  },
  brrtb20: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,

  },
  brrtb200: {
    borderTopRightRadius: 200,
    borderBottomRightRadius: 200,

  },
  bw: {borderWidth: 1},
  btw: {borderTopWidth: 1},
  brw: {borderRightWidth: 1},
  bbw: {borderBottomWidth: 1},
  blw: {borderLeftWidth: 1},
  bc:{borderColor: '#e6e6e6'},
  bcr:{borderColor: '#e4393c'},
  bcd:{borderColor: '#d0d0d0'},
  bcb:{borderColor: '#ebebeb'},
  bca:{borderColor: '#aaa'},
  //边框混合样式
  bwc: {borderWidth: 1, borderColor: '#e6e6e6'},

  bwcd: {borderWidth: 1, borderColor: '#D16363'},
  bwc9: {borderWidth: 1, borderColor: '#999'},
  bwr: {borderWidth: 1, borderColor: '#EC4B58'},
  bweb: {borderWidth: 1, borderColor: '#ebebeb'},

  btwc: {borderTopWidth: 1, borderColor: '#e6e6e6'},
  btweb: {borderTopWidth: 1, borderColor: '#ebebeb'},
  brwc: {borderRightWidth: 1, borderColor: '#e6e6e6'},
  brweb: {borderRightWidth: 1, borderColor: '#ebebeb'},
  blwc: {borderLeftWidth: 1, borderColor: '#e6e6e6'},
  blweb: {borderLeftWidth: 1, borderColor: '#ebebeb'},
  bbwc: {borderBottomWidth: 1, borderColor: '#e6e6e6'},
  bbweb: {borderBottomWidth: 1, borderColor: '#ebebeb'},
  bbwcc: {borderBottomWidth: 1, borderColor: '#ccc'},

  bwd: {borderWidth: 1, borderColor: '#ddd'},
  bwa: {borderWidth: 1, borderColor: '#aaa'},
  bwb: {borderWidth: 1, borderColor: '#bbb'},
  bwe: {borderWidth: 1, borderColor: '#eee'},
  bwe9: {borderWidth: 1, borderColor: '#E9EBED'},

  btwd: {borderTopWidth: 1, borderColor: '#ddd'},
  brwd: {borderRightWidth: 1, borderColor: '#ddd'},
  blwd: {borderLeftWidth: 1, borderColor: '#ddd'},
  bbwd: {borderBottomWidth: 1, borderColor: '#ddd'},

  btwe9: {borderTopWidth: 1, borderColor: '#E9EBED'},
  brwe9: {borderRightWidth: 1, borderColor: '#E9EBED'},
  blwe9: {borderLeftWidth: 1, borderColor: '#E9EBED'},
  bbwe9: {borderBottomWidth: 1, borderColor: '#E9EBED'},

  btbwa: {borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#aaa'},
  btbweb: {borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ebebeb'},
  btbwb: {borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#bbb'},
  btbwc: {borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ccc'},
  btbwd: {borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ddd'},
  btbwe: {borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eee'},
  btbwc6: {borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e6e6e6'},
  btbwe9: {borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E9EBED'},
  btbwce6: {borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e6e6e6'},

  //文字相关
  tar:{textAlign:'right'},
  tac:{textAlign:'center'},


  //字体
  tabfc:{fontSize:10,color:'#bebebe'},
  fwb:{fontWeight:'bold'},
  fs2: {fontSize: 2},
  fs4: {fontSize: 4},
  fs5: {fontSize: 5},
  fs6: {fontSize: 6},
  fs8: {fontSize: 8},
  fs10: {fontSize: 10},
  fs12: {fontSize: 12},
  fs14: {fontSize: 14},
  fs16: {fontSize: 16},
  fs18: {fontSize: 18},
  fs20: {fontSize: 20},
  fs24: {fontSize: 24},
  fs26: {fontSize: 26},
  fs32: {fontSize: 32},
  fs36: {fontSize: 36},
  fs38: {fontSize: 38},
  fs40: {fontSize: 40},
  ce0: {
    color: '#e0e0e0'
  },
  cff: {
    color: '#fff'
  },
  cfff: {
    color: '#fff'
  },
  cbe: {
    color: '#BEBEBE'
  },
  c378: {
    color: '#378CF0'
  },
  cr: {
    color: '#E85456'
  },
  cd: {
    color: '#D16363'
  },
  c489: {
    color: '#489722'
  },
  cb4: {
    color: '#b4b4b4'
  },
  //红色--详情
  cec: {
    color: '#EC9191'
  },
  c62: {
    color: '#84CBEC'
  },
  c84: {
    color: '#84CBEC'
  },

  //BackgroundColor
  bgce6: {
    backgroundColor: '#E6E6E6'
  },
  bgcf5: {
    backgroundColor: '#F5F5F5'
  },
  bgcf3: {
    backgroundColor: '#f3f3f3'
  },
  bgcf8: {
    backgroundColor: '#F8F8F8'
  },
  bgc378: {
    backgroundColor: '#378CF0'
  },
  bgcff: {
    backgroundColor: '#FFF'
  },
  bgcfff: {
    backgroundColor: '#FFF'
  },
  bgcr: {
    backgroundColor: '#E15151'
  },
  bgc24: {
    backgroundColor: '#24D089'
  },
  bgc84: {
    backgroundColor: '#84CBEC'
  },
  bgc37: {
    backgroundColor: '#37C0F3'
  },
  bgcfd: {
    backgroundColor: '#FDA731'
  },
  tecr: {
    backgroundColor: 'red'
  },
//padding
  //混合模式
  pd0:{padding:0},
  pdtb0: {paddingTop: 0, paddingBottom: 0},
  
  pdtd5: {paddingTop: 5, paddingBottom: 5},
  pdtd10: {paddingTop: 10, paddingBottom: 10},
  pdtd15: {paddingTop: 15, paddingBottom: 15},
  pdtd20: {paddingTop: 20, paddingBottom: 20},
  pdtd25: {paddingTop: 25, paddingBottom: 25},
  pdtd30: {paddingTop: 30, paddingBottom: 30},

  pdlr1: {paddingLeft: 1, paddingRight: 1},
  pdlr2: {paddingLeft: 2, paddingRight: 2},
  pdlr3: {paddingLeft: 3, paddingRight: 3},
  pdlr4: {paddingLeft: 4, paddingRight: 4},
  pdlr5: {paddingLeft: 5, paddingRight: 5},
  pdlr10: {paddingLeft: 10, paddingRight: 10},
  pdlr15: {paddingLeft: 15, paddingRight: 15},
  pdlr20: {paddingLeft: 20, paddingRight: 20},
  pdlr25: {paddingLeft: 25, paddingRight: 25},
  pdlr30: {paddingLeft: 30, paddingRight: 30},

  mgtb5: {marginTop: 5, marginBottom: 5},
  mgtb10: {marginTop: 10, marginBottom: 10},
  mgtb15: {marginTop: 15, marginBottom: 15},
  mgtb20: {marginTop: 20, marginBottom: 20},
  mgtb25: {marginTop: 25, marginBottom: 25},
  mgtb30: {marginTop: 30, marginBottom: 30},

  mglr5: {marginLeft: 5, marginRight: 5},
  mglr10: {marginLeft: 10, marginRight: 10},
  mglr15: {marginLeft: 15, marginRight: 15},
  mglr20: {marginLeft: 20, marginRight: 20},
  mglr25: {marginLeft: 25, marginRight: 25},
  mglr30: {marginLeft: 30, marginRight: 30},
  pdt1l10: {
    paddingTop: 1,
    paddingBottom:1,
    paddingLeft: 10,
    paddingRight: 10
  },
  pdt5l10: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
  pdt5l15: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15
  },
  pdt5l20: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20
  },
  pdt10l15: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
  pdt20l15: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 15,
    paddingRight: 15
  },
  pdt10l5: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5
  },
  pdt10l20: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  pdt10l30: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30
  },
  pdt15l5: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 5,
    paddingRight: 5
  },
  pdt15l10: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10
  },
  pdt15l20: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20
  },
  pdt15l30: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 30,
    paddingRight: 30
  },
  pdtb5: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  pdtb10: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  pdtb15: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  pdtb20: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  pdtb25: {
    paddingTop: 25,
    paddingBottom: 25,
  },
  pdtb30: {
    paddingTop: 30,
    paddingBottom: 30,
  },

  pd1: {padding: 1},
  pd2: {padding: 2},
  pd3: {padding: 3},
  pd4: {padding: 4},
  pd5: {padding: 5},
  pd6: {padding: 6},
  pd7: {padding: 7},
  pd8: {padding: 8},
  pd9: {padding: 9},
  pd10: {padding: 10},
  pd15: {padding: 15},
  pd20: {padding: 20},
  pd30: {padding: 30},
  pd40: {padding: 40},
  pd50: {padding: 50},

  pdt1: {paddingTop: 1},
  pdt2: {paddingTop: 2},
  pdt3: {paddingTop: 3},
  pdt4: {paddingTop: 4},
  pdt5: {paddingTop: 5},
  pdt6: {paddingTop: 6},
  pdt7: {paddingTop: 7},
  pdt8: {paddingTop: 8},
  pdt9: {paddingTop: 9},
  pdt10: {paddingTop: 10},
  pdt15: {paddingTop: 15},
  pdt20: {paddingTop: 20},
  pdt25: {paddingTop: 25},
  pdt30: {paddingTop: 30},
  pdt40: {paddingTop: 40},
  pdt50: {paddingTop: 50},
  pdt60: {paddingTop: 60},
  pdt70: {paddingTop: 70},
  pdt80: {paddingTop: 80},
  pdt90: {paddingTop: 90},
  pdt100: {paddingTop: 100},

  pdb1: {paddingBottom: 1},
  pdb2: {paddingBottom: 2},
  pdb3: {paddingBottom: 3},
  pdb4: {paddingBottom: 4},
  pdb5: {paddingBottom: 5},
  pdb6: {paddingBottom: 6},
  pdb7: {paddingBottom: 7},
  pdb8: {paddingBottom: 8},
  pdb9: {paddingBottom: 9},
  pdb10: {paddingBottom: 10},
  pdb15: {paddingBottom: 15},
  pdb20: {paddingBottom: 20},
  pdb30: {paddingBottom: 30},
  pdb40: {paddingBottom: 40},
  pdb50: {paddingBottom: 50},

  pdl1: {paddingLeft: 1},
  pdl2: {paddingLeft: 2},
  pdl3: {paddingLeft: 3},
  pdl4: {paddingLeft: 4},
  pdl5: {paddingLeft: 5},
  pdl6: {paddingLeft: 6},
  pdl7: {paddingLeft: 7},
  pdl8: {paddingLeft: 8},
  pdl9: {paddingLeft: 9},
  pdl10: {paddingLeft: 10},
  pdl15: {paddingLeft: 15},
  pdl20: {paddingLeft: 20},
  pdl30: {paddingLeft: 30},
  pdl40: {paddingLeft: 40},
  pdl50: {paddingLeft: 50},

  pdr1: {paddingRight: 1},
  pdr2: {paddingRight: 2},
  pdr3: {paddingRight: 3},
  pdr4: {paddingRight: 4},
  pdr5: {paddingRight: 5},
  pdr6: {paddingRight: 6},
  pdr7: {paddingRight: 7},
  pdr8: {paddingRight: 8},
  pdr9: {paddingRight: 9},
  pdr10: {paddingRight: 10},
  pdr15: {paddingRight: 15},
  pdr20: {paddingRight: 20},
  pdr30: {paddingRight: 30},
  pdr40: {paddingRight: 40},
  pdr50: {paddingRight: 50},


  //margin
  mgt5l10: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10
  },
  mgt5l15: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15
  },
  mgt5l20: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20
  },
  mgt10l15: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15
  },
  mgt10l5: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5
  },
  mgt10l20: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20
  },
  mgt15l5: {
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 5,
    marginRight: 5
  },
  mgt15l10: {
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10
  },
  mgt15l20: {
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 20,
    marginRight: 20
  },
  mgt15l30: {
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 30,
    marginRight: 30
  },


  mg1: {margin: 1},
  mg2: {margin: 2},
  mg3: {margin: 3},
  mg4: {margin: 4},
  mg5: {margin: 5},
  mg6: {margin: 6},
  mg7: {margin: 7},
  mg8: {margin: 8},
  mg9: {margin: 9},
  mg10: {margin: 10},
  mg15: {margin: 15},
  mg20: {margin: 20},
  mg30: {margin: 30},
  mg40: {margin: 40},
  mg50: {margin: 50},

  mgt1: {marginTop: 1},
  mgt2: {marginTop: 2},
  mgt3: {marginTop: 3},
  mgt4: {marginTop: 4},
  mgt5: {marginTop: 5},
  mgt6: {marginTop: 6},
  mgt7: {marginTop: 7},
  mgt8: {marginTop: 8},
  mgt9: {marginTop: 9},
  mgt10: {marginTop: 10},
  mgt15: {marginTop: 15},
  mgt20: {marginTop: 20},
  mgt30: {marginTop: 30},
  mgt40: {marginTop: 40},
  mgt50: {marginTop: 50},
  mgt60: {marginTop: 60},
  mgt70: {marginTop: 70},
  mgt75: {marginTop: 75},
  mgt80: {marginTop: 80},
  mgt90: {marginTop: 90},
  mgt100: {marginTop: 100},
  mgt110: {marginTop: 110},
  mgt120: {marginTop: 120},
  mgt130: {marginTop: 130},
  mgt140: {marginTop: 140},
  mgt150: {marginTop: 150},
  mgt160: {marginTop: 160},
  mgt170: {marginTop: 170},
  mgt180: {marginTop: 180},
  mgt190: {marginTop: 190},
  mgt200: {marginTop: 200},
  mgt250: {marginTop: 250},
  mgt300: {marginTop: 300},

  mgb1: {marginBottom: 1},
  mgb2: {marginBottom: 2},
  mgb3: {marginBottom: 3},
  mgb4: {marginBottom: 4},
  mgb5: {marginBottom: 5},
  mgb6: {marginBottom: 6},
  mgb7: {marginBottom: 7},
  mgb8: {marginBottom: 8},
  mgb9: {marginBottom: 9},
  mgb10: {marginBottom: 10},
  mgb15: {marginBottom: 15},
  mgb20: {marginBottom: 20},
  mgb30: {marginBottom: 30},
  mgb40: {marginBottom: 40},
  mgb50: {marginBottom: 50},
  mgb60: {marginBottom: 60},
  mgb70: {marginBottom: 70},
  mgb75: {marginBottom: 75},
  mgb80: {marginBottom: 80},
  mgb90: {marginBottom: 90},
  mgb100: {marginBottom: 100},
  mgb110: {marginBottom: 110},
  mgb150: {marginBottom: 150},
  mgb200: {marginBottom: 200},
  mgb250: {marginBottom: 250},
  mgb300: {marginBottom: 300},

  mgl1: {marginLeft: 1},
  mgl2: {marginLeft: 2},
  mgl3: {marginLeft: 3},
  mgl4: {marginLeft: 4},
  mgl5: {marginLeft: 5},
  mgl6: {marginLeft: 6},
  mgl7: {marginLeft: 7},
  mgl8: {marginLeft: 8},
  mgl9: {marginLeft: 9},
  mgl10: {marginLeft: 10},
  mgl15: {marginLeft: 15},
  mgl20: {marginLeft: 20},
  mgl30: {marginLeft: 30},
  mgl40: {marginLeft: 40},
  mgl50: {marginLeft: 50},
  mgl60: {marginLeft: 60},
  mgl70: {marginLeft: 70},
  mgl75: {marginLeft: 75},
  mgl80: {marginLeft: 80},
  mgl90: {marginLeft: 90},
  mgl100: {marginLeft: 100},
  mgl110: {marginLeft: 110},
  mgl150: {marginLeft: 150},
  mgl200: {marginLeft: 200},
  mgl250: {marginLeft: 250},
  mgl300: {marginLeft: 300},

  mgr1: {marginRight: 1},
  mgr2: {marginRight: 2},
  mgr3: {marginRight: 3},
  mgr4: {marginRight: 4},
  mgr5: {marginRight: 5},
  mgr6: {marginRight: 6},
  mgr7: {marginRight: 7},
  mgr8: {marginRight: 8},
  mgr9: {marginRight: 9},
  mgr10: {marginRight: 10},
  mgr15: {marginRight: 15},
  mgr20: {marginRight: 20},
  mgr30: {marginRight: 30},
  mgr40: {marginRight: 40},
  mgr50: {marginRight: 50},
  mgr60: {marginRight: 60},
  mgr70: {marginRight: 70},
  mgr75: {marginRight: 75},
  mgr80: {marginRight: 80},
  mgr90: {marginRight: 90},
  mgr100: {marginRight: 100},
  mgr110: {marginRight: 110},
  mgr150: {marginRight: 150},
  mgr200: {marginRight: 200},
  mgr250: {marginRight: 250},
  mgr300: {marginRight: 300},

//图标宽度
  wh12: {width: 12, height: 12},
  wh14: {width: 14, height: 14},
  wh16: {width: 16, height: 16},
  wh18: {width: 18, height: 18},
  wh20: {width: 20, height: 20},
  wh24: {width: 24, height: 24},
  wh26: {width: 26, height: 26},
  wh28: {width: 28, height: 28},
  wh30: {width: 30, height: 30},
  wh32: {width: 32, height: 32},
  wh48: {width: 48, height: 48},
  wh64: {width: 64, height: 64},
  wh70: {width: 70, height: 70},
  wh75: {width: 75, height: 75},
  wh88: {width: 88, height: 88},
  wh128: {width: 128, height: 128},
  wh200: {width: 200, height: 200},


  ww: {width: screenW},
  ww1: {width: screenW * 0.1},
  ww2: {width: screenW * 0.2},
  ww202: {width: screenW * 0.22},
  ww204: {width: screenW * 0.24},
  ww205: {width: screenW * 0.25},
  ww206: {width: screenW * 0.26},
  ww208: {width: screenW * 0.28},
  ww3: {width: screenW * 0.3},
  ww4: {width: screenW * 0.4},
  ww5: {width: screenW * 0.5},
  ww6: {width: screenW * 0.6},
  ww7: {width: screenW * 0.7},
  ww8: {width: screenW * 0.8},
  ww9: {width: screenW * 0.9},
  ww15: {width: screenW * 0.15},
  ww25: {width: screenW * 0.25},
  ww35: {width: screenW * 0.35},
  ww45: {width: screenW * 0.45},
  ww55: {width: screenW * 0.55},
  ww65: {width: screenW * 0.65},
  ww75: {width: screenW * 0.75},
  ww85: {width: screenW * 0.85},
  ww95: {width: screenW * 0.95},
  ww99: {width: screenW * 0.99},
  ww98: {width: screenW * 0.98},
  ww97: {width: screenW * 0.97},
  ww975: {width: screenW * 0.975},

  hh: {height: screenH},
  hh1: {height: screenH * 0.1},
  hh2: {height: screenH * 0.2},
  hh3: {height: screenH * 0.3},
  hh4: {height: screenH * 0.4},
  hh5: {height: screenH * 0.5},
  hh6: {height: screenH * 0.6},
  hh7: {height: screenH * 0.7},
  hh8: {height: screenH * 0.8},
  hh9: {height: screenH * 0.9},
  hh95: {height: screenH * 0.95},
  hh96: {height: screenH * 0.96},
  hh97: {height: screenH * 0.97},
  hh98: {height: screenH * 0.98},
  hh99: {height: screenH * 0.99},

  w50: {width: 50},
  w55: {width: 55},
  w60: {width: 60},
  w70: {width: 70},
  w80: {width: 80},
  w90: {width: 90},
  w100: {width: 100},
  w110: {width: 110},
  w120: {width: 120},
  w130: {width: 130},
  w140: {width: 140},
  w150: {width: 150},
  w160: {width: 160},


  h1: {height: 1},
  h2: {height: 2},
  h3: {height: 3},
  h4: {height: 4},
  h5: {height: 5},
  h6: {height: 6},
  h7: {height: 7},
  h8: {height: 8},
  h9: {height: 9},
  h10: {height: 10},
  h15: {height: 15},
  h20: {height: 20},
  h30: {height: 30},
  h35: {height: 35},
  h40: {height: 40},
  h50: {height: 50},
  h60: {height: 60},
  h70: {height: 70},
  h80: {height: 80},
  h90: {height: 90},
  h100: {height: 100},
  h110: {height: 110},
  h120: {height: 120},
  h130: {height: 130},
  h140: {height: 140},
  h150: {height: 150},
  h160: {height: 160},
  h200: {height: 200},
  h300: {height: 300},
  h400: {height: 400},
  h500: {height: 500},
  h600: {height: 600},


//  文字居中
  tac:{
    textAlign:'center'
  },
//  定位
  pos: {
    position: 'relative',
  },
  posr: {
    position: 'absolute',
    top: 0,
  },
  posl: {
    position: 'absolute',
    top: 0,
  },
  fl1: {left: -1},
  fl2: {left: -2},
  fl3: {left: -3},
  fl4: {left: -4},
  fl5: {left: -5},
  fl6: {left: -6},
  fl7: {left: -7},
  fl8: {left: -8},
  fl9: {left: -9},
  fl10: {left: -10},
  fl15: {left: -15},
  fl20: {left: -20},
  fl30: {left: -30},
  fl40: {left: -40},
  fl50: {left: -50},
  fl60: {left: -60},
  fl70: {left: -70},
  fl80: {left: -80},
  fl90: {left: -90},
  fl100: {left: -100},
  
  ft1: {top: -1},
  ft2: {top: -2},
  ft3: {top: -3},
  ft4: {top: -4},
  ft5: {top: -5},
  ft6: {top: -6},
  ft7: {top: -7},
  ft8: {top: -8},
  ft9: {top: -9},
  ft10: {top: -10},
  ft15: {top: -15},
  ft20: {top: -20},
  ft30: {top: -30},
  ft40: {top: -40},
  ft50: {top: -50},
  ft60: {top: -60},
  ft70: {top: -70},
  ft80: {top: -80},
  ft90: {top: -90},
  ft100: {top: -100},

  fb1: {bottom: -1},
  fb2: {bottom: -2},
  fb3: {bottom: -3},
  fb4: {bottom: -4},
  fb5: {bottom: -5},
  fb6: {bottom: -6},
  fb7: {bottom: -7},
  fb8: {bottom: -8},
  fb9: {bottom: -9},
  fb10: {bottom: -10},
  fb15: {bottom: -15},
  fb20: {bottom: -20},
  fb30: {bottom: -30},
  fb40: {bottom: -40},
  fb50: {bottom: -50},
  fb60: {bottom: -60},
  fb70: {bottom: -70},
  fb80: {bottom: -80},
  fb90: {bottom: -90},
  fb100: {bottom: -100},

  fr1: {right: -1},
  fr2: {right: -2},
  fr3: {right: -3},
  fr4: {right: -4},
  fr5: {right: -5},
  fr6: {right: -6},
  fr7: {right: -7},
  fr8: {right: -8},
  fr9: {right: -9},
  fr10: {right: -10},
  fr15: {right: -15},
  fr20: {right: -20},
  fr30: {right: -30},
  fr40: {right: -40},
  fr50: {right: -50},
  fr60: {right: -60},
  fr70: {right: -70},
  fr80: {right: -80},
  fr90: {right: -90},
  fr100: {right: -100},


  //公共自定义样式
  //布局样式
  //混合样式

  FLEX: {
    flex: 1
  },

  AISB:{
    justifyContent: 'space-between',
  },
  ROW: {
    flexDirection: 'row',
  },
  JCSB: {
    justifyContent: 'space-between',
  },


  AIC: {
    alignItems: 'center',
  },


  //边框样式
  BW: {
    borderWidth: 1,
  },
  BR: {
    borderRadius: 3
  },
  BTW: {
    borderTopWidth: 1,
  },
  BRW: {
    borderRightWidth: 1,
  },
  BLW: {
    borderLeftWidth: 1,
  },
  BBW: {
    borderBottomWidth: 1,
  },
  BCE6: {
    borderColor: '#e6e6e6',
  },


  //字体
  FS5: {fontSize: 5},
  FS8: {fontSize: 8},
  FS10: {fontSize: 10},
  FS12: {fontSize: 12},
  FS14: {fontSize: 14},
  FS16: {fontSize: 16},
  FS18: {fontSize: 18},
  FS20: {fontSize: 20},
  CE0: {
    color: '#e0e0e0'
  },
  CFF: {
    color: '#fff'
  },
  CBE: {
    color: '#BEBEBE'
  },


  //BackgroundColor
  BCKE6: {
    backgroundColor: '#E6E6E6'
  },
  BCKF5: {
    backgroundColor: '#F5F5F5'
  },
  BCKFFF: {
    backgroundColor: '#FFF'
  },
  //BackgroundColor
  bcke6: {
    backgroundColor: '#E6E6E6'
  },
  bckf5: {
    backgroundColor: '#F5F5F5'
  },
  bckf8: {
    backgroundColor: '#F8F8F8'
  },
  bckfff: {
    backgroundColor: '#FFF'
  },
//padding
  //混合模式
  PD0: {padding: 0,},
  PD5: {padding: 5,},
  PD10: {padding: 10,},
  PD15: {padding: 15,},

  PDT0: {paddingTop: 0,},
  PDT5: {paddingTop: 5,},
  PDT10: {paddingTop: 10,},
  PDT15: {paddingTop: 15},

  PDB0: {paddingBottom: 0},
  PDB5: {paddingBottom: 5},
  PDB10: {paddingBottom: 10},
  PDB15: {paddingBottom: 15},

  PDL0: {paddingLeft: 0},
  PDL5: {paddingLeft: 5},
  PDL10: {paddingLeft: 10},
  PDL15: {paddingLeft: 15},

  PDR0: {paddingRight: 0},
  PDR5: {paddingRight: 5},
  PDR10: {paddingRight: 10},
  PDR15: {paddingRight: 15},


  //margin
  MG0: {margin: 0,},
  MG5: {margin: 5,},
  MG10: {margin: 10,},
  MG15: {margin: 15,},

  MGT0: {marginTop: 0,},
  MGT5: {marginTop: 5,},
  MGT10: {marginTop: 10,},
  MGT15: {marginTop: 15},

  MGB0: {marginBottom: 0},
  MGB5: {marginBottom: 5},
  MGB10: {marginBottom: 10},
  MGB15: {marginBottom: 15},

  MGL0: {marginLeft: 0},
  MGL5: {marginLeft: 5},
  MGL10: {marginLeft: 10},
  MGL15: {marginLeft: 15},

  MGR0: {marginRight: 0},
  MGR5: {marginRight: 5},
  MGR10: {marginRight: 10},
  MGR15: {marginRight: 15},


  roeSelfW: {
    width: 70,
  },


})
module.exports = com;
