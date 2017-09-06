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
import {NativeModules}from 'react-native';
var RNBridgeModule = NativeModules.RNBridgeModule;
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import com from '../../public/css/css-com';
import Modal from 'react-native-modal'
import wds from '../../public/css/css-window-single'
import ImagePicker from 'react-native-image-crop-picker';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import Loading from '../../common/loading';
import moment from 'moment';

export default class DailyReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleModal:false,
            inputText: '',
            image:'',
            imgArr: [],
            id:1,
            executor:[],
            content:"",
            result:"",
            plan:"",
            location:"",
            explain:""
        };
    }
    componentDidMount() {
        //diliweizhi
        //监听事件名为EventName的事件
        this.listener = DeviceEventEmitter.addListener(
            'EvecntReminder',
            (reminder)=> {
                this.setState({
                 location:reminder.name
                })
            }
        );
        //选择员工
        this.executorListener= DeviceEventEmitter.addListener('Executor', (a)=> {
            this.setState({
                executor: a
            })
        });
    }

    componentWillUnmount() {
        // 移除监听
        this.executorListener.remove();
        this.listener.remove();
    }
    back() {
        this.props.navigation.goBack(null);
    }
    //跳转到定位页面
    goPage_VisitPosition(){
        RNBridgeModule.RNLocation();
    }
    //跳转到日历详情页面
    goPage_DailyDetail(report){
        DeviceEventEmitter.emit('Report',{
          reportInfo:report,
          status:2
        }); //发监听
        //拜访页面需要跳过定位页面
        this.props.navigation.goBack('DailyReport');

    }
    confirm_submit(){
        Alert.alert(
            '温馨提示',
            '提交工作或进一步修改?',
            [
                {text: '取消', onPress: () =>{}},
                {text: '确定', onPress: () => {
                   this.submit()
                }},
            ]
        )
    }
    //提交
    submit() {
        let {params} = this.props.navigation.state;
        if(this.state.content==" "|| this.state.content==null){
            toast.bottom(params.typeName+'名称不能为空');
            return false;
        }
        let images= this.state.imgArr;
        for(var i = 0;i<images.length;i++){
            if(images[i].visible==null && this.state.image==""){//如果选择了图片而且没有上传到服务器
                toast.bottom('请先上传图片!');
                return false;
            }
        }
        //添加执行人
        var executorArr = this.state.executor;
        var executorIds=[];
        for (var i = 0; i < executorArr.length; i++) {
            executorIds[i]=executorArr[i].id;
        }
        var executor = executorIds.join(",");
        if(executor==""||executor==null){
            toast.bottom('至少选择一个接收人');
            return false;
        }
        var url =config.api.base + config.api.sendDailyReport;
        request.post(url,{
            daily_id:params.daily_id,
            user_id:params.user_id,//人员的id,从其他地方获取
            company_id:params.company_id,
            image:this.state.image,
            content:this.state.content,
            recepter:executor,
            result:this.state.result,
            plan:this.state.plan,
            explain:this.state.explain,
            location:this.state.location,
            datetime: moment(new Date()).format('YYYY-MM-DD HH:mm'),
            status:params.status
        }).then((res)=>{
            ///重新获取评论内容
            if(res.status==1){
                Alert.alert(
                    '温馨提示',
                    '已提交',
                    [
                        {text: '关闭', onPress: () => {
                            this.goPage_DailyDetail(res.data);
                        }},
                    ]
                )
            }else{
                toast.bottom(res.message);
            }
        })
            .catch((error)=>{
                toast.bottom('网络连接失败,请检查网络后重试')
            });
    }
    //选择任务人
    goPage_chooseEmployee(){
        let {params} = this.props.navigation.state;
        var executor=this.state.executor;
        var executorIds=[];
        for (var i = 0; i < executor.length; i++) {
            executorIds[i]=executor[i].id;
        }
        this.props.navigation.navigate('ChooseExecutor',{
            user_id:params.user_id,
            company_id: params.company_id,
            executor:this.state.executor,
            executorIds:executorIds
        });
    }
    //删除选中的任务人
    del_checkedEmployee(id){
        Alert.alert(
            '温馨提示',
            '删除该接收人?',
            [
                {text: '取消', onPress: () =>{}},
                {text: '确定', onPress: () => {
                    var executor=this.state.executor;
                    for (var i = 0; i < executor.length; i++) {
                        if(executor[i].id==id){
                            // alert(i)
                            executor.splice(i,1)
                        }
                    }
                    this.setState({
                        executor:executor
                    })
                }},
            ]
        )
    }
    //清空选中的任务人
    empty_checkedEmployee(){
        Alert.alert(
            '温馨提示',
            '清空所有接收人',
            [
                {text: '取消', onPress: () =>{}},
                {text: '确定', onPress: () => {
                    this.setState({
                        executor:[]
                    })
                }},
            ]
        )
    }
    //删除图片
    goonDel(id) {
        //alert(id)
        var imgArr = this.state.imgArr;
        var op = [];
        for (var i in imgArr) {
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
    //打开相机
    _openCamera(){
        ImagePicker.openCamera({
            // width: 300,
            // height: 400,
            cropping: false
        }).then(image => {
            this.state.imgArr.push({id: this.state.id, visible: null, path: image.path});
            this.setState({//放到这里只是为了渲染页面
                id: this.state.id + 1
            })
        });
    }
    //选择图片
    pickSingle(){
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
    }
    visibleModalSet(visible) {
        this.setState({visibleModal: visible});
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
    //选择中间内容
    _getContent(){
        let {params} = this.props.navigation.state;
        if(params.daily_type==4){
            return(
                <View>
                    <View style={[com.row,com.aic,com.bgcfff,com.pdt5l15,com.bbweb]}>
                        <Text>会议内容</Text>
                        <TextInput
                            style={[{width:screenW*0.8},com.pd5]}
                            underlineColorAndroid='transparent'
                            numberOfLines={2}
                            multiline={true}
                            textAlignVertical="center"
                            placeholder='请输入文本(必填)'
                            placeholderTextColor='#cfcfcf'
                            secureTextEntry={false}
                            onChangeText={(content) => this.setState({content:content})}
                            />
                    </View>
                    <View style={[com.row,com.aic,com.bgcfff,com.pdt5l15,com.bbweb]}>
                        <Text>预计结果</Text>
                        <TextInput
                            style={[{width:screenW*0.8},com.pd5]}
                            underlineColorAndroid='transparent'
                            numberOfLines={2}
                            multiline={true}
                            textAlignVertical="center"
                            placeholder='请输入文本'
                            placeholderTextColor='#cfcfcf'
                            secureTextEntry={false}
                            onChangeText={(result) => this.setState({result:result})}
                            />
                    </View>
                    <View style={[com.row,com.aic,com.bgcfff,com.pdt5l15,com.bbweb]}>
                        <Text>今后计划</Text>
                        <TextInput
                            style={[{width:screenW*0.8},com.pd5]}
                            underlineColorAndroid='transparent'
                            numberOfLines={2}
                            multiline={true}
                            textAlignVertical="center"
                            placeholder='请输入文本'
                            placeholderTextColor='#cfcfcf'
                            secureTextEntry={false}
                            onChangeText={(plan) => this.setState({plan: plan})}
                            />
                    </View>
                    <View style={[com.pdt5l15,com.bgcfff,com.bbweb]}>
                        <Text>备注</Text>
                        <TextInput
                            style={[com.ww9,com.h30,com.pd0,com.hh2]}
                            underlineColorAndroid='transparent'
                            numberOfLines={5}
                            multiline={true}
                            textAlignVertical="top"
                            placeholder='请输入文本'
                            placeholderTextColor='#bebebe'
                            secureTextEntry={false}
                            onChangeText={(explain) => this.setState({explain: explain})}
                            />
                    </View>
                </View>
            )
        }else{
            return(
                <View style={[com.pdt5l15,com.bgcfff,com.bbweb]}>
                    <Text>{params.typeName}内容</Text>
                    <TextInput
                        style={[com.ww9,com.h30,com.pd0,com.hh2]}
                        underlineColorAndroid='transparent'
                        numberOfLines={6}
                        multiline={true}
                        textAlignVertical="top"
                        placeholder='请输入文本(必填)'
                        placeholderTextColor='#bebebe'
                        secureTextEntry={false}
                        onChangeText={(content) => this.setState({content: content})}
                        />
                </View>
            )
        }
    }
    //显示定不定位
    _getPosition(){
        let {params} = this.props.navigation.state;
        if(params.daily_type==1 || params.daily_type==2){
        return(
        <View style={[com.pdt5l15,com.row,com.aic,com.jcsb,com.mgt5,com.bbweb,com.bgcfff]}>
            <Text>{this.state.location}</Text>
            <TouchableHighlight
                onPress={()=>{this.goPage_VisitPosition()}}
                underlayColor="#ffffff"
                >
                <View style={[com.bgcfff]}>
                    <Image
                        style={[com.tcccc,com.wh24,]} source={require('../../imgs/daily/location.png')}/>
                </View>
            </TouchableHighlight>
        </View>)
        }
    }
    render() {
        let {params}=this.props.navigation.state;
        let imgArr = this.state.imgArr;
        var list = [];
        for (var i = 0; i < imgArr.length; i++) {
            if (imgArr[i].visible == null) {
                list.push(
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
        //显示执行人
        var executor=this.state.executor;
        var executorlist = [];
        for (var i = 0; i < executor.length; i++) {
            executorlist.push(
            <View key={i}>
                 <TouchableHighlight
                    onPress={this.del_checkedEmployee.bind(this,executor[i].id)}
                    underlayColor="#ffffff">
                     <View style={[com.mglr5,com.mgb5,com.aic,com.jcc]}>
                         {(executor[i].avatar==""||executor[i].avatar==null)?(
                            <Image style={[com.tcp,com.wh32,com.br200]} source={require('../../imgs/tx.png')}/>
                          ):(<Image style={[com.wh32,com.br200]} source={{uri:executor[i].avatar}}/>)}
                         <Text style={[com.mgt5,com.fs10]}>{executor[i].name}</Text>
                     </View>

                 </TouchableHighlight>
            </View>
            )
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
                                style={[com.tcr,com.wh16,]} source={require('../../imgs/jtxz.png')}/>
                            <Text style={[com.cr]}>返回</Text>
                        </View>
                    </TouchableHighlight>
                    <Text>{params.typeName}汇报</Text>

                    <TouchableHighlight
                        onPress={()=>this.submit()}
                        underlayColor="#ffffff"
                        >
                        <View style={[com.row,com.aic]}>
                            <Text style={[com.cr]}>提交</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <ScrollView style={[com.flex,com.bgcf5]}>
                    <View style={[com.mixbgcf3]}>
                        <Text style={[com.cbe,com.fs10]}>{params.typeName}汇报</Text>
                    </View>
                    {this._getContent()}
                    <View style={[com.row,com.aic,com.jcsb,com.btweb,com.pdt5,com.bgcfff,com.pdt5l15]}>
                        <Text>拍照</Text>
                        <TouchableHighlight
                            onPress={()=>{this.setState({visibleModal: !this.state.visibleModal})}}
                            underlayColor="#ffffff"
                            >
                            <View style={[com.bgcfff]}>
                                <Image
                                    style={[com.tcccc,com.wh24,]} source={require('../../imgs/zxj32.png')}/>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={[com.row,com.ww,com.flww,com.pdl5]}>
                        {list}
                        {list.length==0?(null):(
                        <TouchableHighlight
                            onPress={()=>this.uploadImg()}
                            underlayColor="#d5d5d5"
                            >
                            <View style={[com.jcc,com.aic,com.h30,com.FLEX]}>
                                <Text style={[com.bwr,com.bgcfff,com.br5,com.pd5,com.cr]}>上传图片</Text>
                            </View>
                        </TouchableHighlight>
                        )}
                    </View>
                    <View style={[com.mgt5,com.bbweb]}>
                        <View style={[com.mixbgcfff_nobb]}>
                            <Text style={[com.tabfc]}>接收人</Text>
                        </View>
                        <View  style={[com.row,com.ww,com.flww,com.pdlr15,com.bgcfff]}>
                            {executorlist}
                           <TouchableHighlight
                            onPress={()=>{this.goPage_chooseEmployee()}}
                            underlayColor="#ffffff"
                            >
                            <Image
                               style={[com.tcccc,com.wh32,]} source={require('../../imgs/iconadd.png')}/>
                            </TouchableHighlight>
                            {executorlist.length==0?(null):(
                                <TouchableHighlight
                                    onPress={()=>{this.empty_checkedEmployee()}}
                                    underlayColor="#ffffff"
                                    >
                                     <Image style={[com.tcccc,com.wh32,]} source={require('../../imgs/icondel.png')}/>
                                </TouchableHighlight>
                            )}
                        </View>
                    </View>
                    {this._getPosition()}
                </ScrollView>
                {/*选择图片或拍照*/}
                <View>
                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.visibleModal}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                        >
                        <View style={{width:screenW,height:screenH,backgroundColor:'#555',opacity:0.6}}><TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {
                     this.visibleModalSet(!this.state.visibleModal)
                    }}></TouchableOpacity>
                        </View>
                        <View style={styles.addCustomer_c}>
                            <View style={[styles.addCustomer_card,styles.addCustomer_card_1]}>
                                <TouchableOpacity
                                    style={[styles.customerCard_content,styles.customerCard_content_2,styles.customerCard_content2]}
                                    onPress={()=>{this._openCamera();this.visibleModalSet(!this.state.visibleModal)}}
                                    >
                                    <Text>拍照</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.customerCard_content,styles.customerCard_content_2]}
                                    onPress={()=>{this.pickSingle();this.visibleModalSet(!this.state.visibleModal)}}
                                    >
                                    <View>
                                        <Text>从相册选取</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.addCustomer_card,styles.addCustomer_card_2]}>
                                <TouchableOpacity  style={[styles.customerCard_content,styles.customerCard_content_2]} onPress={() => { this.visibleModalSet(!this.state.visibleModal)}}>
                                    <Text>取消</Text>
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
    ancestorCon:{
        flex: 1,
        backgroundColor: '#F0F1F2',
    },
    childContent: {//子容器页面级
        flex: 1
        //justifyContent: 'space-between',
    },
    container: {
        borderWidth: 1,
        borderColor:'#F0F1F2',
        borderBottomColor:'#F0F0F0',
        height: 35,
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        marginBottom:10,
    },
    backAll:{
        width:60,
        height:30,
        flexDirection: 'row',
        alignItems:'flex-start',
    },
    back: {
        width:20,
        height:20,
        marginTop:7,
    },
    backwz: {
        marginTop:7,
        color: 'red',
    },
    info:{
        marginLeft:screenW *0.28,
        marginTop:7,
    },
    dingwei:{
        flexDirection:'row',
        alignItems:'center'
    },
    myself:{
        width:30,
        height:30
    },

    TotalSetting: {
        marginBottom:10
    },
    TotalSetting1:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff',
        padding:10,
        borderColor:'#F0F1F2',
        borderBottomWidth:1
    },
    rjt:{
        width: 16,
        height: 16,
    },
    SettingAddress:{
        height:40,
        borderWidth: 1,
        borderColor: '#fff',
        borderBottomColor:'#F0F1F2',
        backgroundColor:'#fff',
        justifyContent: 'center',
        position:'relative'
    },
    resultInfo:{
        marginRight:screenW *0.5,
        marginTop:7,
        color:'#ccc',
    },
    addCustomer:{
        flex:1,
        position:'absolute',
        top:screenH*0.3,
    },
    addCustomer_c:{
        flex:1,
        position:'absolute',
        bottom:screenH*0.02,
    },
    addCustomer_card:{
        width:screenW*0.9,
        height:screenH*0.3,
        backgroundColor:'#fff',
        marginLeft:screenW*0.05,

    },
    addCustomer_card_1:{
        height:screenH*0.15,
        borderRadius:4
    },
    addCustomer_card_2:{
        marginTop:10,
        height:screenH*0.07,
        borderRadius:4
    },
    addCustomer_card_3:{
        paddingLeft:screenW*0.02,
        paddingRight:screenW*0.02,
    },
    customerCard_content:{
        justifyContent:'center',
        alignItems:'flex-start',
        height:screenH*0.075,
        borderBottomColor:'#ddd',
    },
    customerCard_content_2:{
        alignItems:'center',
    },
    customerCard_content_3:{
        paddingLeft:10,
    },
    customerCard_content2:{
        borderBottomWidth:1,
    },
});

