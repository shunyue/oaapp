import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  Platform,
  ScrollView,
  Dimensions,
  ListView,
  Alert,
  Modal,
  TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import wds from '../../public/css/css-window-single';
import com from '../../public/css/css-com';


import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';


export default class ProductDetail extends Component {





  //查询产品详情
  constructor(props){
    super(props)
    this.state={
      //底部选择项 默认不显示
      show: false,

      id:"",
      name: "",
      type:"",
      status:"",
      describe:"",
    };
  }
  componentDidMount(){
    this.subscription = DeviceEventEmitter.addListener('id',(value) => {
      var url = config.api.base + config.api.productdetail;
      request.post(url,{
        id:value ,
      }).then((responseJson) => {

        this.setState({
          id:responseJson.id,
          name: responseJson.product_name,
          type:responseJson.type_name,
          status:responseJson.product_status,
          describe:responseJson.product_description
        })

      }).catch((error)=>{
        toast.bottom('网络连接失败，请检查网络后重试');
      })

    })
    this.getNet();
  }

  getNet(){
    var url = config.api.base + config.api.productdetail;
    request.post(url,{
      id: this.props.navigation.state.params.id,
    }).then((responseJson) => {

      this.setState({
        id:responseJson.id,
        name: responseJson.product_name,
        type:responseJson.type_name,
        status:responseJson.product_status,
        describe:responseJson.product_description
      })

    }).catch((error)=>{
      toast.bottom('网络连接失败，请检查网络后重试');
    })
  }
  //查询产品详情





  //底部选择项
  setVisibleModal(visible) {
    this.setState({show: visible});
  }



  back() {
   // this.props.navigation.navigate('Product',{company_id:this.props.navigation.state.params.company_id});

    DeviceEventEmitter.emit('company_id', this.props.navigation.state.params.company_id);
    this.props.navigation.goBack(null);
  }

  //删除产品
  del_product(){

    var url = config.api.base + config.api.delproduct;
    request.post(url,{
      id: this.state.id,
    }).then((responseJson) => {
      //Alert.alert(JSON. stringify(responseJson));
      if(responseJson.sing==1){
        toast.center('删除成功');
        this.props.navigation.navigate('Product');

      }

    }).catch((error)=>{
      toast.bottom('网络连接失败，请检查网络后重试');
    })

  }


  //编辑产品
  edit_product(){
    const { navigate } = this.props.navigation;
    navigate('Productedit', { id: this.state.id,company_id:this.props.navigation.state.params.company_id})
  }


  render() {
    return (
      <View style={styles.body}>
        {/*导航栏*/}
        <View style={styles.nav}>
          <TouchableHighlight
            onPress={()=>this.back()}
            underlayColor="#d5d5d5"
          >
            <View style={styles.navltys}>
              <Image source={require('../../imgs/navxy.png')}/>
              <Text style={[styles.fSelf,styles.navltyszt]}>返回</Text>
            </View>

          </TouchableHighlight>
          <Text style={styles.fSelf}>产品详情</Text>
          <TouchableOpacity style={wds.icon_touch2} onPress={() => {{this.setState({show: !this.state.show})}}}>
            <View style={styles.navltys}>
              <Image style={[styles.navltysImg]} source={require('../../imgs/product/slh32.png')}/>
            </View>

          </TouchableOpacity>
        </View>
        {/*内容主题*/}
        <ScrollView style={styles.childContent}>
          <View style={[styles.ancestorCon]}>

            <View style={[styles.divCom]}>

              <View style={[styles.divRowCom]}>
                <Text style={[styles.divFontCom]}>产品名称</Text>
                <Text>{this.state.name}</Text>
              </View>
              <View style={[styles.divRowCom,styles.divRowSelfBottomBorder]}>
                <Text style={[styles.divFontCom]}>产品分类</Text>
                <Text>{this.state.type}</Text>
              </View>
              <View style={[styles.divRowCom]}>
                <Text style={[styles.divFontCom]}>状 态</Text>
                <Text>{this.state.status == 1 ? '已启用' : '未启用'}</Text>
              </View>
              <View style={[styles.divRowSelf,styles.divRowSelfBottomBorder]}>
                <Text style={[styles.divFontCom]}>产品描述</Text>
                <Text style={[styles.divFontSelf]}>{this.state.describe}</Text>
              </View>


            </View>
          </View>
        </ScrollView>


        {/* 添加模型 */}
        <View>
          <Modal
            animationType={"fade"}
            transparent={true}
            visible={this.state.show}
            onRequestClose={() => {alert("Modal has been closed.")}}
          >
            <View style={[{width:screenW,height:screenH*0.76,backgroundColor:'#555',opacity:0.6},]}>
              <TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {
  this.setVisibleModal(!this.state.show)
}}></TouchableOpacity>
            </View>
            <View style={[wds.addCustomer,com.ROW,com.JCC]}>
              <View style={wds.addCustomer_card}>
                <TouchableOpacity style={[com.PD10]}
                                  onPress={() => { this.setVisibleModal(!this.state.show);this.edit_product()}}>
                  <Text style={{color:'#333'}}>编辑产品</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[com.PD10]}
                                  onPress={() => { this.setVisibleModal(!this.state.show);this.del_product()}}>
                  <Text style={{color:'#333'}}>删除产品</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[com.PD10,com.AIC]}
                                  onPress={() => { this.setVisibleModal(!this.state.show)}}>
                  <Text style={{color:'#555'}}>取消</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>


      </View>
    )

  }
}

const styles = StyleSheet.create({
  //nav
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
  body: {//祖先级容器
    flex: 1,
    backgroundColor: '#f8f8f8'
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
  navltysImg: {
    width: 24,
    height: 24,
  },
//    主题内容
  childContent: {//子容器页面级
    flex: 1,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#F8F8F8',
  },

  //页签切换
  ancestorCon: {//祖先级
    //flex: 1,
  },
  divTit: {//祖级--区域-主题内容title部分
    flexDirection: 'row',
    //justifyContent: 'space-around',
    height: 30,
    paddingTop: 5,
    marginBottom: 10,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },
  eleCon: {//父级-块
    width: screenW * 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#a4a4a4',
  },
  eleFontCon: {//子级-字体
    fontSize: 12,
  },
  eleSelf: {//私有级
    borderRightWidth: 1,
    borderColor: '#e3e3e3',
  },
  eleImgCon: {//子级-图片
    marginRight: 5,
  },

  //内容模块
  divCom: {//祖先级-区域
    flex: 1,
  },
  rowCom: {//祖级-行
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F2F3',
  },

  eleTopCom: {//父级-块
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  comLeft: {//次父级-次级块

  },
  comRight: {//次父级-次级块

  },
  elefontCom: {//子级-E
    fontSize: 10,
    color: '#969696',
  },


  eleBottomCom: {//父级-块
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  navltysImgSelf: {//子级-E-图片-文件夹
    width: 14,
    height: 14,
  },


//    内容区域
  divRowCom: {//父级-行
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#F3F3F3',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'

  },
  divFontCom: {//子级-E
    color: '#939393',
  },
  divRowSelf: {//私有级
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#F3F3F3',
  },
  divFontSelf: {//私有级
    marginTop: 10
  },
  divRowSelfBottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
});
