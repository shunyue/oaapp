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
    CheckBox,
    DeviceEventEmitter,
    Alert
    } from 'react-native';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import com from '../public/css/css-com';
import Modal from 'react-native-modal';
import wds from '../public/css/css-window-single';
import ImagePicker from 'react-native-image-crop-picker';
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';
import Loading from '../common/loading';
import moment from 'moment';
export default class DailyDetail extends Component {
    constructor(props) {
        super(props);
        let {params}=this.props.navigation.state
        this.state = {
            imgArr: [],
            image:'',
            isModalVisible: false,
            show: false,
            input: '',
            wos: false,
            id: 1,
            content:'',
            reviewLen:0,
            reportLen:0,
            picArr:[],
            review:[],
            status:params.dailyInfo.status,
            report:[],
            datetime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            dailyInfo:params.dailyInfo
        };
    }
    componentDidMount() {
        this.getDailyDetail();
        //选择员工
        this.reportListener= DeviceEventEmitter.addListener('Report', (a)=> {
            var  dailyInfo=this.state.dailyInfo;
            dailyInfo.status=a.status;
            this.setState({
                dailyInfo:dailyInfo,
                report:a.reportInfo
            })
        });
        this.dailyListener= DeviceEventEmitter.addListener('Daily', (c)=> {
            if(c!=null && c.length!=0){
                this.setState({
                    dailyInfo:c
                })
            }
        });
    }
    getDailyDetail(){
        let {params}=this.props.navigation.state;
        var url=config.api.base+config.api.getDailyDetailById;
        request.post(url,{
            daily_id:params.dailyInfo.id
        }).then((res)=>{
            var data=res.data;
            this.setState({
                reviewLen:data.reviewLen,
                reportLen:data.reportLen,
                review:data.review,
                report:data.report
            })
        })
            .catch((error)=>{
                toast.bottom('网络连接失败,请检查网络后重试')
            });
    }
    componentWillUnmount() {
        // 移除监听
        this.reportListener.remove();
        this.dailyListener.remove();
    }
    //返回到上一页面
    back() {
        let {params}=this.props.navigation.state;
        DeviceEventEmitter.emit('dailyInfo'); //发监听
        this.props.navigation.goBack(null);
    }
    //跳转到客户详情页面
    goPageCusDetail(id,company_id){
        alert('跳转到客户详情页面');
        //this.props.navigation.navigate('CustomerDetail',{user_id:id,comapny_id:company_id})
    }
    //跳转到日程执行人页面
    goDetailExecutor(creater,executor){
        this.props.navigation.navigate('DailyExecutor',{creater:creater,executor:executor});
    }
    //跳转到日程客户页面
    goDetailCustomer(customer){
        this.props.navigation.navigate('DailyCustomer',{customer:customer});
    }
    //跳转到日程报告页面
    goPage_addDailyReport(){
        let {params}=this.props.navigation.state;
        this.props.navigation.navigate('DailyReport',{
            user_id:params.user_id,
            company_id:params.company_id,
            daily_id:params.dailyInfo.id,
            title:params.dailyInfo.title,
            daily_type:params.dailyInfo.daily_type,
            typeName:params.dailyInfo.typeName,
            status:params.dailyInfo.status
        });
    }
    //跳转到定位页面
    goPage_VisitPosition(){
        alert('跳转到原生Android定位页面');
    }
    //跳转到分享页面
    goPage_Share(){
        alert('跳转到分享页面')
    }
    //跳转到编辑日程界面
    goPage_Edit(){
        let {params}=this.props.navigation.state;
        var daily_type=params.dailyInfo.daily_type;
        if(daily_type==1){
            var title='EditVisit';
        }else if(daily_type==2){
            var title='EditWork';
        }else if(daily_type==3){
            var title='EditMeeting';
        }else  if(daily_type==4){
            var title='EditTrain';
        }
        this.props.navigation.navigate(title,{
            user_id:params.user_id,
            company_id:params.company_id,
            dailyInfo:this.state.dailyInfo
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
        if(this.state.content==""){
            //toast.bottom('请输入评论内容') ;
            //return false;
            alert('请输入评论内容');
            return false;
        }
        let images= this.state.imgArr;
        for(var i = 0;i<images.length;i++){
            if(images[i].visible==null && this.state.image==""){//如果选择了图片而且没有上传到服务器
                alert('请先上传图片!');
                return false;
            }
        }
        var url=config.api.base+config.api.sendDailyReview;
        let {params} = this.props.navigation.state;
        let daily_id=params.dailyInfo.id;
        request.post(url,{
            daily_id:daily_id,
            user_id:params.user_id,//人员的id,从其他地方获取
            company_id:params.company_id,
            image:this.state.image,
            content:this.state.content,
            datetime:this.state.datetime
        }).then((res)=>{
            ///重新获取评论内容
            if(res.status==1){
                toast.center(res.message);
                this.setState({
                    wos:!this.state.wos,
                    reviewLen:res.data.length,
                    review:res.data.review,
                    imgArr:[],
                    image:''
                });
            }else{
                toast.bottom(res.message);
            }
        })
            .catch((error)=>{
                toast.bottom('网络连接失败,请检查网络后重试')
            });
    }
    goonDel(id) {
        var imgArr = this.state.imgArr;
        var op = [];
        //console.log('id+ ' + id)
        //console.log(imgArr)
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
        this.setState({
            emoji: false
        })
        //alert('这是打开文件夹')
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image.path);
            //alert(this.state.id)
            this.state.imgArr.push({id: this.state.id, visible: null, path: image.path});
            this.setState({//放到这里只是为了渲染页面
                id: this.state.id + 1
            })
        });
    }
    openLg() {
        this.setState({
            emoji: true,
            imgArr:[],
            op:[],
        })
    }

    //点击改变日程状态
    changeDailyStatus(){
        let {params} =this.props.navigation.state;
        if(this.state.status==3 && this.state.reportLen==0){//已经结束(切换为原来的状态)
            //查看是否有工作进展(没有则为1)
            var status=1;
        }else if(this.state.status==3 && this.state.reportLen>0){//已经结束(切换为原来的状态)
            //查看是否有工作进展(有的话status=2)
            var status=2;
        }else{
            var status=3;
        }
        //去数据库修改日程的状态
        var url=config.api.base+config.api.editDailyStatus;
        let daily_id=params.dailyInfo.id;
        request.post(url,{
            daily_id:daily_id,
            status:status
        }).then((res)=>{
            ///重新获取评论内容
            if(res.status==1){
                this.setState({
                    status:status
                })
            }else{
                toast.bottom(res.message);
            }
        })
            .catch((error)=>{
                toast.bottom('网络连接失败,请检查网络后重试')
            });
    }
    //显示底部标题
    showReport(){
        let  {params}=this.props.navigation.state;
        var status=this.state.status;
        var daily_type=params.dailyInfo.daily_type;
        if((daily_type==1) && (status==1)){
            return(
                <TouchableHighlight
                    onPress={()=>{this.goPage_addDailyReport()}}
                    underlayColor="#fff"
                    >
                    <View style={[com.aic,com.bgcfff,com.pd10,com.btweb]}>
                        <Text style={[com.cr]}>开始拜访</Text>
                    </View>
                </TouchableHighlight>
            )
        }else if((daily_type==1) && (status==2)){
            return(
                <TouchableHighlight
                    onPress={()=>{this.goPage_addDailyReport()}}
                    underlayColor="#fff"
                    >
                    <View style={[com.aic,com.bgcfff,com.pd10,com.btweb]}>
                        <Text style={[com.cr]}>完善拜访记录</Text>
                    </View>
                </TouchableHighlight>
            )
        }else if((daily_type==2 || daily_type==3 ||  daily_type==4) && (status==1)){
            return(
                <TouchableHighlight
                    onPress={()=>{this.goPage_addDailyReport()}}
                    underlayColor="#fff"
                    >
                    <View style={[com.aic,com.bgcfff,com.pd10,com.btweb]}>
                        <Text style={[com.cr]}>开始工作</Text>
                    </View>
                </TouchableHighlight>
            )
        }else if((daily_type==2 || daily_type==3 || daily_type==4) && (status==2)){
            return(
                <TouchableHighlight
                    onPress={()=>{this.goPage_addDailyReport()}}
                    underlayColor="#fff"
                    >
                    <View style={[com.aic,com.bgcfff,com.pd10,com.btweb]}>
                        <Text style={[com.cr]}>补充工作记录</Text>
                    </View>
                </TouchableHighlight>
            )
        }
    }
    //显示客户
    showCustomer(){
        let  {params}=this.props.navigation.state;
        var status=this.state.status;
        var daily_type=params.dailyInfo.daily_type;
        var customer=this.state.dailyInfo.customer_id;
        if(daily_type==2 || daily_type==3 || daily_type==4){
            if(customer!=null){
                return(
                    <TouchableHighlight
                        onPress={()=>this.goDetailCustomer(customer)}
                        underlayColor="#fff"
                        >
                        <View style={[com.row,com.jcsb,com.aic,com.pdt10l15,com.bbweb,com.bgcfff,]}>
                            <Text>客户</Text>
                            <View style={[com.row,com.aic]}>
                                <Text>{this.state.dailyInfo.customerName}</Text>
                                <Image
                                    style={[com.tcccc,com.wh16,]} source={require('../imgs/jtxr.png')}/>
                            </View>
                        </View>
                    </TouchableHighlight>
                )
            }
        }
    }
    show_edit(){
        let  {params}=this.props.navigation.state;
        //是否显示编辑
        var daily_type=params.dailyInfo.daily_type;
        var create_id=params.dailyInfo.create_id;
        var user_id= params.user_id;
        var start_time=params.dailyInfo.start_time;
        var moment=this.state.datetime;
        if(moment<start_time && user_id==create_id){
            return(<TouchableOpacity style={[com.pdtb10,]}
                                     onPress={() =>{ this.setState({show:!this.state.show});this.goPage_Edit()}}>
                <Text style={{color:'#333'}}>编辑</Text>
            </TouchableOpacity>)
        }
    }
    render() {
        let  {params}=this.props.navigation.state;
        let imgArr = this.state.imgArr;
        var list = [];
        for (var i = 0; i < imgArr.length; i++) {
            if(imgArr[i].visible==null) {
                list.push(
                    <View key={i}>
                        <View style={[com.pos]}>
                            <Image source={{uri: imgArr[i].path}} style={[com.MG5,com.wh64,com.pos]}/>
                            <TouchableHighlight
                                style={[com.MG5,com.posr,{top:-3,right:0}]}
                                onPress={this.goonDel.bind(this,imgArr[i].id)}
                                underlayColor="#f5f5f5"
                                >
                                <Image source={require('../imgs/del162.png')} style={[com.wh16,]}/>
                            </TouchableHighlight>
                        </View>
                    </View>
                )
            }
        }
        //日程评论部分
        var reviewlist =[];
        var review = this.state.review;
        var reviewLen=this.state.reviewLen
        if(review==null ||reviewLen==0){
            reviewlist.push(
                <View style={[com.bgcfff,com.pd15,com.bbweb,]} key={0}>
                    <Text style={[com.cbe]}>暂无评论</Text>
                </View>
            )
        }else{
            for(var i in review) {
                let reviewPic=review[i].imgArr;
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
                reviewlist.push(
                    <View style={[com.row,com.mgt5,com.pdt5l15]}  key={i}>
                        {(review[i].avatar==""||review[i].avatar==null)?(
                            <Image style={[com.tcp,com.wh32,com.br200]} source={require('../imgs/tx.png')}/>
                        ):(<Image style={[com.wh32,com.br200]} source={{uri:review[i].avatar}}/>)}

                        <View style={[com.mgl15,com.flex,com.bbwc,com.mgb5]}>
                            <View style={[com.row,com.jcsb,com.mgb5]}>
                                <Text style={[com.cbe]}>{review[i].reviewer}</Text>
                                <Text style={[com.cbe,com.fs10]}>{review[i].datetime}</Text>
                            </View>

                            <View style={[com.mgb10]}>
                                <Text>{review[i].content}</Text>
                            </View>
                            {review[i].imgArr.length==0?(null):(
                                <View style={[com.row]}>
                                    {reviewPiclist}
                                </View>
                            )}
                        </View>
                    </View>
                )
            }
        }
        //日程报告部分
        var reportlist=[];
        var report=this.state.report;
        var reportLen=this.state.reportLen;
        var daily_type=params.dailyInfo.daily_type;
        if(report==null || report==""){
            reportlist.push(
                <View style={[com.bgcfff,com.pd15,com.bbweb,]} key={0}>
                    <Text style={[com.cbe]}>暂无工作进展</Text>
                </View>
            )
        }else if(daily_type==3){
            for(var i in report){
                let reportPic=report[i].imgArr;
                var reportPiclist = [];
                if(reportPic.length!=0){//如果有日程汇报图片
                    for(var j=0;j<reportPic.length; j++){
                        reportPiclist.push(
                            <View  key={j}>
                                <Image style={[com.wh64,com.mg5]} source={{uri:reportPic[j]}}/>
                            </View>
                        );
                    }
                }
                reportlist.push(
                    <View  style={[com.mgb5]} key={i}>
                        <View style={[com.bgcfff,com.pdt5l15,com.bbweb]}>
                            { /*<Text style={[com.cbe,com.fs10]}>暂无工作进展(这是无数据时显示)</Text>*/}
                            <View style={[com.row,com.jcsb,com.aic]}>
                                <View style={[com.row]}>
                                    <View style={[com.bwd,com.br200,com.mgr5]}>
                                        {(report[i].avatar==""||report[i].avatar==null)?(
                                            <Image style={[com.tcp,com.wh32,com.br200]} source={require('../imgs/tx.png')}/>
                                        ):(<Image style={[com.wh32,com.br200]} source={{uri:report[i].avatar}}/>)}

                                    </View>
                                    <View style={[com.aic,com.jcc]}>
                                        <Text>{report[i].creater}</Text>
                                        <Text style={[com.fs10,com.cbe]}>{params.dailyInfo.typeName}汇报</Text>
                                    </View>
                                </View>
                                <Text style={[com.cbe,com.fs10]}>{report[i].datetime}</Text>
                            </View>
                        </View>
                        <View style={[com.bgcfff,com.pdlr15,com.bbweb]}>
                            <View style={[com.pdtb5,]}>
                                <Text style={[com.cbe,com.fs10]}>{params.dailyInfo.typeName}内容</Text>
                            </View>
                            <View style={[com.pdtb5,com.bbweb]}>
                                <Text style={[]}>{report[i].content}</Text>
                            </View>
                        </View>
                        {report[i].result==null?(null):(<View style={[com.bgcfff,com.pdlr15,com.bbweb]}>
                            <View style={[com.pdtb5,]}>
                                <Text style={[com.cbe,com.fs10]}>预计结果</Text>
                            </View>
                            <View style={[com.pdtb5,com.bbweb]}>
                                <Text style={[]}>{report[i].result}</Text>
                            </View>
                        </View>)}

                        {report[i].plan==null?(null):(<View style={[com.bgcfff,com.pdlr15,com.bbweb]}>
                            <View style={[com.pdtb5,]}>
                                <Text style={[com.cbe,com.fs10]}>今后计划</Text>
                            </View>
                            <View style={[com.pdtb5,com.bbweb]}>
                                <Text style={[]}>{report[i].plan}</Text>
                            </View>
                        </View>)}
                        {report[i].explain==null?(null):(<View style={[com.bgcfff,com.pdlr15,com.bbweb]}>
                            <View style={[com.pdtb5,]}>
                                <Text style={[com.cbe,com.fs10]}>备注</Text>
                            </View>
                            <View style={[com.pdtb5,com.bbweb]}>
                                <Text style={[]}>{report[i].explain}</Text>
                            </View>
                        </View>)}
                        {/*<View style={[com.pdtb5,]}>
                         <Image style={[com.wh64,com.mg5]} source={require('../imgs/chatres.png')}/>
                         </View>*/}
                        {report[i].imgArr.length==0?(null):(
                            <View style={[com.bgcfff,com.pdlr15,com.bbweb]}>
                                <View style={[com.pdtb5,]}>
                                    <Text style={[com.cbe,com.fs10]}>照片</Text>
                                </View>
                                <View style={[com.row]}>
                                    {reportPiclist}
                                </View>
                            </View>
                        )}
                        <View style={[com.bgcfff,com.pdlr15,com.bbweb]}>
                            <View style={[com.pdtb5,]}>
                                <Text style={[com.cbe,com.fs10]}>接收人</Text>
                            </View>
                            <View style={[com.pdtb5,com.bbweb,]}>
                                <Text style={[]}>{report[i].recepterName}</Text>
                            </View>
                        </View>
                    </View>
                )
            }
        }else{
            for(var i in report){
                let reportPic=report[i].imgArr;
                var reportPiclist = [];
                if(reportPic.length!=0){//如果有日程汇报图片
                    for(var j=0;j<reportPic.length; j++){
                        reportPiclist.push(
                            <View  key={j}>
                                <Image style={[com.wh64,com.mg5]} source={{uri:reportPic[j]}}/>
                            </View>
                        );
                    }
                }
                reportlist.push(
                    <View  style={[com.mgb5]} key={i}>
                        <View style={[com.bgcfff,com.pdt5l15,com.bbweb]}>
                            { /*<Text style={[com.cbe,com.fs10]}>暂无工作进展(这是无数据时显示)</Text>*/}
                            <View style={[com.row,com.jcsb,com.aic]}>
                                <View style={[com.row]}>
                                    <View style={[com.bwd,com.br200,com.mgr5]}>
                                        {(report[i].avatar==""||report[i].avatar==null)?(
                                            <Image style={[com.tcp,com.wh32,com.br200]} source={require('../imgs/tx.png')}/>
                                        ):(<Image style={[com.wh32,com.br200]} source={{uri:report[i].avatar}}/>)}
                                    </View>
                                    <View style={[com.aic,com.jcc]}>
                                        <Text>{report[i].creater}</Text>
                                        <Text style={[com.fs10,com.cbe]}>{params.dailyInfo.typeName}汇报</Text>
                                    </View>
                                </View>
                                <Text style={[com.cbe,com.fs10]}>{report[i].datetime}</Text>
                            </View>
                        </View>
                        <View style={[com.bgcfff,com.pdlr15,com.bbweb]}>
                            <View style={[com.pdtb5,]}>
                                <Text style={[com.cbe,com.fs10]}>{params.dailyInfo.typeName}内容</Text>
                            </View>
                            <View style={[com.pdtb5,com.bbweb]}>
                                <Text style={[]}>{report[i].content}</Text>
                            </View>
                        </View>

                        {/*<View style={[com.pdtb5,]}>
                         <Image style={[com.wh64,com.mg5]} source={require('../imgs/chatres.png')}/>
                         </View>*/}
                        {report[i].imgArr.length==0?(null):(
                            <View style={[com.bgcfff,com.pdlr15,com.bbweb]}>
                                <View style={[com.pdtb5,]}>
                                    <Text style={[com.cbe,com.fs10]}>照片</Text>
                                </View>
                                <View style={[com.row]}>
                                    {reportPiclist}
                                </View>
                            </View>
                        )}
                        <View style={[com.bgcfff,com.pdlr15,com.bbweb]}>
                            <View style={[com.pdtb5,]}>
                                <Text style={[com.cbe,com.fs10]}>接收人</Text>
                            </View>
                            <View style={[com.pdtb5,com.bbweb,]}>
                                <Text style={[]}>{report[i].recepterName}</Text>
                            </View>
                        </View>
                        {(report[i].location==null||report[i].location=="")?(null):(<View style={[com.bgcfff,com.pdlr15,com.bbweb]}>
                            <View style={[com.bgcfff]}>
                                <Image style={[com.tcccc,com.wh24,]} source={require('../imgs/daily/location.png')}/>
                            </View><Text> {report[i].location}</Text>
                        </View>)}
                    </View>
                )
            }
        }
        return (
            <View style={[com.flex,com.bgcf5]}>
                {/*nav*/}
                <View style={[com.row,com.aic,com.jcsb,com.pdt5l15,com.bbwc,com.bgcfff]}>
                    <TouchableHighlight
                        onPress={()=>this.back()}
                        underlayColor="#ffffff"
                        >
                        <View style={[com.row,com.aic]}>
                            <Image
                                style={[com.tcr,com.wh16,]} source={require('../imgs/jtxz.png')}/>
                            <Text style={[com.cr]}>返回</Text>
                        </View>
                    </TouchableHighlight>
                    <Text>{params.dailyInfo.typeName}详情</Text>
                    <TouchableOpacity onPress={() => {this.setState({show: !this.state.show})}}>
                        <Image source={require('../imgs/slh.png')}/>
                    </TouchableOpacity>
                </View>
                <ScrollView style={[com.flex,com.bgcf5]}>
                    <View style={[com.row,com.bgcfff,com.jcsb,com.pdt5l15,com.btweb,com.mgt5]}>
                        <View style={[com.bgcfff]}>
                            {(params.dailyInfo.daily_type==1)?
                                (   <TouchableHighlight
                                    onPress={this.goPageCusDetail.bind(this,this.state.dailyInfo.customer_id,this.state.dailyInfo.company_id)}
                                    underlayColor="#fff"
                                    ><View style={[com.row,]}>
                                    <Text style={[{height:22,borderLeftWidth:2,borderColor:'#e4393c'}]}></Text>
                                    <Text style={[com.mgr10,com.mgl10,com.fs16]}>{this.state.dailyInfo.customerName}</Text>
                                    <View style={[com.aic,]}>
                                        <Text
                                            style={[com.cr,com.bwcd,com.br,com.fwb,com.fs10,com.pdl1,com.pdt1]}>详情</Text>
                                    </View>
                                </View></TouchableHighlight>):
                                ( <View style={[com.row,]}>
                                    <Text style={[{height:22,borderLeftWidth:2,borderColor:'#e4393c'}]}></Text>
                                    <Text style={[com.mgr10,com.mgl10,com.fs16]}>{this.state.dailyInfo.title}</Text>

                                </View>)
                            }
                            <View style={[com.row,com.aic,com.mgt10]}>
                                <Image
                                    style={[com.tcr,com.wh12,com.mgr5]} source={require('../imgs/iconsj.png')}/>
                                {(this.state.dailyInfo.stop_time==" " || this.state.dailyInfo.stop_time==null)?(
                                    <Text style={[com.fs10]}>{this.state.dailyInfo.datetime}</Text>
                                ):(
                                    <Text style={[com.fs10]}>{this.state.dailyInfo.timestart} &nbsp;~&nbsp; {this.state.dailyInfo.timestop}</Text>
                                )}
                            </View>
                        </View>
                        <TouchableHighlight
                            onPress={this.changeDailyStatus.bind(this)}
                            underlayColor="#fff"
                            >
                            <View style={[com.aic,com.jcc]}>
                                {(this.state.status ==3 )?(<Image
                                        style={[com.tcr,com.wh24,]}
                                        source={require('../imgs/daily/sc2res.png')}/>
                                ):(<View><Image
                                    style={[com.tcbe,com.wh24,]} source={require('../imgs/sc2.png')}/>
                                    <Text style={[com.cbe,com.fs10]}>标记结束</Text>
                                </View>)}

                                {/* <Text style={[com.cbe,com.fs10]}>标记结束</Text>*/}
                            </View>
                        </TouchableHighlight>
                    </View>

                    <View style={[com.pdt20l15,com.bgcfff,com.bbwc]}>
                        <Text>{this.state.dailyInfo.description}</Text>
                    </View>
                    {this.state.dailyInfo.position==null?(null):(
                        <View style={[com.row,com.jcsb,com.bbweb,com.aic,com.pdt10l15,com.bgcfff,]}>
                            <Text>地点</Text>
                            <View style={[com.row,com.aic]}>
                                <Text>{this.state.dailyInfo.position}&nbsp;&nbsp;&nbsp;</Text>
                                <Image
                                    style={[com.tcccc,com.wh16,]} source={require('../imgs/daily/visitroad.png')}/>
                            </View>
                        </View>
                    )}
                    {this.state.dailyInfo.executor==null?(null):(
                        <TouchableHighlight
                            onPress={()=>this.goDetailExecutor(this.state.dailyInfo.create_id,this.state.dailyInfo.executor)}
                            underlayColor="#fff"
                            >
                            <View style={[com.row,com.jcsb,com.aic,com.pdt10l15,com.bgcfff,com.bbweb]}>
                                <Text>人员</Text>
                                <View style={[com.row,com.aic]}>
                                    <Text>{this.state.dailyInfo.executorName}</Text>
                                    <Image
                                        style={[com.tcccc,com.wh16,]} source={require('../imgs/jtxr.png')}/>
                                </View>
                            </View>
                        </TouchableHighlight>
                    )}
                    {this.showCustomer()}
                    <View style={[com.mixbgf3]}>
                        <Text style={[com.fs10,com.cbe]}>工作进展</Text>
                    </View>
                    {reportlist}
                    <View style={[com.btbweb,com.mgt5]}>
                        <View style={[com.row,com.jcsb,com.aic,com.pdt5l15,com.bgcfff,com.bbweb]}>
                            <Text style={[com.cbe,com.fs10]}>共评论({this.state.reviewLen})</Text>
                            <TouchableOpacity onPress={() => {this.setState({wos: !this.state.wos});
               }}>
                                <Image style={[com.tcr,com.wh16]} source={require('../imgs/chatres.png')}/>
                            </TouchableOpacity>
                        </View>
                        {reviewlist}
                    </View>
                </ScrollView>
                {this.showReport()}
                {/* 添加模型-事件评论*/}
                <View>
                    <Modal
                        backdropOpacity={0}
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
                        <View style={[com.bgcfff,com.brtlr5,wds.pos,com.pdt5,com.pdl5,com.pdb5]}>
                            <View style={[com.row,com.jcsb,com.aic,com.ww98]}>
                                <TouchableOpacity style={[com.pdtb5,]}
                                                  onPress={() => { this.openFloder()}}>
                                    <Image style={[com.tcr,com.wh32,com.tcccc]} source={require('../imgs/tpslt.png')}/>
                                </TouchableOpacity>
                                <View style={[com.bwc9,com.br]}>
                                    <TextInput
                                        style={[{width:screenW*0.75},com.h30,com.pd5,com.bwc]}
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
                                <Text style={[com.bgcr,com.cff,com.pd5,com.br]} onPress={()=>{this.sendReview();}}>发送</Text>
                            </View>
                            <View style={[com.row,com.ww,com.flww,com.pdl5]}>
                                {list}
                                {list.length==0?(null):(<Text onPress={()=>this.uploadImg()}>上传图片</Text>)}
                            </View>
                        </View>
                    </Modal>
                    {/* 添加模型 - 分享区域*/}
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
                                    {/*<TouchableOpacity style={[com.pdtb10,]}
                                     onPress={() => { this.setState({show:!this.state.show});this.goPage_Edit()}}>
                                     <Text style={{color:'#333'}}>编辑</Text>
                                     </TouchableOpacity>*/}
                                    {this.show_edit()}
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
            </View>
        )
    }
}

