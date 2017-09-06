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
    DeviceEventEmitter,
    } from 'react-native';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import com from '../../public/css/css-com';
import Modal from 'react-native-modal';
import wds from '../../public/css/css-window-single';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import Loading from '../../common/loading';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
export default class Log extends Component {
    back() {
    //准备一个值
        DeviceEventEmitter.emit('backData',this.state.backData); //发监听
        this.props.navigation.goBack(null);
    }
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            show: false,
            wos: false,
            showreview:false,
            load:false,
            xianshi:false,
            content:" ",
            reviewLen:'',
            imgArr: [],
            picArr:[],
            id:1,
            backData:[],
            review:[],
            log:[],
            image:""
        };
    }
    //耗时操作放在这里面
    componentDidMount(){
        this.onelogDetail();
    }
    //查询日志详情
    onelogDetail(){
        let {params} = this.props.navigation.state;
        let key = params.log.key;
        let data=params.log.logdata;
        this.setState({
               load: true,
               log:data[key],
               review:data[key].review,
               reviewLen:data[key].reviewLen,
               key:key
            });
    }
    //查询评论内容
    //上一封
    getPreviewLog(){
        let {params} = this.props.navigation.state;
        let data=params.log.logdata;
       if(this.state.key==0){
           this.setState({
               load: true,
           });
           toast.bottom('已经是第一封');
           return false;
       }
        var i=this.state.key-1;
        this.setState({
            load: true,
            log:data[i],
            key:i,
            review:data[i].review,
            reviewLen:data[i].reviewLen,
        });
    }
    //下一封
    getNextLog(key){
        this.setState({
            load: false
        });
        let {params} = this.props.navigation.state;
        let data=params.log.logdata;
        let max=data.length-1;
        if(this.state.key==max){
            this.setState({
                load: true,
            });
            toast.bottom('已经是最后一封');
            return false;
        }
        let i=key -(-1) ;
        this.setState({
            load: true,
            log:data[i],
            key:i,
            reviewLen:data[i].reviewLen,
            review:data[i].review,
        });
    }
    //上传图片
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
                        image:res.data
                    })
                }else{
                    toast.bottom('提交数据失败,请重试');
                }
            })
            .catch((error)=>{
                toast.bottom('网络连接失败，请检查网络后重试');
            });
    }
    //发送评论内容
    sendReview(){
        if(this.state.content==""||this.state.content==null){
            alert('请输入评论内容') ;
            return false;
        }
        let images= this.state.imgArr;
        for(var i = 0;i<images.length;i++){
            if(images[i].visible==null && this.state.image==""){//如果选择了图片而且没有上传到服务器
                alert('请先上传图片!');
                return false;
            }
        }
        var url=config.api.base+config.api.sendLogReview;
        let {params} = this.props.navigation.state;
        let data=params.log.logdata;
        var key=this.state.key
        var log_id=data[key].id;
        request.post(url,{
            log_id:log_id,
            employee_id:params.user_id,//人员的id,从其他地方获取
            image:this.state.image,
            content:this.state.content,
            datetime: moment(new Date()).format('YYYY-MM-DD HH:mm')
        }).then((res)=>{
            ///重新获取评论内容
            if(res.status==1){
                toast.center(res.message);
                this.setState({
                    wos:!this.state.wos,
                    reviewLen:res.data.length,
                    review:res.data.review,
                    content:"",
                    imgArr: [],
                    image:""
                });
                //将要改变的评论放到数组中
             this.state.backData.push(
                {key: key,reviewLen:res.data.length, review:res.data.review}
            );
            }else{
                toast.bottom(res.message);
            }
        })
        .catch((error)=>{
            toast.bottom('网络连接失败,请检查网络后重试')
         });
    }
    getReview(){
        this.setState({
            load: true
        });
        let {params} = this.props.navigation.state;
        let data=params.log.logdata;
        var key=this.state.key;
        var log_id=data[key].id;
        var url=config.api.base+config.api.getLogReview;
        request.post(url, {
            log_id:log_id
        }).then((res) => {
            this.setState({
                reviewLen:res.data.length,
                review:res.data.review,
                load: false
            })
        })
            .catch((error)=> {
                toast.bottom('网络连接失败，请检查网络后重试');
            });
    }
    setVisibleModal(visible) {
        this.setState({show: visible,xianshi:visible});
    }
    setWosModal(visible) {
        this.setState({wos: visible});
    }
    state = {
        isModalVisible: false
    }
    _showModal = () => this.setState({isModalVisible: true});
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
    openFloder() {
        //alert('这是打开文件夹')
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
          //  console.log(image.path);
            //alert(this.state.id)
            this.state.imgArr.push({id: this.state.id, visible: null, path: image.path});
            this.setState({//放到这里只是为了渲染页面
                id: this.state.id + 1
            })
        });
    }
    goPage_Share(){
        alert('分享页面');
    }
    render() {
        //加载过程
        if(!this.state.load) {
            return (
                <Loading/>
            )
        }
        //如果有日志照片
        if(this.state.log.picLen!= 0){
          let logImages=this.state.log.picArr;
          var picArr=[];
          for (var i = 0; i <logImages.length; i++) {
              picArr.push(
                  <View  key={i}>
                      <Image style={[com.wh64,com.mg5]} source={{uri:logImages[i]}}/>
                  </View>
              );
          }
        }
        //选择图片
        let imgArr = this.state.imgArr;
        var imagelist = [];
        for (var i = 0; i < imgArr.length; i++) {
            if (imgArr[i].visible == null) {
                imagelist.push(
                    <View key={i}>
                        <View style={[com.pos]}>
                            <Image source={{uri: imgArr[i].path}} style={[com.MG5,com.wh64,com.pos]}/>
                            <TouchableHighlight
                                style={[com.MG5,com.posr,{top:-3,right:0}]}
                                onPress={this.goonDel.bind(this,imgArr[i].id)}
                                underlayColor="#f5f5f5"
                                >
                                <Image source={require('../../imgs/del162.png')} style={[com.wh16,]}/>
                            </TouchableHighlight>
                        </View>
                    </View>
                )
            }
        }
        var list =[];
        var review = this.state.review;
        if(review.length==0){
         list.push(
             <View style={[com.row,com.aic,com.pdt5l15,com.h100]}  key={0}>
                 <Text style={[com.fs12,com.cbe]}>暂无评论</Text>
            </View>
         )
        }else{
            for(var i = 0; i < review.length; i++) {
               // alert(JSON.stringify(review[i].imgArr))
                var  reviewPic=review[i].imgArr;
                var reviewPiclist = [];
                if(reviewPic.length!=0){//如果有评论图片
                    for(var j=0;j<reviewPic.length; j++){
                    reviewPiclist.push(
                         <View  key={j}>
                             <Image style={[com.wh64,com.mg5]} source={{uri:reviewPic[j]}}/>
                         </View>
                    );
                   }
                }
                list.push(
                    <View style={[com.row,com.mgt5,com.pdt5l15]}  key={i}>
                        {(this.state.log.avatar==""||this.state.log.avatar==null)?(
                            <Image style={[com.tcp,com.wh32,com.br200]} source={require('../../imgs/tx.png')}/>
                        ):(<Image style={[com.wh32,com.br200]} source={{uri:review[i].reviewavatar}}/>)}
                        <View style={[com.mgl15,com.flex,com.bbwc,com.mgb5]}>
                            <View style={[com.row,com.jcsb,com.mgb5]}>
                                <Text style={[com.cbe]}>{review[i].reviewName}</Text>
                                <Text style={[com.fs12,com.cbe]}>{review[i].datetime}</Text>
                            </View>

                            <View style={[com.mgb10]}>
                                <Text>{review[i].content}</Text>
                            </View>
                            {review[i].imgArr==null?(null):(
                                <View style={[com.row]}>
                                    {reviewPiclist}
                                </View>
                            )}
                    </View>
                    </View>
                )
            }
        }
        if (this.state.log.log_type == 1) {
            var logname = '日报';
        } else if (this.state.log.log_type == 2) {
            var logname = '周报';
        } else if (this.state.log.log_type == 3) {
            var logname = '月报';
        }

        return (
            <View style={styles.ancestorCon}>

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
                    <Text style={styles.fSelf}>{logname}</Text>
                    {/*  <TouchableHighlight
                        style={styles.navltys}
                        onPress={()=>this.logTody()}
                        underlayColor="#f5f5f5"
                        >
                        <View style={[com.jcc,styles.navltys]}>
                            <Text style={[styles.fSelf,styles.navltyszt]}>部门</Text>
                        </View>
                    </TouchableHighlight>*/}
                    <TouchableOpacity onPress={() => {this.setState({show: !this.state.show})}}>
                        <Image source={require('../../imgs/slh.png')}/>
                    </TouchableOpacity>

                </View>

                <ScrollView style={[]}>
                    {/*个人信息*/}
                    <View style={[com.mixf,com.mgtb5]}>
                        <View >
                            {(this.state.log.avatar==""||this.state.log.avatar==null)?(
                                <Image style={[com.tcp,com.wh32,com.br200]} source={require('../../imgs/tx.png')}/>
                            ):(<Image style={[com.wh32,com.br200]} source={{uri:this.state.log.avatar}}/>)}
                        </View>
                        <View style={[com.mgl5]}>
                            <Text>{this.state.log.employeeName}</Text>
                            <Text style={[com.fs12,com.cbe]}>{this.state.log.datetime}</Text>
                        </View>
                    </View>
                    {/*详情*/}
                    <View style={[com.bgcfff,com.btbwc,com.pdl15,com.pdb5]}>
                       {this.state.log.day_finish == "" ||this.state.log.day_finish == null ?(null):(
                            <View style={[com.pdtb5,com.bbwc]}>
                                <Text style={[com.cbe,com.fs12]}>今日完成工作</Text>
                                <Text>{this.state.log.day_finish}</Text>
                            </View>
                        )}
                        {this.state.log.week_finish == "" ||this.state.log.week_finish == null ?(null):(
                            <View style={[com.pdtb5,com.bbwc]}>
                                <Text style={[com.cbe,com.fs12]}>本周完成工作</Text>
                                <Text>{this.state.log.week_finish}</Text>
                            </View>
                        )}
                        {this.state.log.month_finish == "" ||this.state.log.month_finish == null ?(null):(
                            <View style={[com.pdtb5,com.bbwc]}>
                                <Text style={[com.cbe,com.fs12]}>本月完成工作</Text>
                                <Text>{this.state.log.month_finish}</Text>
                            </View>
                        )}
                        {this.state.log.unfinish == "" ||this.state.log.unfinish == null ?(null):(
                            <View style={[com.pdtb5,com.bbwc]}>
                                <Text style={[com.cbe,com.fs12]}>未完成工作</Text>
                                <Text>{this.state.log.unfinish}</Text>
                            </View>
                        )}
                        {this.state.log.summary == "" ||this.state.log.summary == null ?(null):(
                            <View style={[com.pdtb5,com.bbwc]}>
                                <Text style={[com.cbe,com.fs12]}>工作总结</Text>
                                <Text>{this.state.log.summary}</Text>
                            </View>
                        )}
                        {this.state.log.weekplan == "" ||this.state.log.weekplan == null ?(null):(
                            <View style={[com.pdtb5,com.bbwc]}>
                                <Text style={[com.cbe,com.fs12]}>下周工作计划</Text>
                                <Text>{this.state.log.weekplan}</Text>
                            </View>
                        )}
                        {this.state.log.monthplan == "" ||this.state.log.monthplan == null ?(null):(
                            <View style={[com.pdtb5,com.bbwc]}>
                                <Text style={[com.cbe,com.fs12]}>下月工作计划</Text>
                                <Text>{this.state.log.monthplan}</Text>
                            </View>
                        )}
                        {this.state.log.coordinate == "" ||this.state.log.coordinate == null ?(null):(
                            <View style={[com.pdtb5,com.bbwc]}>
                                <Text style={[com.cbe,com.fs12]}>需协调工作</Text>
                                <Text>{this.state.log.coordinate}</Text>
                            </View>
                        )}
                        {this.state.log.explain == "" ||this.state.log.explain == null ?(null):(
                            <View style={[com.pdtb5,com.bbwc]}>
                                <Text style={[com.cbe,com.fs12]}>备注</Text>
                                <Text>{this.state.log.explain}</Text>
                            </View>
                        )}
                        {this.state.log.pic == "" ||this.state.log.pic == null ?(null):(
                            <View style={[com.pdtb5]}>
                                <Text style={[com.cbe,com.fs12]}>照片</Text>
                                <View style={[com.row]}>
                                {picArr}
                                </View>
                            </View>
                        )}
                    </View>
                    {/*共评论*/}
                    <View style={[com.bgcff,com.mgt5,com.btbwc]}>
                        <View style={[com.row,com.bbwc,com.jcsb,com.aic,com.pdt5l15]}>
                            <Text>共评论({this.state.reviewLen})</Text>
                            <TouchableOpacity onPress={() => {{this.setState({wos: !this.state.wos})}}}>
                                <Image style={[com.tcr,com.wh16]} source={require('../../imgs/chatres.png')}/>
                            </TouchableOpacity>
                        </View>
                        {list}
                        {/* <View style={[com.row,com.aic,com.pdt5l15,com.h100]}>
                            <Text style={[com.fs12,com.cbe]}>暂无评论</Text>

                        </View>*/}
                    </View>
                </ScrollView>
                {/*底部通栏*/}
                <View style={[com.row,com.bgcfff,com.jcsa,com.btwc]}>
                    <TouchableHighlight
                        style={styles.navltys}
                        onPress={()=>{this.setState({load:false});this.getPreviewLog()}}
                        underlayColor="#f5f5f5"
                        >
                        <View style={[com.pdt15,com.bckfff,com.btwc,com.pdb5,com.aic,com.jcc]}>
                            <Image style={[com.wh16,com.mgr5]} source={require('../../imgs/downdirect.png')}/>
                            <Text style={[com.cr]}>上一封</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.navltys}
                        onPress={this.getNextLog.bind(this,this.state.key)}
                        underlayColor="#f5f5f5"
                        >
                        <View style={[com.pdt15,com.bckfff,com.btwc,com.pdb5,com.aic,com.jcc]}>
                            <Image style={[com.wh16,com.mgr5,com.tcr]} source={require('../../imgs/updirect.png')}/>
                            <Text style={[com.cr]}>下一封</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                {/* 添加模型 */}
                <View>
                    <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.show}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                        >
                        <View style={{width:screenW,height:screenH,backgroundColor:'#555',opacity:0.6}}>
                            <TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {
  this.setVisibleModal(!this.state.show)
}}></TouchableOpacity>
                        </View>
                        <View style={[com.row,com.bcke6,com.brtlr5,wds.pos]}>
                            <View style={[com.aic,com.bbwc,com.ww]}>
                                <TouchableOpacity style={[com.pdtb5,]}
                                                  onPress={() => { this.setVisibleModal(!this.state.show);this.goPage_Share()}}>
                                    <Text style={{color:'#333'}}>分享</Text>
                                </TouchableOpacity>


                                <TouchableOpacity style={[com.aic,com.pdtb5]} onPress={() => { this.setVisibleModal(!this.state.show)}}>
                                    <Text style={{color:'#555'}}>取消</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
                {/* 添加模型 */}
            <View>
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.wos}
                    onRequestClose={() => {this.setState({wos: !this.state.wos});}}
                    >
                    <View style={{width:screenW,height:screenH,backgroundColor:'#555',opacity:0}}>
                        <TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {
  this.setState({wos: this.state.wos});
}}></TouchableOpacity>
                    </View>
                    <View style={[com.bgcfff,com.brtlr5,wds.pos,com.pdt5,com.pdl5,com.pdb5,{left:0,bottom:0},com.ww]}>
                        <View style={[com.row,com.aic,]}>
                            <TouchableOpacity style={[com.pdt5l10,]}
                                              onPress={() => {this.openFloder()}}>
                                <Image style={[com.tcr,com.wh32,com.tcccc]} source={require('../../imgs/tpslt.png')}/>
                            </TouchableOpacity>
                            <View style={[com.bwc9,com.br]}>
                                <TextInput
                                    style={[{width:screenW*0.6},com.h30,com.pd5,com.bwc]}
                                    underlineColorAndroid='transparent'
                                    numberOfLines={1}
                                    autoFocus={true}
                                    multiline={false}
                                    textAlignVertical="top"
                                    placeholder='请输入文本'
                                    placeholderTextColor='#abc'
                                    secureTextEntry={false}
                                    onChangeText={(content) => this.setState({content})}
                                    />
                            </View>

                            {/*   <TouchableOpacity style={[com.pdtb5,]}
                                              onPress={() => { this.openLg()}}>
                                <Image style={[com.tcr,com.wh32,com.tcccc]} source={require('../../imgs/lg.png')}/>
                            </TouchableOpacity>*/}

                            <Text style={[com.bgcr,com.cff,com.pd5,com.br,com.pdlr10,com.mgt5l10]} onPress={()=>{this.sendReview();}}>发送</Text>
                        </View>
                        <View style={[com.row,com.ww,com.flww,com.pdl5,com.aic]}>
                            {imagelist}
                            {imagelist.length==0?(null):(
                            <TouchableHighlight
                                onPress={()=>this.uploadImg()}
                                underlayColor="#d5d5d5"
                                >
                                <View style={[com.jcc,com.aic,com.h30,]}>
                                    <Text style={[com.bwr,com.bgcfff,com.br5,com.pd5,com.cr]}>上传图片</Text>
                                </View>
                            </TouchableHighlight>)}
                        </View>

                    </View>
                </Modal>
            </View>
                {/*分享页面*/}
                <View>
                    <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.show}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                        >
                        <View style={{width:screenW,height:screenH,backgroundColor:'#555',opacity:0.6}}>
                            <TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {
                                this.setState({show: !this.state.show});
                              }}></TouchableOpacity>
                        </View>
                        <View style={[com.row,com.bcke6,com.brtlr5,wds.pos]}>
                            <View style={[com.aic,com.bbwc,com.ww]}>
                                <TouchableOpacity style={[com.pdtb10,]}
                                                  onPress={() => { this.setState({show:!this.state.show});this.goPage_Share()}}>
                                    <Text style={{color:'#333'}}>分享</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[com.aic,com.pdtb10]} onPress={() => {this.setState({show: !this.state.show})}}>
                                    <Text style={{color:'#555'}}>取消</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>

            </View>
        );
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
