/**
 * Created by Administrator on 2017/7/4.
 */
/**
 * Created by Administrator on 2017/7/3.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    TouchableHighlight
    } from 'react-native';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import Header from '../../common/header';
const screenW = Dimensions.get('window').width;
export default class ModifyTel extends Component {
    //添加职位信息或修改
    constructor(props){
        super(props)
        this.state={
            tel:'',
        };
    }
    //点击更换按钮
    modifyTel() {
        var url = config.api.base + config.api.myselfInfomation;
        let {params}=this.props.navigation.state;
        request.post(url,{
            userid:params.canshu.userid,//使用者的id
            telphone:this.state.tel,//手机号
        }).then((responseJson) => {
            if(responseJson.sing==0){
                toast.center('温馨提示：修改的手机号不能为空！');
            }
            if(responseJson.sing==1){
                toast.center('修改成功');
                this.props.navigation.navigate('Info', {id:params.canshu.userid});
            }
            if(responseJson.sing==2){
                toast.center('修改失败');
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    };
    //点击更换按钮

    OpBack() {
        this.props.navigation.goBack('ModifyTel')
    }
    render() {
        const {params} = this.props.navigation.state;
        return (
            <View style={styles.ancestorCon}>
                <Header navigation = {this.props.navigation}
                        title = "电话"
                        rightText = "保存"
                        onPress={()=>this.OpBack()}/>
                <View style={[styles.childContent,{marginTop:5}]} >
                    <Image style={{width:60,height:60,marginTop:20,marginBottom:15,tintColor:'#666'}} source={require('../../imgs/my/changePhone.png')}/>
                    <Text style={{marginBottom:15,color:'#666'}}>你的手机号：{params.canshu.tel}</Text>
                    <Text style={{marginBottom:15,color:'#ccc',fontSize:12}}>如果不再使用当前手机号，请及时更换</Text>

                    <View style={{width:screenW*0.65,height: 28,marginBottom:15,borderWidth:1,borderColor:'#a1a1a1',paddingLeft:10,borderRadius:5,backgroundColor:'#f9f9f9'}}>
                        <TextInput
                            style={{width:screenW*0.6,height: 25,borderColor: '#eeee', borderWidth: 1,padding:0,backgroundColor:'#f9f9f9'}}
                            onChangeText={(tel) => this.setState({tel})}
                            underlineColorAndroid={"transparent"}
                            placeholder='请输入您要修改的手机号码'
                            value={this.state.tel}

                            />
                    </View>
                    <TouchableHighlight
                        onPress={()=>this.modifyTel()}
                        underlayColor="#dadada"
                        >
                        <View style={[styles.changePhone,styles.childContent]}>
                            <Text style={{color:'#fff'}}>更换手机号</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}
const screenH = Dimensions.get('window').height;
const styles = StyleSheet.create({
    ancestorCon: {
        flex: 1,
        backgroundColor: '#F0F1F2',
    },

    childContent: {//子容器页面级
        justifyContent: 'center',
        alignItems:'center',
    },
    changePhone:{
        width:screenW*0.8,
        backgroundColor:'#e15151',
        borderRadius:4,
        height:30,
        marginTop:15
    },
});