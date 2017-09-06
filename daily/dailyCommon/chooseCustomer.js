import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    TextInput,
    DeviceEventEmitter
    }from 'react-native';
import {StackNavigator,TabNavigator } from "react-navigation";
import Loading from '../../common/loading';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import moment from 'moment';
import com from '../../public/css/css-com';
const screenW = Dimensions.get('window').width;
export default class ChooseCustomer extends Component {
    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state = {
            text:'',
            name:'',
            cusInfo:[],
            load:true,
            selectId:params.customer
        };
    }
    componentDidMount() {
       // this.getSelectId();
        this._searchCus(1);
    }
    OpBack(cusData) {//回到上一页面
        //准备一个值
        DeviceEventEmitter.emit('cusData',cusData); //发监听
        this.props.navigation.goBack(null);
    }
    submitCus(cusData){
        this.setState({
            selectId:cusData.id
        })
        this.OpBack(cusData);
    }
    //搜索全部人员
    _searchCus(title,customer=""){
        let {params} = this.props.navigation.state;
        var url=config.api.base+config.api.searchCustomer;
            request.post(url,{
                name:customer,
                title: title,
                company_id:params.company_id,
                user_id:params.user_id,
            }).then((res)=>{
                this.setState({
                    load: false,
                    cusInfo:res.data
                })
            })
            .catch((error)=>{
                toast.bottom('网络连接失败,请检查网络后重试')
            });
    }
    render() {
        //加载过程
        if(this.state.load) {
            return (
                <Loading/>
            )
        }
        let {params} = this.props.navigation.state;
        //如果查到数据
        var cusArr=[];
        if(this.state.cusInfo!="" || this.state.cusInfo !=null){//输入查询客户
            var  customer=this.state.cusInfo;
            //alert(JSON.stringify(this.state.selectInfo))
            for (var i = 0; i <customer.length; i++) {
                cusArr.push(
                    <View  key={i}>
                    <TouchableOpacity onPress={this.submitCus.bind(this,customer[i])}>
                    <View style={[styles.linerow,styles.topbottom]} >

                            <View style={styles.name}>
                                <Text>{customer[i].cus_name}</Text>
                            </View>
                        {(this.state.selectId==customer[i].id)?(<Image style={[styles.row_img]}  source={require('../../imgs/daily/true.png')}/>
                        ):(null)}
                    </View>
                    </TouchableOpacity>
                    </View>
                );
            }
        }else if(this.state.cusInfo=="" || this.state.customer!=""){//输入查询数据
            cusArr.push(
                <View style={[com.jcc,com.aic]} key={0}>
                    <View style={[com.jcc,com.aic]}>
                        <Image style={[com.wh64]} source={require('../../imgs/noContent.png')}/>
                        <Text style={{fontSize: 16,textAlign:'center'}}>暂无内容</Text>
                    </View>
                </View>
            );
        }else{
             cusArr=[];
        }
        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableOpacity style={[styles.goback,styles.go]} onPress={()=>this.OpBack(this.state.selectInfo)}>
                        <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.formHeader}>选择客户</Text>
                    <TouchableOpacity style={[styles.goRight,styles.go]} onPress={()=>this.goPage_choseCustomer()}>
                        <Text  style={styles.sure}>新增客户</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.search_bj}>
                    <View style={styles.search_border}>
                        <Image style={styles.subNav_img} source={require('../../imgs/customer/search.png')}/>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={(customer) =>{this.setState({customer});this._searchCus(2,customer)}}
                            placeholder ={'搜索'}
                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"
                            autoFocus={false}
                            value={this.state.customer}
                            />
                    </View>
                    <TouchableOpacity
                        style={{height:40,justifyContent:'center',marginLeft:10}}
                        onPress={()=>this.setState({customer:""})}
                        >
                        <Text>取消</Text>
                    </TouchableOpacity>
                </View>
                {cusArr}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#F0F1F2',
    },
    container: {
        height: 40,
        flexDirection :'row',
        alignItems:'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor:'#bbb',
        justifyContent:'center',

    },
    go:{
        position:'absolute',
        top:8
    },
    goback:{
        left:20,
        flexDirection :'row',
    },
    goRight:{
        right:20
    },
    back_icon:{
        width:10,
        height:17,
        marginLeft:5,
        marginTop: 3
    },
    back_text:{
        color:'#e15151',
        fontSize: 16,
        marginLeft:6
    },
    formHeader:{
        fontSize:16
    },
    sure:{
        fontSize:16
    },
    search_bj:{
        backgroundColor:'#ddd',
        height:50,
        width:screenW,
        flexDirection :'row',
    },
    search_border:{
        width:screenW*0.85,
        height:28,
        backgroundColor:'#fff',
        marginLeft:9,
        marginTop:8,
        borderRadius:5,
        flexDirection:'row',
        alignContent:'center',
    },
    subNav_img:{
        width:15,
        height:15,
        marginTop:7,
        marginLeft:6,
        marginRight:4
    },
    subNav_img2:{
        width:25,
        height:25,
        marginTop:7,
        marginLeft:6,
        marginRight:4
    },
    input_text:{
        width:screenW*0.6,
        height:30,
        padding:0,
    },
    linerow: {
        height: 40,
        flexDirection :'row',
        alignItems:'center',
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderBottomColor:'#bbb',
        justifyContent:'space-between',
        paddingLeft:screenW*0.03,
        paddingRight:screenW*0.05
    },
    name:{
        marginLeft:10,
    },
    topbottom:{
        borderTopWidth: 0.05,
        borderTopColor:'#bbb'
    },
    row_img:{
        width:15,
        height:15,
    },

});