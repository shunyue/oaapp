/**
 * Created by Administrator on 2017/7/3.
 */
/**
 * Created by Administrator on 2017/7/3.
 */
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
    Dimensions,
    TouchableOpacity
    } from 'react-native';
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';
import Header from '../common/header';
export default class accountsafe extends Component {
    OpBack() {
        this.props.navigation.goBack('AccountSafe')
        //this.props.navigation.navigate('Mine', {id:this.props.navigation.state.params.id});
    }
    constructor(props) {
        super(props);
        this.state={
            //底部选择项 默认不显示
            show: false,
            id:"",
            tel:"",
        };
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
                tel:responseJson.tel,
            })

        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }
    tel(){
        let data={
            userid:this.state.id,
            tel:this.state.tel,
        }
        this.props.navigation.navigate('TelSafe',{canshu:data})
    }
    password(){
        this.props.navigation.navigate('ModifyPassword',{id:this.state.id}) ;
    }
    render() {
        return (
            <View style={styles.ancestorCon}>
                <Header navigation = {this.props.navigation}
                        title = "账号与安全"
                        onPress={()=>this.OpBack()}/>
                <ScrollView style={styles.childContent}>
                    <View style={[styles.border_top,{marginTop:8}]}>
                        <TouchableOpacity
                            onPress={()=>this.tel()}
                            >
                            <View style={[styles.flexRow,styles.padding,styles.border_bottom,{justifyContent:'space-between',height:35}]}>
                                <Text style={{fontSize:15,color:'#333'}} >手机账号</Text>
                                <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={()=>this.password()}
                        >
                        <View style={[styles.border_top,{marginTop:8}]}>
                            <View style={[styles.flexRow,styles.padding,styles.border_bottom,{justifyContent:'space-between',height:35}]}>
                                <Text style={{fontSize:15,color:'#333'}} >修改登录密码</Text>
                                <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
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
    flexRow:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
    },
    flexRow_width:{
        width:screenW*0.25,
        justifyContent:'center',
        alignItems:'center'
    },
    padding:{
        paddingLeft:15,
        paddingRight:15
    },
    border_top:{
        borderTopWidth:1,
        borderColor:'#e8e8e8'
    },
    border_bottom:{
        borderBottomWidth:1,
        borderColor:'#e8e8e8'
    },
});