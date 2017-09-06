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
  AsyncStorage,
  DeviceEventEmitter,
} from 'react-native';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import com from '../../public/css/css-com';
import Loading from '../../common/loading';

export default class NoticePreview extends Component {
     back() {
        this.props.navigation.goBack(null);
     }
    constructor(props) {
     super(props);
      // 初始状态
     this.state = {
       value: false,
       text:"",
       username:'',
       id:'',
       pic:'',
     //  load:true
      };
    }
  //提交公告的方法
  newNotice(){
    let {params} = this.props.navigation.state;
    var url = config.api.base + config.api.newNotice;
    request.post(url, {
      title: params.notice.title,
      content:params.notice.content,
      pic:params.notice.pic,
      appendix:params.notice.appendix,
      datetime:params.notice.datetime,
      publisher:params.user_id,
      accepter:params.notice.accepter,
    }).then((res) => {
      if (res.status == 1) {
        toast.center(res.message);
        DeviceEventEmitter.emit('updateNotice',1); //发监听
        this.props.navigation.goBack('SendNotice');
      }else{
        return  toast.center(res.message);
      }
    })
        .catch((error)=> {
          toast.bottom('网络连接失败，请检查网络后重试');
        });
  }

  render() {
    let {params} = this.props.navigation.state;
    //如果有公告照片
    if(params.notice.pic!=""||params.notice.pic!=null){
      picPath=params.notice.pic.split(",");
      var picArr=[];
      for (var i = 0; i <picPath.length; i++) {
        picArr.push(
            <View  key={i}>
              <Image style={[com.wh64,com.mg5]} source={{uri:picPath[i]}}/>
            </View>
        );
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
            预览公告
          </Text>
          <TouchableHighlight
            onPress={()=>this.newNotice()}
            underlayColor="#d5d5d5"
          >
            <View style={styles.navltys}>
              <Text style={[styles.fSelf,styles.navltyszt]}>发布</Text>
            </View>
          </TouchableHighlight>
        </View>
        {/*内容主题*/}
        <ScrollView style={[com.FLEX,com.BCKFFF,com.pdt5l10]}>
          {/*基本信息*/}
          <View style={[com.PDT10,com.PDB10,com.BBW,com.BCE6]}>
            <Text style={[]}>{params.notice.title}</Text>
            <Text style={[com.PDB10,com.CBE,com.FS12]}>
              <Text>{params.userName} &nbsp;&nbsp;</Text>

              <Text>{params.notice.datetime}</Text>
            </Text>
            <Text style={[]}>
              {params.notice.content}
            </Text>

          </View>
          {/*图片*/}
          {params.notice.pic == ""?(null):(
          <View style={[com.pdtb5]}>
            <Text style={[com.cbe,com.fs12]}>图片</Text>
              <View style={[com.row]}>
                {picArr}
              </View>
            </View>
          )}
          {/*附件*/}
          {params.notice.appendix == ""?(null):(
          <View style={[com.PDT5]}>
            <View style={[com.PDB5]}>
              <Text>附件</Text>
            </View>
            <View style={[com.ROW,com.AIC]}>
              <Image style={[sef.imgSelfTwo,com.MGR5,]}
                     source={require('../../imgs/project.png')}/>
              <Text style={[com.CBE]}>000xxx000xxx.jpg</Text>
            </View>
          </View>
          )}
        </ScrollView>
      </View>
    )
      ;
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
//主题内容
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
  imgRiCom: {
    width: 14,
    height: 14,
  },
  imgSelfOne: {
    width: 100,
    height: 100,
  },
  imgSelfTwo: {
    width: 30,
    height: 30,
  },
});
