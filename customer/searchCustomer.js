
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    Dimensions,
    ScrollView,
    TouchableWithoutFeedback,
    TouchableHighlight,
    TouchableOpacity,
    DeviceEventEmitter,
    Alert,
    Platform
} from 'react-native';
import config from '../common/config';
import toast from '../common/toast';
import request from '../common/request';
const ScreenW = Dimensions.get('window').width;

export default class UserInfo  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerData: null,
            cus_name: '',
        }
    }

    _searchPeople() {
        if(!this.state.cus_name) {
            return ;
        }
        alert(this.state.cus_name)
        const {params} = this.props.navigation.state;
        var url = config.api.base + config.api.searchCustomerMsg;
        request.post(url,{
            user_id: params.user_id,
            cus_name: this.state.cus_name,
        }).then((result)=> {
            if(result.status == 1) {
                this.setState({
                    customerData: result.data
                })
            }else{
                return this.setState({
                    customerData: null
                })
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }

    _customerDetail(data) {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('CustomerDetail',{customer:data,user_id:params.user_id,company_id: params.company_id});
    }

    render() {
        var customerData = this.state.customerData;
        var customerList = [];
        for(var i in customerData) {
            customerList.push(
                <TouchableHighlight key={i} underlayColor={'#F3F3F3'}
                                    onPress={this._customerDetail.bind(this,customerData[i]) }  >
                    <View style={styles.newMessage_content}>
                        <View style={[styles.newMessage_customer,styles.newMessage_customer_sty]}>
                            <Text style={{fontSize:14,color:'#000'}}>{customerData[i].cus_name}</Text>
                            <Text style={{color:'#e15151'}}>{customerData[i].classify?customerData[i].classify+"级":"未分类"}</Text>
                        </View>
                        <View style={[styles.newMessage_customer,styles.newMessage_customer_sty]}>
                            <View style={[styles.newMessage_customer,]}>
                                <Image style={{width:16,height:16,marginRight:5}} source={require('../imgs/customer/customer.png')}/>
                                <Text>{customerData[i].provice?customerData[i].provice+customerData[i].city+customerData[i].district: "未填写地址"}</Text>
                            </View>
                        </View>
                        <View style={[styles.newMessage_customer]}>
                            <Image style={{width:15,height:15,marginRight:5}} source={require('../imgs/customer/person.png')}/>
                            <Text numberOfLines={1} style={{fontSize:12,width: ScreenW*0.7}}>{customerData[i].user_name}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            )
        }

        return(
            <View style={styles.container}>
                {Platform.OS === 'ios'? <View style={{height: 20,backgroundColor: '#fff'}}></View>:null}
                <View style={styles.headerStyle}>
                    <TouchableOpacity onPress={()=>this.props.navigation.goBack(null)}>
                        <View style={styles.imgContainer}>
                            <Image source={require('../imgs/navxy.png')}
                                   style={styles.leftIcon}/>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.inputContainer}>
                        <Image source={require('../imgs/search.png')}
                               style={styles.searchIcon}/>
                        <TextInput
                            placeholder={'搜索员工'}
                            underlineColorAndroid={"transparent"}
                            placeholderTextColor ={"#A2A2A2"}
                            onChangeText={(t)=>{this.setState({cus_name: t})}}
                            style={styles.inputStyle}
                        />
                    </View>
                    <TouchableOpacity activeOpacity={0.7} onPress={()=>this._searchPeople()}>
                        <View style={styles.textContainer}>
                            <Text style={styles.searchText}>搜索</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {!this.state.customerData?
                    <View style={styles.searchTip}>
                        <View style={styles.topContent}>
                            <Text style={{color: '#C1C0C1'}}>---- 搜索更多内容 ----</Text>
                        </View>
                        <View style={styles.searchCondition}>
                            <View style={{height: 40,width: 40,borderRadius: 20,borderColor: '#C1C0C1',borderWidth:1,justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <Image style={{height: 30,width: 30,tintColor:'#C1C0C1'}}
                                source={require('../imgs/tabbar/my.png')}/>
                            </View>
                        </View>
                    </View> :
                    <View style={styles.searchInfo}>
                        {customerList}
                    </View>
                }

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    headerStyle: {
        paddingRight: 10,
        height: 40,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderColor: '#CFCFCF',
        borderBottomWidth: 1
    },
    imgContainer: {
        width: 30,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    leftIcon: {
        width: 16,
        height: 16
    },
    searchIcon: {
        width: 14,
        height: 14,
        tintColor: '#A2A2A2'
    },
    inputContainer: {
        paddingLeft: 8,
        flexDirection: 'row',
        alignItems: 'center',
        width: ScreenW*0.7,
        backgroundColor: '#E0E0E0',
        borderRadius: 4
    },
    inputStyle: {
        width: ScreenW*0.66,
        height: 26,
        paddingTop: 0,
        paddingBottom: 0,

    },
    textContainer: {
        width: 40,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e4393c',
        borderRadius: 4
    },
    searchText: {
        color: '#fff'
    },
    searchTip: {
        flex: 1,
        backgroundColor: '#fff'
    },
    topContent: {
        marginTop: 20,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchCondition: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    conditionText: {
        color: 'red',
        width: ScreenW/3,
        textAlign: 'center',
        borderColor: '#F7F8F9',
        borderRightWidth: 1
    },
    searchInfo: {
        borderWidth: 1,
        borderColor: '#F7F8F9',
        backgroundColor: '#fff'
    },
    newMessage_content:{
        borderColor:'#e3e3e3',
        borderBottomWidth:1,
        height:100,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'center'
    },
    newMessage_customer:{
        flexDirection:'row',
        alignItems:'center',
        height:22,
    },
    newMessage_customer_sty:{
        justifyContent:'space-between',
    },
});