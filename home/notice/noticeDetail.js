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
//弹出窗口必用-s
  Dimensions,
  Modal,
  TouchableOpacity,
  DeviceEventEmitter,
//弹出窗口必用-e
} from 'react-native';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import wds from '../../public/css/css-window-single';
import com from '../../public/css/css-com';
import request from '../../common/request';
import toast from '../../common/toast';
import Loading from '../../common/loading';
import config from '../../common/config';
export default class NoticeDetail extends Component {
  back() {
    this.props.navigation.goBack(null);
  }

  //控制层
  setVisibleModal(visible) {
    this.setState({show: visible});
  }

  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      show: false,
      value: false,
      load:true,
      notice:[]
    };
  }
  //耗时操作放在这里面
  componentDidMount(){
    this.noticeDetail();
  }
  //查询公告详情
noticeDetail(){
  let {params} = this.props.navigation.state;
  var url = config.api.base + config.api.oneNoticeDetail;
  request.post(url, {
    id:params.noticeId
  }).then((res) => {
    var data=res.data;
    this.setState({
      notice:data.notice,
      publisherName:data.publisherName,
      load: false
    });
  })
    .catch((error)=> {
        toast.bottom('网络连接失败，请检查网络后重试');
   });

}
  goPage_share() {
    this.props.navigation.navigate('Share');
  }
  noticeCancel(id){
    let {params}=this.props.navigation.state;
    var url = config.api.base + config.api.cancelNotice;
    request.post(url, {
      id:id
    }).then((res) => {
     if(res.status==1){
       toast.center(res.message);
       DeviceEventEmitter.emit('updateNotice',1); //发监听
       this.props.navigation.goBack(null);
     }else{
       return toast.bottom(res.message);
     }
    })
        .catch((error)=> {
          toast.bottom('网络连接失败，请检查网络后重试');
        });

  }
  render() {
  //加载过程
    if(this.state.load) {
        return (
            <Loading/>
        )
      }
 //如果有公告照片
    var picArr=[];
    if(this.state.notice.pic!="" && this.state.notice.pic!=null){
      var picPath=this.state.notice.pic.split(",");
      for (var i = 0; i <picPath.length; i++) {
        picArr.push(
            <View  key={i}>
              <Image style={[com.wh64,com.mg5]} source={{uri:picPath[i]}}/>
            </View>
        );
      }
    }else{
      picArr.push(
          <View  key={0}>
           <Text>无图片</Text>
          </View>
      );
    }
    return (
      <View style={styles.ancestorCon}>
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
          <Text style={styles.fSelf}>公告详情</Text>
          <TouchableOpacity style={wds.icon_touch2} onPress={() => {{this.setState({show: !this.state.show})}}}>
            <View style={styles.navltys}>
              <Image style={[styles.navltysImg]} source={require('../../imgs/product/slh32.png')}/>
            </View>
          </TouchableOpacity>
        </View>
        {/*内容主题*/}
        <ScrollView style={[com.PD10,com.FLEX,com.BCKF5]}>
          <View style={[com.PDT10,com.PDB10,com.BBW,com.BCE6]}>
            <Text style={[com.pdb5]}>{this.state.notice.title}</Text>
            <Text style={[com.PDB10,com.CBE,com.FS12,com.pdb10]}>
              <Text>{this.state.publisherName}&nbsp;&nbsp;&nbsp;&nbsp;</Text>
              <Text>{this.state.notice.datetime}</Text>
            </Text>
            { /*  <Text style={[{color:'#e4393c'},com.fs10,com.pdb5]}>全部已读</Text>*/}
            <Text style={[]}>
              {this.state.notice.content}
            </Text>

          </View>
          {/*图片*/}
          {this.state.notice.pic == ""?(  <View style={[com.pdtb5]}>
            <View style={[com.row]}>{picArr}</View></View>):(
              <View style={[com.pdtb5]}>
                <Text style={[com.cbe,com.fs12]}>图片</Text>
                <View style={[com.row]}>
                  {picArr}
                </View>
              </View>
          )}

          {/*附件*/}
          {this.state.notice.appendix == ""?(null):(
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

        {/* 添加模型 */}
        <View>
          <Modal
            animationType={"fade"}
            transparent={true}
            visible={this.state.show}
            onRequestClose={() => {alert("Modal has been closed.")}}
          >
            <View style={[{width:screenW,height:screenH*0.70,backgroundColor:'#555',opacity:0.6},]}>
              <TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {
  this.setVisibleModal(!this.state.show)
}}></TouchableOpacity>
            </View>
            <View style={[wds.addCustomer,com.ROW,com.JCC,com.aic]}>
              <View style={[wds.addCustomer_card]}>
                  <View style={[{width:screenW},com.pdt8,com.pdb8,com.bbwc,com.aic]}>
                    <Text style={[com.fs10]}>撤回将会从所有接收人的公告列表中删除此公告</Text>
                  </View>

                <TouchableOpacity style={[com.jcc,com.aic,com.bbwc,com.pdt10,com.pdb10]}
               onPress={() =>{this.setVisibleModal(!this.state.show);this.noticeCancel(this.state.notice.id
                      )}}>
                  <Text style={{color:'#333'}}>撤回</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[com.jcc,com.aic,com.bbwc,com.pdt10,com.pdb10]}
                                  onPress={() => { this.setVisibleModal(!this.state.show);this.goPage_share()}}>
                  <Text style={{color:'#333'}}>分享</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[com.jcc,com.aic,com.pdt5,com.pdb5]}
                                  onPress={() => { this.setVisibleModal(!this.state.show)}}>
                  <Text style={{color:'#555'}}>取消</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
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
  imgSelfOne: {
    width: 100,
    height: 100,
  },
  imgSelfTwo: {
    width: 30,
    height: 30,
  },
});
