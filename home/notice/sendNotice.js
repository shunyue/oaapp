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
  Button
} from 'react-native';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import com from '../../public/css/css-com';
/*引用图库选择插件*/
import ImagePicker from 'react-native-image-crop-picker';
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
    };
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
    var imgArr = this.state.imgArr;
    var op = [];
    for (var i in imgArr) {
      //console.log(i)
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
        {/*导航栏*/}
        <View style={styles.nav}>
          <TouchableHighlight
            onPress={()=>this.back()}
            underlayColor="#d5d5d5"
          >
            {/**/}
            <View style={styles.navltys}>
              <Image source={require('../../imgs/navxy.png')}/>
              <Text style={[styles.fSelf,styles.navltyszt]}>返回</Text>
            </View>

          </TouchableHighlight>
          <Text style={styles.fSelf}>
            发公告
          </Text>
          <TouchableHighlight
            onPress={()=>this.sendNoticeNextStep()}
            underlayColor="#d5d5d5"
          >
            <View style={styles.navltys}>
              <Text style={[styles.fSelf,styles.navltyszt]}>下一步</Text>
            </View>

          </TouchableHighlight>
        </View>
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
          <View style={[com.BCKFFF,com.PDT5,com.PDB15,com.PDL10,com.PDR10,com.MGT10,com.BTW,com.BBW,com.BCE6]}>
            <View style={[com.BCE6,com.PDB10]}>
              {/*TITLE*/}
              <TouchableHighlight
                  onPress={()=>this.openAffix()}
                  underlayColor="#d5d5d5"
                  >
                <View style={[com.ROW,com.JCSB,com.PDB10]}>
                  <View style={[com.ROW]}>
                    <Text>图片</Text>
                  </View>
                  <Image style={[com.wh16]} source={require('../../imgs/navxy2.png')}/>
                </View>
              </TouchableHighlight>
              {/*放置图片*/}
              <View style={[com.bgcff,com.aic,com.row,com.pdt10l15,com.flww,{}]}>
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
              {/* <View style={[com.ROW,com.PDB10,com.PDT10,com.AIC]}>
                <Image style={[sef.imgSelfTwo,com.MGR5,]}
                       source={require('../../imgs/project.png')}/>
                <Text style={[com.FS10]}>这个地方还有图片的右上角的删除按钮</Text>
                {this.state.path == ""?(null):(
                    <Image
                        style={[com.wh48,com.MGR5,]}
                        source={{uri: this.state.path}}
                        />
                )}
                {this.state.path == ""?(null):(
                      <Text onPress={()=>this.uploadImg()}>上传图片</Text>
                )}
              </View>*/}
            </View>
            { /*<View style={[com.PDT5]}>
              <View>
                <TouchableHighlight
                  onPress={()=>this.openAffix()}
                  underlayColor="#d5d5d5"
                >
                  <View style={[com.ROW,com.JCSB,com.MGB5]}>
                    <Text>附件</Text>
                    <Image style={[sef.imgRiCom,com.MGL5,com.wh16]} source={require('../../imgs/navxy2.png')}/>
                  </View>
                </TouchableHighlight>
              </View>
              <View style={[com.ROW,com.JCSB]}>
                <View style={[com.ROW,com.AIC]}>
                  <Image style={[sef.imgSelfTwo,com.MGR5,]}
                         source={require('../../imgs/project.png')}/>
                  <Text style={[com.CBE]}>000xxx000xxx.jpg</Text>
                </View>
                <View>
                  <Image style={[sef.imgSelfTwo,com.MGR5]}
                         source={require('../../imgs/project.png')}/>
                </View>
              </View>
            </View>*/}
          </View>
          {/*请输入公告内容*/}
          <View style={[{height:150},com.BCKFFF,com.MGT10,com.BTW,com.BCE6,com.PDT5,com.PDL10,com.PDR10,com.PDB10]}>
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
