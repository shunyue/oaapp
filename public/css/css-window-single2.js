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
const wds = StyleSheet.create({

  //nav右上角弹出菜单样式
  model: {
    width: 120,
    height: 210,
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
    //borderBottomWidth: 1,
    //borderBottomColor: '#bbb',
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
module.exports = wds;
