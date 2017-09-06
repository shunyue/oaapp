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
    } from 'react-native';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import com from '../../public/css/css-com';
import Modal from 'react-native-modal';
import wds from '../../public/css/css-window-single';
import Loading from '../../common/loading';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
//import Contacts from 'react-native-contacts';
var Contacts = require('react-native-contacts');
export default class PhoneContactSearch extends Component {
    back() {
        this.props.navigation.goBack(null);
    }
    constructor(props){
        super(props);
        // 初始状态
        this.state = {
            value: false,
            text: '',
            search:"",
            contactInfo:[]
        };
    }
    getPhoneByFilter(search){
        Contacts.getContactsMatchingString(search,(err, contacts) => {
            if(err === 'denied'){
                toast.bottom('没有权限获取通讯录');
                return false;
            }else if(contacts.length==0 || contacts==null){
                this.setState({
                    contactInfo:[],
                })
            }else {
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
    goPage_ContactInfo(contact){
        this.props.navigation.navigate('PhoneContactInfo',{
            contactInfo:contact
        });
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
                                    <View style={[{width:screenW,flexDirection:'row',paddingTop:10,paddingBottom:10}]}>
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
        return (
            <View style={[com.flex]}>
                <View style={[com.bckfff,com.row,com.aic,com.pdt5l10,com.bbwe9,]}>
                   <View style={[com.ROW,com.AIC,com.bcke6,com.PD5,com.BR,com.mgr10]}>
                        <Image
                            style={[com.wh16,]} source={require('../../imgs/search.png')}/>
                        <TextInput
                            style={[com.FS12,com.PDB0,com.PDT0,{height: 19,width:screenW*0.75,}]}
                            underlineColorAndroid={'transparent'}
                            placeholder='搜索手机联系人'
                            placeholderTextColor='#bebebe'
                            secureTextEntry={false}
                            onChangeText={(search) =>{this.setState({search});this.getPhoneByFilter(search)}}
                            value={this.state.search}
                            />
                    </View>
                    <TouchableHighlight
                        onPress={()=>this.back()}
                        underlayColor="#fff"
                        >
                        <Text style={[com.cbe]}>取消</Text>
                    </TouchableHighlight>
                </View>
                {/*内容主题*/}
                {this.state.search == "" ? (
                    <View style={[com.aic,com.hh9,{marginTop:50}]}>
                        <View style={[com.row,com.mgb15]}>
                            <Text style={[com.cbe,com.ft5]}>______</Text>
                            <Text style={[com.cbe,com.mglr10]}>搜索内容</Text>
                            <Text style={[com.cbe,com.ft5]}>______</Text>
                        </View>
                        <View style={[com.row,com.ww5,com.aic,com.jcc]}>
                            <View style={[com.aic,com.mglr15]}>
                                <Image style={[com.wh32,com.tcccc,{marginBottom:5}]} source={require('../../imgs/yg.png')}/>
                                <Text>联系人</Text>
                            </View>
                            <View style={[com.aic,com.mglr10]}>
                                <Image style={[com.wh32,com.tcccc,{marginBottom:5}]} source={require('../../imgs/telephone.png')}/>
                                <Text>电话</Text>
                            </View>
                        </View>
                    </View>) : ( <View style={[com.ww]}>
                        <View style={[com.bbwc,com.pdb10]}>
                            <View style={[com.bgcfff]}>
                                    {contactList}
                            </View>
                      </View>
                </View>)}
            </View>
        );
    }
}
const styles = StyleSheet.create({
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
        paddingLeft: 6,
    },
    departText: {
        fontSize: 14,
        marginLeft: 10
    },
});


