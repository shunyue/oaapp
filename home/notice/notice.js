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
  ListView,
  AsyncStorage,
  DeviceEventEmitter,
} from 'react-native';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import com from '../../public/css/css-com';
import Loading from '../../common/loading';

export default class Notice extends Component {
  // 构造
    constructor(props) {
      super(props);
      this.state = {
        data:[],
        load:true,
        userName:""
      };

    }
  //耗时操作放在这里面
  componentDidMount(){
   this.getData();
   this.noticeListener= DeviceEventEmitter.addListener('updateNotice', (e)=> {
        this.setState({
              load: true
        });
       this.getData();
   });
  }
  componentWillUnmount() {
        // 移除监听
        this.noticeListener.remove();
  }
  //获取用户信息
  //数据加载的方法
  getData(){
   let  {params}=this.props.navigation.state;
    var url = config.api.base + config.api.getNotices;
    request.post(url, {
     id:params.user_id
    }).then((res) => {
    var data=res.data;
      this.setState({
          data:data.notice,
          userName:data.userName,
          load: false
      })
    })
    .catch((error)=> {
      toast.bottom('网络连接失败，请检查网络后重试');
    });
  }
  //返回到上一页面
  back() {
    this.props.navigation.goBack(null);
  }
  //新建公告页面
  sendNotice() {
    let {params}=this.props.navigation.state;
    this.props.navigation.navigate('SendNotice',{
        user_id:params.user_id,
        company_id:params.company_id,
        userName:this.state.userName})
  }
  //公告详情页面
  noticeDetail(id){
    let {params}=this.props.navigation.state;
    this.props.navigation.navigate('NoticeDetail',
        {noticeId:id,
         user_id:params.user_id,
         company_id:params.company_id,
        userName:this.state.userName})
  }
  render() {
    //加载过程
     if(this.state.load) {
      return (
           <Loading/>
        )
    }
      //加载完成
   var data = this.state.data;
   var list =[];
    //没有查到数据
    if(data.length == 0){
        list.push(  <View style={[com.jcc,com.aic,com.bgce6]} key={0}>
            <View style={[com.jcc,com.aic,com.bgce6]}>
                <Image style={[com.wh64]} source={require('../../imgs/noContent.png')}/>
                <Text>暂无公告</Text>
            </View>
        </View>)
    }else{
        for(var i in data) {
            var picArr=[];
            if(data[i].pic!="" && data[i].pic!=null){
                var  picPath=data[i].pic.split(",");
                picArr.push(
                    <View key={i}>
                        <Image style={[sef.rowCom]} source={{uri:picPath[0]}}/>
                    </View>
                )
            }else{
                picArr.push(
                    <View key={0}>
                        <Image style={[sef.imgCom]} source={require('../../imgs/notice/gg48.png')}/>
                    </View>
                )
            }
            list.push(
                <View style={[styles.common,com.pdt10,com.pdb10,com.bbwc]} key={i}>
                    <TouchableHighlight
                        onPress={this.noticeDetail.bind(this,data[i].id)}
                        underlayColor="#d5d5d5"
                        >
                        <View style={[com.ROW]}>
                            <View style={[sef.rowCom,com.AIC,com.JCC,com.MGR10]}>
                                {picArr}
                            </View>
                            <View style={[com.jcsb,com.pdtd5]}>
                                <Text>{data[i].title}</Text>
                                <Text style={[sef.txtCom,sef.txtSelf]}> {data[i].datetime}</Text>
                                {/* <Text style={[sef.txtCom,sef.txtSelfTwo]}>全部已读</Text>*/}
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>
            )}
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
          <Text style={styles.fSelf}>公告</Text>
          <TouchableHighlight
            onPress={()=>this.sendNotice()}
            underlayColor="#d5d5d5"
          >
            <View style={styles.navltys}>
              <Text style={[styles.fSelf,styles.navltyszt]}>发公告</Text>
            </View>
          </TouchableHighlight>
        </View>
        {/*内容主题*/}
        <ScrollView style={styles.childContent}>
          <View>
          {list}
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
//主题内容
  childContent: {//子容器页面级
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#fff',
  },
//公共行级元素
  common: {
    flex: 1,
  }
});
const sef = StyleSheet.create({
  rowCom: {
    backgroundColor: '#DEDEDE',
    width: 60,
    height: 60
  },
  imgCom: {
    width: 32,
    height: 32,
  },
  txtCom: {
    fontSize: 12,
  },
  txtSelf: {
    color: '#dedede'
  },
  txtSelfTwo: {
    color: '#aeaeae'
  }
});
