/**
 * Created by Administrator on 2017/7/4.
 */
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
export default class ModifyAddress extends Component {
    //添加职位信息或修改
    constructor(props){
        super(props)
        this.state={
            address:'',
        };
    }
    //点击保存按钮
    modifyAddress() {
        var url = config.api.base + config.api.myselfInfomation;
        let {params}=this.props.navigation.state;
        request.post(url,{
            userid:params.canshu.userid,//使用者的id
            address:this.state.address,//地址
        }).then((responseJson) => {
            if(responseJson.sing==0){
                toast.center('温馨提示：地址不能为空！');
            }
            if(responseJson.sing==1){
                toast.center('保存成功');
                this.props.navigation.navigate('Info', {id:params.canshu.userid});
            }
            if(responseJson.sing==2){
                toast.center('保存失败');
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    };
    //点击保存按钮


    OpBack() {
        this.props.navigation.goBack('ModifyAddress')
    }
    render() {
        const {params} = this.props.navigation.state;
        return (
            <View style={styles.ancestorCon}>
                <Header navigation = {this.props.navigation}
                        title = "地址"
                        rightText = "保存"
                        onPress={()=>this.OpBack()}/>
                <View style={[styles.childContent,{marginTop:5}]} >
                    {(params.canshu.address=='' || params.canshu.address==null)?
                        (<TextInput
                            style={{height: 40, borderColor: '#F0F0F0', borderWidth: 1,backgroundColor:'#fff'}}
                            onChangeText={(address) => this.setState({address})}
                            placeholder={'地址'}
                            autoFocus={true}
                            underlineColorAndroid={"transparent"}
                            value={this.state.address}
                            />) : (<TextInput
                        style={{height: 40, borderColor: '#F0F0F0', borderWidth: 1,backgroundColor:'#fff'}}
                        onChangeText={(address) => this.setState({address})}
                        placeholder={params.canshu.address}
                        underlineColorAndroid={"transparent"}
                        value={this.state.address}
                        />)
                    }
                </View>
            </View>
        );
    }
}
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
const styles = StyleSheet.create({
    ancestorCon: {
        flex: 1,
        backgroundColor: '#F0F1F2',
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
        marginLeft:screenW*0.3,
        marginTop:7,
    },
    infoSave:{
        marginLeft:screenW*0.37,
        marginTop:7,
        color:'red',
    },
    childContent: {//子容器页面级
        flex: 1
        //justifyContent: 'space-between',
    },
});