/**
 * Created by Administrator on 2017/6/15.
 */
import {
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
const styles = StyleSheet.create({
  navltys: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: (Platform.OS === 'ios') ? 50 : 30,
    alignItems: 'center',
  },
  navltyszt: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#e4393c',
  },

  container: {
    flex: 1,
    backgroundColor: '#F8F8F8'
  },
  ancestorCon: {//祖先级容器
    flex: 1,
    backgroundColor: '#EEEFF4'
  },
  nav: {//头部导航
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
  },
  sz: {//导航图标
    width: 30,
    height: 30
  },
  fSelf: {//导航字体相关
    color: '#000',
    //height: 30,
    fontSize: 16
  },
//    主题内容
  childContent: {//子容器页面级
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#fff',
  },
//    公共行级元素
  common: {
    flex: 1,
  },

  ImgSelf: {//私有级
    width: 24,
    height: 24,
  },

  //弹出层
  model:{
    width:120,
    height:130,
    position: 'absolute',
    right:6,
    top:55,
    backgroundColor:'#000',
    opacity:0.6,
    borderRadius:6
  },
  model_up:{
    width:120,
    height:130,
    position: 'absolute',
    right:6,
    top:55,

  },
  model_up_in:{
    padding:10,
    flexDirection:'row',
    justifyContent:'center',
    borderBottomWidth: 1,
    borderBottomColor:'#bbb',
  },
  model_up_border:{
    borderBottomWidth: 0,
  },
  text_color:{
    color:'#fff',
    fontSize:14
  },
  icon_:{
    width:22,
    height:22
  },
  icon_1:{
    width:20,
    height:20
  },
  icon_2:{
    width:20,
    height:11,
  },
  icon_san:{
    width:25,
    height:14,
    position: 'absolute',
    right:5,
    top:-11,

  },
  addCustomer:{
    flex:1,
    position:'absolute',
    bottom:0,
  },
  addCustomer_card:{
    width:screenW,
    height:screenH*0.25,
    backgroundColor:'#fff',
  },
  customerCard_content:{
    justifyContent:'center',
    alignItems:'center',
    height:screenH*0.08,
    width:screenW,
    borderBottomWidth:1,
    borderBottomColor:'#ccc',
  },
  customerCard_content2:{
    borderBottomWidth:0,
  },
  navltysImg:{
    width:24,
    height:24,
    alignItems:'center'
  },




  //nav右上角弹出菜单样式
  model: {
    width: 120,
    height: 90,
    position: 'absolute',
    right: 6,
    top: 55,
    backgroundColor: '#000',
    opacity: 0.6,
    borderRadius: 6
  },
  model_up: {
    width: 120,
    height: 130,
    position: 'absolute',
    right: 6,
    top: 55,

  },
  model_up_in: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
  },
  model_up_border: {
    borderBottomWidth: 0,
  },
  text_color: {
    color: '#fff',
    fontSize: 14
  },
  icon_: {
    width: 22,
    height: 22
  },
  icon_1: {
    width: 20,
    height: 20
  },
  icon_2: {
    width: 20,
    height: 11,
  },
  icon_san: {
    width: 25,
    height: 14,
    position: 'absolute',
    right: 5,
    top: -11,

  },









})
module.exports = styles;
