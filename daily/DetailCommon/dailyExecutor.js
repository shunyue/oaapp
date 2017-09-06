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
    DeviceEventEmitter,
    ScrollView
    }from 'react-native';
import {StackNavigator,TabNavigator } from "react-navigation";
import Loading from '../../common/loading';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import moment from 'moment';
import com from '../../public/css/css-com';
const screenW = Dimensions.get('window').width;
export default class DailyExecutor extends Component {
    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state = {
            text:'',
            name:'',
            createrInfo:[],
            executorInfo:[],
            load:true
          //  selectId:params.customer
        };
    }
    componentDidMount() {
        this._searchExecutor(3);
    }
    OpBack() {//回到上一页面
        this.props.navigation.goBack(null);
    }
    //跳转到人员详情页面
    goPagUserDetail(id,company_id){
        alert(company_id);
        //this.props.navigation.navigate('UserDetail',{user_id:id,company_id:company_id})
    }

    //搜索人员信息
    _searchExecutor(title,name=""){
        let {params} = this.props.navigation.state;
        var url=config.api.base+config.api.searchExecutor;
        var s = params.executor;
        var  executor = s.split(",");// 在每个逗号(,)处进行分解。
            request.post(url,{
                title:title,
                users:executor,
                user:params.creater,
                name:name
            }).then((res)=>{
             var  createrInfo=res.data.creater;
             var  executorInfo=res.data.executor;
               this.setState({
                    load:false,
                    executorInfo:executorInfo,
                    createrInfo:createrInfo
                });
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
        var executorArr=[];
        if(this.state.executorInfo !="" && this.state.executorInfo !=null){//输入查询客户
            var  executor=this.state.executorInfo;
            //alert(JSON.stringify(this.state.selectInfo))
            for (var i = 0; i <executor.length; i++) {
                executorArr.push(
                    <View  key={i}>
                    <TouchableOpacity onPress={this.goPagUserDetail.bind(this,executor[i].id,executor[i].company_id)}>
                    <View style={[styles.linerow]} >
                            <View style={[styles.name,styles.flexRow]}>
                                {(executor[i].avatar==""||executor[i].avatar==null)?(
                                    <Image style={[{tintColor: 'purple',width: 32, height: 32},com.br200,com.mgr5]} source={require('../../imgs/tx.png')}/>
                                ):(<Image style={[{width: 32, height: 32},com.br200,com.mgr5]} source={{uri:executor[i].avatar}}/>)}
                                <Text>{executor[i].name}</Text>
                            </View>
                            <View style={styles.name}>
                                <Text>{executor[i].depart_name}</Text>
                            </View>
                    </View>
                    </TouchableOpacity>
                    </View>
                );
            }
        }else if(this.state.executorInfo ==""){//输入查询数据
            executorArr.push(
                <View style={[com.jcc,com.aic,com.bgce6]} key={0}>
                    <View style={[com.jcc,com.aic,com.bgce6]}>
                        <Image style={[com.wh64]} source={require('../../imgs/noContent.png')}/>
                        <Text>没有查到客户</Text>
                    </View>
                </View>
            );
        }else{
            executorArr=[];
        }

        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableOpacity style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.formHeader}>人员</Text>
                </View>
                {/* <View style={styles.search_bj}>
                    <View style={styles.search_border}>
                        <Image style={styles.subNav_img} source={require('../../imgs/customer/search.png')}/>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={(name) =>{this.setState({name:name});this._searchExecutor(4,name);}}
                            placeholder ={'搜索'}
                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"
                            autoFocus={false}
                            value={this.state.name}
                            />
                    </View>
                    <TouchableOpacity
                        style={{height:40,justifyContent:'center',marginLeft:10}}
                        onPress={()=>this.setState({customer:""})}
                        >
                        <Text>取消</Text>
                    </TouchableOpacity>
                </View>*/}
                <ScrollView>
                 <View>
                    <View style={[styles.linerow]}><Text>创建人</Text></View>
                    <TouchableOpacity onPress={this.goPagUserDetail.bind(this,this.state.createrInfo.id)}>
                        <View style={[styles.linerow]} >
                            <View style={[styles.name,styles.flexRow]}>
                                {(this.state.createrInfo.avatar==""||this.state.createrInfo.avatar==null)?(
                                    <Image style={[{tintColor: 'purple',width: 32, height: 32},com.br200,com.mgr5]} source={require('../../imgs/tx.png')}/>
                                ):(<Image style={[{width: 32, height: 32},com.br200,com.mgr5]} source={{uri:this.state.createrInfo.avatar}}/>)}
                                <Text>{this.state.createrInfo.name}</Text>
                            </View>
                            <View style={styles.name}>
                                <Text>{this.state.createrInfo.depart_name}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View>
                    <View style={[styles.linerow]}><Text>执行人</Text></View>
                    {executorArr}
                </View>
                </ScrollView>
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
        borderBottomWidth: 0.5,
        borderBottomColor:'#bbb',
        justifyContent:'center',

    },
    flexRow:{
        flexDirection :'row',
    },
    go:{
        position:'absolute',
        top:8
    },
    goback:{
        left:10,
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
    //topbottom:{
    //    borderTopWidth: 0.5,
    //    borderTopColor:'#bbb'
    //},
    row_img:{
        width:15,
        height:15,
    },

});