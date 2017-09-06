/**
 * Created by Administrator on 2017/6/7.
 */
import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    Dimensions,
    Modal,
    DeviceEventEmitter,
} from 'react-native';
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';
import ImagePicker from 'react-native-image-crop-picker';
import Header from '../common/header';
export default class Info extends Component {

    //查询个人信息
    constructor(props){
        super(props)
        this.state={
            //底部选择项 默认不显示
            show: false,
            visibleModal:false,

            id:"",
            avatar:"",
            name: "",
            tel:"",
            email:"",
            department:"",
            position:"",
            address:"",
        };
    }
    visibleModalSet(visible) {
        this.setState({visibleModal: visible});
    }
    componentDidMount(){
        this.getNet();
    }

    getNet(){
        var url = config.api.base + config.api.myselfInfomation;
        var id=this.props.navigation.state.params.id;
        request.post(url,{
            id: id,
        }).then((responseJson) => {
            this.setState({
                id:responseJson.id,
                avatar:responseJson.avatar,
                name: responseJson.name,
                tel:responseJson.tel,
                email:responseJson.email,
                department:responseJson.department,
                position:responseJson.position,
                address:responseJson.address
            })

        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }
    OpBack() {
        this.props.navigation.goBack('Info')
       // this.props.navigation.navigate('My',{id:this.state.id});
    }
    position(){
        let data={
            userid:this.state.id,
            position:this.state.position
        }
        this.props.navigation.navigate('PositionInput',{canshu:data})
    }
    tel(){
        let data={
            userid:this.state.id,
            tel:this.state.tel
        }
        this.props.navigation.navigate('ModifyTel',{canshu:data})
    }
    email(){
        let data={
            userid:this.state.id,
            email:this.state.email
        }
        this.props.navigation.navigate('ModifyEmail',{canshu:data});
    }
    address(){
        let data={
            userid:this.state.id,
            address:this.state.address
        }
        this.props.navigation.navigate('ModifyAddress',{canshu:data});
    }
    //上传图片
    pickSingle() {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            this.uploadImg(image.path);
        });
    }
    //打开照相机
    _openCamera(){
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            alert(image.path);
            this.uploadImg(image.path);
        });
    }
    //上传图片
    uploadImg(source) {
        var url =config.api.base + config.api.myselfload;
        let formData = new FormData();
        let file = {uri:source, type: 'multipart/form-data',name:'1232'};
        formData.append("image",file);
        formData.append("url",source);
        fetch(url,{
            method:'POST',
            headers:{
                'Content-Type':'multipart/form-data'
            },
            body:formData
        })
            .then((response) => response.json())
            .then((res)=>{
                if(res.status == 1){
                    this.setState({
                        pic:res.data
                    });
                   this.modifyPhoto(res.data);
                } else if(res.status ==0){
                }
            })
            .catch((error)=>{
                // console.warn(error)
                toast.bottom('网络连接失败，请检查网络后重试');
            });
    }
    //监听事件（负责将类型传递上一页面
    backListen(canshuid){
        this.visibleModalSet(false);
        var url = config.api.base + config.api.myselfInfomation;
        request.post(url,{
            id: canshuid,
        }).then((responseJson) => {
            this.setState({
                id:responseJson.id,
                avatar:responseJson.avatar,
                name: responseJson.name,
                tel:responseJson.tel,
                email:responseJson.email,
                department:responseJson.department,
                position:responseJson.position,
                address:responseJson.address
            });
            DeviceEventEmitter.emit('avatar',responseJson.avatar) ;
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })

    }
    //将上传的图片保存到数据库中
    modifyPhoto(imgs){
        var url = config.api.base + config.api.myselfInfomation;
        var canshuid=this.props.navigation.state.params.id;
        request.post(url,{
            photo: imgs,
            userid:canshuid,
        }).then((responseJson) => {
            if(responseJson.sing==0){
                toast.center('温馨提示：上传的图片路径有误！');
            }
            if(responseJson.sing==1){

                 this.backListen(canshuid);
            }
            if(responseJson.sing==2){
                toast.center('修改失败');
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }
    render() {
        return (
            <View style={styles.ancestorCon}>
                <Header navigation = {this.props.navigation}
                        title = "个人信息"
                        onPress={()=>this.OpBack()}/>
                <ScrollView style={styles.childContent}>
                    <TouchableHighlight underlayColor={'#666'}
                                        onPress={() => {this.setState({visibleModal: !this.state.visibleModal})}}
                        >
                        <View style={[styles.TotalSetting1,{height:50,}]}>
                            <Text style={{color:'#333'}}>头像</Text>
                            <View style={styles.dingwei}>
                                {(this.state.avatar == '' || this.state.avatar == null) ?
                                    (<Image style={styles.myself} source={require('../imgs/avatar.png')}/>)
                                    : (<Image style={styles.myself} source={{uri:this.state.avatar}}/>)
                                }
                                <Image style={{width:12,height:12,marginLeft:10,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <View style={[styles.TotalSetting,{marginTop:10}]}>
                        <View style={[styles.TotalSetting1,{borderTopWidth:1}]}>
                            <Text style={{color:'#333'}}>姓名</Text>
                            <Text style={{marginRight:16}}>{this.state.name}</Text>
                        </View>
                        <TouchableHighlight underlayColor={'#666'} onPress={()=>this.tel()}>
                            <View style={[styles.TotalSetting1]}>
                                <Text style={{color:'#333'}}>电话</Text>
                                <View style={styles.dingwei}>
                                    {(this.state.tel == null || this.state.tel=='')? (<Text>
                                        未填写</Text>):(<Text>{this.state.tel}</Text>)}
                                    <Image style={{width:12,height:12,marginLeft:10,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                                </View>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor={'#666'} onPress={()=>this.email()}>
                            <View style={[styles.TotalSetting1]}>
                                <Text style={{color:'#333'}}>邮箱</Text>
                                <View style={styles.dingwei}>
                                    {(this.state.email == null || this.state.email=='')? (<Text>
                                        未填写</Text>):(<Text>{this.state.email}</Text>)}
                                    <Image style={{width:12,height:12,marginLeft:10,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                                </View>
                            </View>
                        </TouchableHighlight>
                        <View style={[styles.TotalSetting1]}>
                            <Text style={{color:'#333'}}>部门</Text>
                            {(this.state.department == null || this.state.department=='')? (<Text style={{marginRight:20}}>
                                未填写</Text>):(<Text style={{marginRight:20}}>{this.state.department}</Text>)}
                        </View>
                        <TouchableHighlight underlayColor={'#666'} onPress={()=>this.position()}>
                            <View style={[styles.TotalSetting1]}>
                                <Text style={{color:'#333'}}>职位</Text>
                                <View style={styles.dingwei}>
                                    {(this.state.position == null || this.state.position=='')? (<Text>
                                        未填写</Text>):(<Text>{this.state.position}</Text>)}
                                    <Image style={{width:12,height:12,marginLeft:10,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <TouchableHighlight underlayColor={'#666'} onPress={()=>this.address()}>
                        <View style={[styles.TotalSetting1,{borderTopWidth:1}]}>
                            <Text style={{color:'#333'}}>地址</Text>
                            <View style={styles.dingwei}>
                                {(this.state.address == null || this.state.address=='')? (<Text>
                                    未填写</Text>):(<Text>{this.state.address}</Text>)}
                                <Image style={{width:12,height:12,marginLeft:10,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                            </View>
                        </View>
                    </TouchableHighlight>
                </ScrollView>
                <View>
                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.visibleModal}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                        >
                        <View style={{width:screenW,height:screenH,backgroundColor:'#555',opacity:0.6}}>
                            <TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {
                      this.visibleModalSet(!this.state.visibleModal)
                    }}></TouchableOpacity>
                        </View>
                        <View style={styles.addCustomer_c}>
                            <View style={[styles.addCustomer_card,styles.addCustomer_card_1]}>
                                <TouchableOpacity
                                    style={[styles.customerCard_content,styles.customerCard_content_2,styles.customerCard_content2]}
                                    onPress={()=>this._openCamera()}
                                    >
                                    <Text>拍照</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.customerCard_content,styles.customerCard_content_2]}
                                    onPress={()=>this.pickSingle()}
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
        );
    }
}
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
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