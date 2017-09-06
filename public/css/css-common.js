/**
 * Created by Administrator on 2017/6/15.
 */
import {
  StyleSheet,
} from 'react-native';
const styles = StyleSheet.create({
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
  //公共自定义样式
  //布局样式
  FLEX:{
    flex:1
  },
  row: {
    flexDirection: 'row',
  },
  ROW: {
    flexDirection: 'row',
  },
  JCSB: {
    justifyContent: 'space-between',
  },
  JCC:{
    justifyContent: 'center',
  },
  AIC: {
    alignItems: 'center',
  },

  //边框样式
  BW: {
    borderWidth: 1,
  },
  BTW:{
    borderTopWidth: 1,
  },
  BRW:{
    borderRightWidth: 1,
  },
  BLW:{
    borderLeftWidth: 1,
  },
  BBW: {
    borderBottomWidth: 1,
  },
  BCE6:{
    borderColor:'#e6e6e6',
  },

  //BackgroundColor
  BCKE6:{
    backgroundColor:'#E6E6E6'
  },
  BCKFFF:{
    backgroundColor:'#FFF'
  },
//padding
  PD5:{padding:5,},
  PD10:{padding:10,},
  PD15:{padding:15,},

  PDT5:{paddingTop:5,},
  PDT10:{paddingTop:10,},
  PDT15:{paddingTop:15},

  PDB5:{paddingBottom:5},
  PDB10:{paddingBottom:10},
  PDB15:{paddingBottom:15},

  PDL5:{paddingLeft:5},
  PDL10:{paddingLeft:10},
  PDL15:{paddingLeft:15},

  PDR5:{paddingRight:5},
  PDR10:{paddingRight:10},
  PDR15:{paddingRight:15},


  //margin
  MG5:{margin:5,},
  MG10:{margin:10,},
  MG15:{margin:15,},

  MGT5:{marginTop:5,},
  MGT10:{marginTop:10,},
  MGT15:{marginTop:15},

  MGB5:{marginBottom:5},
  MGB10:{marginBottom:10},
  MGB15:{marginBottom:15},

  MGL5:{marginLeft:5},
  MGL10:{marginLeft:10},
  MGL15:{marginLeft:15},

  MGR5:{marginRight:5},
  MGR10:{marginRight:10},
  MGR15:{marginRight:15},

  imgSelfMaRight: {
    //width:33,
    //height:33,
  },
  roeSelfW: {
    width: 70,
  },


})
module.exports = styles;
