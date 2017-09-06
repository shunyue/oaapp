/**
 * Created by Administrator on 2017/6/7.
 * 选择客户
 */
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
    ScrollView,
    TouchableHighlight,
    DeviceEventEmitter,
    Linking
    } from 'react-native';
import { StackNavigator,TabNavigator } from "react-navigation";
import Loading from '../../common/loading';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import moment from 'moment';
import com from '../../public/css/css-com';
var Contacts = require('react-native-contacts');
const screenW = Dimensions.get('window').width;
export default class PhoneContactList extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            contactInfo:[],
            contactArr:[]
        };
    }
    componentDidMount() {
       this.getPhoneContacts();
  }
    //获取全部的手机联系人
    getPhoneContacts(){
        Contacts.getAll((err, contacts) => {
            if(err === 'denied'){
               toast.bottom('没有权限获取通讯录');
                return false;
            } else if(contacts.length==0 || contacts==null){
                this.setState({
                    contactInfo:[],
                })
            } else {
                this.checkcontactInfo(contacts)
            }
        })
    }
    //对获取到的数据进行处理
    checkcontactInfo(contacts){
        this.setState({
            load: true
        })
        let {params} = this.props.navigation.state;
        var url=config.api.base+config.api.checkContactInfo;
        request.post(url,{
            contacts:contacts
        }).then((res)=>{
           this.setState({
                contactInfo:res.data,
                load: false,
            })
        })
        .catch((error)=>{
             toast.bottom('网络连接失败,请检查网络后重试')
         });
    }
    OpBack() {
        this.props.navigation.goBack(null)
    }
    //联系人详情页面
    goPage_ContactInfo(contactInfo){
        let {params}=this.props.navigation.state;
        if(params.choose==true){
            DeviceEventEmitter.emit('ChoosePhoneContact',{
                con_name: contactInfo.name,
                tel: contactInfo.number})
            this.props.navigation.goBack(null);
        }else{
            this.props.navigation.navigate('PhoneContactInfo',{
                contactInfo:contactInfo
            });
        }
    }
    //搜索联系人页面
    goPage_ContactSearch(){
        this.props.navigation.navigate('PhoneContactSearch');
    }
    //调用打电话的接口
    callPhone(number){
        return Linking.openURL('tel:' + number)
    }
    render() {
         if(this.state.load){
             return(
                 <View style={[com.hh9,com.jcc,com.aic]}>
                    <Loading/>
                 </View>
             )
         }
        //如果查到数据
        var contactArr=[];
        var contactList=[];
        if(this.state.contactInfo!="" && this.state.contactInfo !=null){//输入查询客户
            var  contact=this.state.contactInfo;
            for (var i in contact) {
                var contactArr = [];
                for(var j in contact[i]) {
                    contactArr.push(
                        <View  key={j}>
                            <View style={[{backgroundColor:'#fff',justifyContent:'space-between',},styles.flex_row,styles.borderBottom,styles.borderTop]}>
                                <TouchableHighlight underlayColor={'#ccc'}
                                                    onPress={this.goPage_ContactInfo.bind(this,contact[i][j])}>
                                    <View style={[{width:screenW, height: 60,backgroundColor:'#fff',flexDirection:'row',paddingTop:10,paddingBottom:10}]}>
                                        {/* <Image  style={{width:40,height:40,marginLeft:10,marginRight:10}}
                                         source={require('../imgs/customer/headPortrait.png')}/>*/}
                                        {(contact[i][j].hasPic == false) ? (
                                            <Image
                                                style={{width:40,height:40,marginLeft:10,marginRight:10,borderRadius: 200}}
                                                source={require('../../imgs/tx.png')}/>
                                        ) : (<Image
                                            style={{width:40,height:40,marginLeft:10,marginRight:10,borderRadius: 200}}
                                            source={{uri:contact[i][j].picPath}}/>)}
                                        <View>
                                            <Text style={{color:'#333'}}>{contact[i][j].name}</Text>
                                            <Text style={{marginTop:2,fontSize:12}}>{contact[i][j].number}</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                                <View style={{position:'absolute',top:20,right:15}}>
                                    <TouchableHighlight underlayColor={'#fff'}
                                                        onPress={this.callPhone.bind(this,contact[i][j].number)}>
                                        <Image style={{width:20,height:20,tintColor:'#e15151'}}
                                               source={require('../../imgs/customer/phone.png')}/>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    );
                }
                contactList.push(
                    <View key={i}>
                        <View style={styles.departLevel}>
                            <Text style={styles.departText}>{contact[i][0].first_char}</Text>
                        </View>
                        {contactArr}
                    </View>
                )
            }
        }else{//输入查询数据
            contactList.push(
                <View key={0}><Text style={{fontSize: 16,textAlign:'center'}}>没有记录</Text></View>
            );
        }
        //如果查到数据
        {/*     var contactArr=[];
        var contactList=[];
        if(this.state.contactInfo!="" && this.state.contactInfo !=null){//输入查询客户
            var  contact=this.state.contactInfo;
            for (var i in contact) {
                var contactArr = [];
                for(var j in contact[i]) {
                    //alert(JSON.stringify(contact[i][j]))
                    contactArr.push(
                        <View  key={j}>
                            <View style={[{backgroundColor:'#fff',justifyContent:'space-between',paddingLeft:10,paddingRight:10,},
                            styles.flex_row,styles.borderBottom,styles.borderTop]}>
                                <TouchableHighlight
                                    underlayColor={'#ccc'}
                                    onPress={this.goPage_ContactInfo.bind(this,contact[i][j])}>
                                    <View style={[{width:screenW,flexDirection:'row',paddingTop:10,paddingBottom:10}]}>
                                        {/!*<Image  style={{width:40,height:40,marginLeft:10,marginRight:10}}
                                         source={require('../imgs/customer/headPortrait.png')}/>*!/}
                                        <View>
                                            <Text style={{color:'#333'}}>{contact[i][j].con_name}</Text>
                                            <Text style={{marginTop:2,fontSize:12}}>{contact[i][j].cus_name}</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                                <View style={{position:'absolute',top:20,right:15}}>
                                    <Image style={{width:20,height:20}} tintColor={'#e15151'}
                                           source={require('../imgs/customer/phone.png')}/>
                                </View>
                            </View>
                        </View>
                    );
                }
                contactList.push(
                    <View key={i}>
                        <View style={styles.departLevel}>
                            <Text style={styles.departText}>{contact[i][0].first_char}</Text>
                        </View>
                        {contactArr}
                    </View>
                )
            }
        }else{//输入查询数据
            contactList.push(
                <View key={0}><Text style={{fontSize: 16,textAlign:'center'}}>没有记录</Text></View>
            );
        }*/}
        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableOpacity style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.formHeader}>手机通讯录</Text>
                </View>

                <TouchableHighlight underlayColor={'transparent'} onPress={()=>{this.goPage_ContactSearch()}}>
                    <View style={[styles.search,styles.margin,styles.flex_row]}>
                        <Image style={styles.subNav_img} source={require('../../imgs/customer/search.png')}/>
                        <Text>搜索</Text>
                    </View>
                </TouchableHighlight>
                {/*  <TouchableHighlight underlayColor={'transparent'} onPress={()=>{this.goPage_UserSearch()}}>
                 <View style={[styles.search,styles.margin,styles.flex_row]}>
                 <Image style={{width:15,height:15,marginRight:7}} source={require('../imgs/customer/search.png')}/>
                 <Text>搜索</Text>
                 </View>
                 </TouchableHighlight>*/}
                <ScrollView>
                    {contactList}
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
        borderBottomWidth: 1,
        borderBottomColor:'#bbb',
        justifyContent:'center',

    },
    go:{
        position:'absolute',
        top:8
    },
    goback:{
        left:15,
        flexDirection :'row',
    },
    goRight:{
        right:20
    },
    back_icon:{
        width:10,
        height:17,
        marginTop: 3
    },
    back_text:{
        color:'#e15151',
        fontSize: 16,
        marginLeft:2
    },
    formHeader:{
        fontSize:16
    },
    sure:{
        fontSize:16
    },
    search:{
        width:screenW*0.95,
        height:30,
        backgroundColor:'#fff',
        justifyContent:'center',
        margin:screenW*0.02,
        borderRadius:7,
    },
    subNav_img:{
        width:15,
        height:15,

        marginLeft:6,
        marginRight:4
    },
    subNav_img2:{
        width:25,
        height:25,
        marginLeft:6,
        marginRight:4
    },
    input_text:{
        width:screenW*0.7,
        height:28,
        padding:0,
    },
    borderBottom:{
        borderBottomWidth:0.5,
        borderColor:'#ccc'
    },
    borderTop:{
        borderTopWidth:0.5,
        borderColor:'#ccc'
    },
    flex_row :{
        flexDirection:'row',
        alignItems:'center',
    },
    departLevel: {
        flexDirection: 'row',
        alignItems: 'center',
        padding:3,
        paddingLeft:6
    },
    departText: {
        fontSize: 14,
        marginLeft: 10
    },

});