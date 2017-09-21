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
  Switch,
  TextInput,
  Alert,
  DeviceEventEmitter,
    TouchableOpacity,
  Button
} from 'react-native';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import com from '../../public/css/css-com';
/*引用图库选择插件*/
import ImagePicker from 'react-native-image-picker';
import Header from '../../common/header';
export default class SendNotice extends Component {
  back() {
    this.props.navigation.goBack(null);
  }
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      value: false,
      text: '',
      path:'',
      url:'',
      pic:'',
      imgArr:[],
      accepter:[],
      id:1
    };
  }

  componentDidMount() {
    this.Listener= DeviceEventEmitter.addListener('accepter', (a)=> {
       this.setState({
         accepter:a.accepter,
         value:a.value
       })

    });
  }
  componentWillUnmount() {
    // 移除监听
    this.Listener.remove();
  }
/*  openAffix(){
    //alert('这是打开文件夹')
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      this.state.imgArr.push({id: this.state.id, visible: null, path: image.path});
      this.setState({//放到这里只是为了渲染页面
        id: this.state.id + 1
      })
    });
  }*/
  openAffix(){
    //选择图片
      var options = {
        title: '',
        cancelButtonTitle: '取消',
        takePhotoButtonTitle: '拍照',
        chooseFromLibraryButtonTitle: '选择相册',
        storageOptions: {
          skipBackup: true,
          path: 'images'
        }
      };
      ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        }
        else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        }
        else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        }
        else {
          let source = {uri: response.uri};
          //this.state.imgs.push(response.uri);
          //this.setState({})
          this.state.imgArr.push({id: this.state.id,
                                 visible: null,
                                 path: response.uri,
                                 name:response.fileName});
          this.setState({//放到这里只是为了渲染页面
            id: this.state.id + 1
          })

        }
      })
  }
  uploadImg(){
    var url =config.api.base + config.api.imagesupload;
    let formData = new FormData();
    let images= this.state.imgArr;
    for(var i = 0;i<images.length;i++){
      if(images[i].visible==null){
        let file = {uri: images[i].path, type:'multipart/form-data', name:images[i].name};//这里的key(uri和type和name)不能改变
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
    var imgArr = this.state.imgArr;
    var op = [];
    for (var i in imgArr) {
      if (imgArr[i].id === id) {
        op.push(
            {id: imgArr[i].id, visible: 'none', path: imgArr[i].path}
        )
      }else{
        op.push(
            {id: imgArr[i].id, visible: imgArr[i].visible, path: imgArr[i].path}
        )
      }
    }
    this.setState({
      imgArr: op
    })
  }
  //指向下一步
  sendNoticeNextStep(){
    let {params}=this.props.navigation.state;
    var url =config.api.base + config.api.test;
    var title=this.state.title;
    var content=this.state.content;
    let images= this.state.imgArr;
    if(title ==null){
    return  toast.bottom('公告标题不能为空');
    }else if(content==null){
    return  toast.bottom('公告内容不能为空');
    }
    for(var i = 0;i<images.length;i++){
      if(images[i].visible==null && this.state.pic==""){//如果选择了图片而且没有上传到服务器
        toast.bottom('请先上传图片!');
        return false;
      }
    }
    //跳转到下一步
    var notice={
      title: title,
      content:content,
      pic:this.state.pic
    };
    this.props.navigation.navigate('SendNoticeNextStep',{
      notice:notice,
      user_id:params.user_id,
      userName:params.userName,
      company_id:params.company_id,
      accepter:this.state.accepter,
      value:this.state.value
    });
  };
  render(){
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
      <View style={styles.ancestorCon}>
          <Header title="发公告"
                  navigation={this.props.navigation}
                  rightText="下一步"
                  onPress={()=>this.sendNoticeNextStep()}/>
        {/*内容主题*/}
        <ScrollView style={[com.FLEX,com.BCKF5]}>
          {/*详情*/}
          <View
            style={[com.BCKFFF,com.AIC,com.ROW,com.JCSB,com.PDL15,com.PDR15,com.MGT5,com.BTW,com.BBW,com.BCE6]}>
            <Text>公告标题</Text>
            <View style={{width:260}}>
              <TextInput
                style={{height: 40,}}
                underlineColorAndroid={'transparent'}
                numberOfLines={1}
                placeholder='请输入标题'
                secureTextEntry={false}
                onChangeText={(title) => this.setState({title})}
                value={this.state.title}
              />
            </View>
          </View>
          {/*图片+附件*/}
          <View style={[com.BCKFFF,com.MGT10,com.BTW,com.BBW,com.BCE6]}>
            <View style={{paddingLeft:15,paddingRight:15,minHeight:40,justifyContent:'center'}}>
              {/*TITLE*/}
              <TouchableOpacity
                  onPress={()=>this.openAffix()}
                  >
                <View style={[com.ROW,com.JCSB]}>
                  <View style={[com.ROW,{height:40,justifyContent:'center'}]}>
                    <Text>图片</Text>
                  </View>
                  <Image style={[com.wh16]} source={require('../../imgs/navxy2.png')}/>
                </View>
              </TouchableOpacity>
              {/*放置图片*/}
              <View style={[com.bgcff,com.aic,com.row,com.flww,{}]}>
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
          </View>
          {/*请输入公告内容*/}
          <View style={[{height:150},com.BCKFFF,com.MGT10,com.BTW,com.BBW,com.BCE6,com.PDL15,com.PDR15,com.PDB10]}>
            <TextInput
              style={{height: 80,}}
              underlineColorAndroid={'transparent'}
              numberOfLines={5}
              placeholder='请输入公告内容'
              multiline={true}
              //maxLength={10}
              //textAlignVertica={'top'}
              secureTextEntry={false}
              onChangeText={(content) => this.setState({content})}
              value={this.state.content}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  navltys: {
    flex: 1,
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
    //flex: 1,
    //paddingLeft: 10,
    //paddingRight: 10,
    //paddingTop: 5,
    //paddingBottom: 5,
    //backgroundColor: '#fff',
  },
});
const sef = StyleSheet.create({
  imgSelfTwo: {
    width: 30,
    height: 30,
  },
});
