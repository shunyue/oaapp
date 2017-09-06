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
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  DeviceEventEmitter
} from 'react-native';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import com from '../../public/css/css-com';
import Modal from 'react-native-modal'
import wds from '../../public/css/css-window-single'
import ImagePicker from 'react-native-image-crop-picker';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import moment from 'moment';

export default class LogWeekReport extends Component {
  back() {
    this.props.navigation.goBack(null);
  }
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      path:'',
      finish:'',
      summary:'',
      plan:'',
      coordinate:'',
      imgArr:[],
      pic:'',
      time: moment(new Date()).format('YYYY-MM-DD HH:mm'),
      id:1
    };
  }

  submit() {
    //this.props.navigation.navigate('LogTody')
    this.newLog();
  }

  openAffix(){
    //alert('这是打开文件夹')
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {;
      this.state.imgArr.push({id: this.state.id, visible: null, path: image.path});
      this.setState({//放到这里只是为了渲染页面
        id: this.state.id + 1
      })
    });
  }
  uploadImg(){
    var url =config.api.base + config.api.imagesupload;
    let formData = new FormData();
    let images= this.state.imgArr;
    for(var i = 0;i<images.length;i++){
      if(images[i].visible==null){
        let file = {uri: images[i].path, type:'multipart/form-data', name:images[i].path};//这里的key(uri和type和name)不能改变
        formData.append(images[i].path,file);//这里的files就是后台需要的key
      }
    }
    fetch(url,{
      method:'POST',
      headers:{
        'Content-Type':'multipart/form-data'
      },
      body:formData
    })
        .then((response) => response.json())
        .then((res)=>{
          if(res.status==1){//图片上传成功后,返回图片的路径
            toast.center(res.message);
            this.setState({
              pic:res.data
            })
          }else{
            toast.bottom('提交数据失败,请重试');
          }
        })
        .catch((error)=>{
          toast.bottom('网络连接失败，请检查网络后重试');
        });
  }
  goonDel(id) {
    //alert(id)
    var imgArr = this.state.imgArr;
    var op = [];
    for (var i in imgArr) {
      //console.log(i)
      if (imgArr[i].id === id) {
        op.push(
            {id: imgArr[i].id, visible: 'none', path: imgArr[i].path}
        )
      } else {
        op.push(
            {id: imgArr[i].id, visible: imgArr[i].visible, path: imgArr[i].path}
        )
      }
    }
    this.setState({
      imgArr: op
    })
  }
  newLog(){//提交数据
    let {params} = this.props.navigation.state;
    var url = config.api.base + config.api.newLog;
    if(this.state.finish==''){
      toast.bottom('本周完成工作不能为空');
      return false;
    }
    let images= this.state.imgArr;
    for(var i = 0;i<images.length;i++){
      if(images[i].visible==null && this.state.pic==""){//如果选择了图片而且没有上传到服务器
        toast.bottom('请先上传图片!');
        return false;
      }
    }
    request.post(url, {
      week_finish:this.state.finish,
      summary:this.state.summary,
      weekplan:this.state.plan,
      coordinate:this.state.coordinate,
      explain:this.state.explain,
      pic:this.state.pic,
      log_type:2,
      employee_id:params.user_id,
      datetime:this.state.time
    }).then((res) => {
      //alert(JSON.stringify(res));
      if(res.status==1){
        toast.center(res.message);
        DeviceEventEmitter.emit('newLog',1); //发监听
        this.props.navigation.goBack('LogWeekReport');
      }else{
        toast.bottom(res.message);
      }
    })
        .catch((error)=> {
          toast.bottom('网络连接失败，请检查网络后重试');
        });
  }

  render() {
    let imgArr = this.state.imgArr;
    var list = [];
    for (var i = 0; i < imgArr.length; i++) {
      if(imgArr[i].visible==null){
        list.push(
            <View style={[com.pos]} key={i}>
              <Image source={{uri: imgArr[i].path}} style={[com.MG5,com.wh64,com.pos]}/>
              <TouchableHighlight
                  style={[com.MG5,com.posr,{top:-3,right:0}]}
                  onPress={this.goonDel.bind(this,imgArr[i].id)}
                  underlayColor="#f5f5f5"
                  >
                <Image source={require('../../imgs/del162.png')} style={[com.wh16]}/>
              </TouchableHighlight>
            </View>
        )
      }
    }
    return (
      <View style={[styles.ancestorCon,{backgroundColor:'#f8f8f8'}]}>

        {/*导航栏*/}
        <View style={[styles.navCon,com.aic]}>
          <TouchableHighlight
            style={styles.navltys}
            onPress={()=>this.back()}
            underlayColor="#d5d5d5"
          >
            <View style={styles.navltys}>
              <Image source={require('../../imgs/navxy.png')}/>
              <Text style={[styles.fSelf,styles.navltyszt]}>返回</Text>
            </View>

          </TouchableHighlight>


          <Text style={styles.fSelf}>周报</Text>
          <TouchableHighlight
            style={styles.navltys}
            onPress={()=>this.submit()}
            underlayColor="#f5f5f5"
          >
            <View style={[com.jcc,styles.navltys]}>
              <Text style={[styles.fSelf,styles.navltyszt]}>提交</Text>
            </View>
          </TouchableHighlight>

        </View>
        {/*内容主题*/}
        <ScrollView style={[]}>
          <View style={[com.row,com.jcsb,com.bckf5,com.pdt5l15,com.bbwc]}>
            <Text style={[com.cbe]}>周报</Text>
            {/* <Text style={[com.cbe]}>已存草稿箱:10:48</Text>*/}
          </View>
          <View style={[com.bckfff]}>
            <View style={[com.pdt5l15,com.row,com.aic]}>
              <Text style={[com.w90]}>本周完成工作</Text>
              <TextInput
                style={{height: 30,padding:5,width:screenW*0.6}}
                underlineColorAndroid={'transparent'}
                numberOfLines={1}
                placeholder='请输入文本(必填)'
                placeholderTextColor='#bebebe'
                secureTextEntry={false}
                onChangeText={(finish) => this.setState({finish})}
                value={this.state.finish}
              />
            </View>
            <View style={[com.pdt5l15,com.row,com.aic]}>
              <Text style={[com.w90]}>本周工作总结</Text>
              <TextInput
                style={{height: 30,padding:5,width:screenW*0.6}}
                underlineColorAndroid={'transparent'}
                numberOfLines={1}
                placeholder='请输入文本'
                placeholderTextColor='#bebebe'
                secureTextEntry={false}
                onChangeText={(summary) => this.setState({summary})}
                value={this.state.summary}
              />
            </View>
            <View style={[com.pdt5l15,com.row,com.aic]}>
              <Text style={[com.w90]}>下周工作计划</Text>
              <TextInput
                style={{height: 30,padding:5,width:screenW*0.6}}
                underlineColorAndroid={'transparent'}
                numberOfLines={1}
                placeholder='请输入文本'
                placeholderTextColor='#bebebe'
                secureTextEntry={false}
                onChangeText={(plan) => this.setState({plan})}
                value={this.state.plan}
              />
            </View>
            <View style={[com.pdt5l15,com.row,com.aic]}>
              <Text style={[com.w90]}>需协调与帮助</Text>
              <TextInput
                style={{height: 30,padding:5,width:screenW*0.6}}
                underlineColorAndroid={'transparent'}
                numberOfLines={1}
                placeholder='请输入文本'
                placeholderTextColor='#bebebe'
                secureTextEntry={false}
                onChangeText={(coordinate) => this.setState({coordinate})}
                value={this.state.coordinate}
              />
            </View>
          </View>
          <View style={[com.bckfff,com.pdt5,com.pdl15,com.pdr15]}>
            <Text>备注</Text>
            <TextInput
              style={{height: 40,padding:5,}}
              underlineColorAndroid={'transparent'}
              numberOfLines={10}
              multiline={true}
              textAlignVertical="top"
              placeholder='请输入文本'
              placeholderTextColor='#bebebe'
              secureTextEntry={false}
              onChangeText={(explain) => this.setState({explain})}
              value={this.state.explain}
            />

             <View style={[com.row,com.jcfe,com.bbwc,com.pdb2]}>
               {/*  <TouchableHighlight
                style={[]}
                onPress={()=>this.yysubmit()}
                underlayColor="#f5f5f5"
              >
                <Image style={[com.wh16]} source={require('../../imgs/iconyy.png')}/>
              </TouchableHighlight>*/}
            </View>
          </View>
          <View style={[com.pdt5l15,com.bckfff]}>
            <TouchableHighlight
              onPress={()=>this.openAffix()}
              underlayColor="#f5f5f5"
            >
              <View style={[com.row,com.jcsb,com.pdt10,com.pdb10]}>
                <Text>照片</Text>
                <Image style={[com.wh24]} source={require('../../imgs/zxj32.png')}/>
              </View>
            </TouchableHighlight>
            <View style={[com.bgcff,com.row,com.pdt10l15,com.flww,com.aic]}>
              {list}
              {list.length==0?(null):(
                  <TouchableHighlight
                      onPress={()=>this.uploadImg()}
                      underlayColor="#d5d5d5"
                      >
                    <View style={[com.jcc,com.aic,com.h30,]}>
                      <Text style={[com.bwr,com.bgcfff,com.br5,com.pd5,com.cr]}>上传图片</Text>
                    </View>
                  </TouchableHighlight>
              )}
            </View>

          </View>

        </ScrollView>
      </View>


    )
      ;
  }
}

const styles = StyleSheet.create({

  navltys: {
    //flex: 1,
    width: 50,
    flexDirection: 'row',
    //justifyContent: 'space-between',
    //height: (Platform.OS === 'ios') ? 50 : 30,
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
    backgroundColor: '#EEEFF4',
  },
  navCon: {//头部导航
    height: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDEDE',
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
  navFont: {
    color: '#FC2E40'
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


});
