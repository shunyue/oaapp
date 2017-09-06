/**
 * Created by Administrator on 2017/6/12.
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
    Dimensions,
    TouchableWithoutFeedback,
    TouchableHighlight,
    DeviceEventEmitter
    } from 'react-native';
import Header from '../../common/header';
import config from '../../common/config';
import toast from '../../common/toast';
import request from '../../common/request';
const ScreenW = Dimensions.get('window').width;

export default class departManager extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            high_depart_id: params.high_depart_id?params.high_depart_id:null,
            high_depart_name: params.high_depart_name?params.high_depart_name:params.company_name,
        }
    }
    componentDidMount() {
        //注册监听
        this.firstDepartAndUser = DeviceEventEmitter.addListener('firstDepartAndUser',()=>{this._firstDepartAndUser()})
        this._firstDepartAndUser()

    }

    componentWillUnmount() {
        this.firstDepartAndUser.remove();
    }


    _firstDepartAndUser() {
        var url = config.api.base + config.api.firstDepartAndUser;
        const {params} = this.props.navigation.state;
        request.post(url,{
            company_id: params.company_id,
            depart_id: this.state.high_depart_id
        }).then((result)=> {
            if(result.status == 1) {
                this.setState({
                    userData: result.data.userData,
                    departData: result.data.departData
                })

            }else{
                return Alert.alert(
                    '提示',
                    result.message,
                    [{text: '确定'}]
                )
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }


    addDepart() {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('AddDepart',{high_depart_id: this.state.high_depart_id,high_depart_name: this.state.high_depart_name,company_id: params.company_id});
    }
    addPeople() {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('AddPeople',{high_depart_id: this.state.high_depart_id,high_depart_name: this.state.high_depart_name,company_id: params.company_id,company_name: params.company_name});
    }
    _departSetting() {
        const {params} = this.props.navigation.state;
        if(!this.state.high_depart_id) {
            this.props.navigation.navigate('EnterpriceSetting',{company_id:params.company_id,company_name: params.company_name});
        }else{
            this.props.navigation.navigate('DepartSetting',{high_depart_id: this.state.high_depart_id,high_depart_name: this.state.high_depart_name,company_id: params.company_id,company_name: params.company_name})
        }


    }
    _userMsg(id) {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('UserInfo',{company_id: params.company_id,company_name: params.company_name,user_id: id})
    }
    _nextDepart(depart_id,depart_name) {

        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('DepartManager',{high_depart_id: depart_id,high_depart_name: depart_name,company_id: params.company_id,company_name: params.company_name});
    }
    _search() {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('Search',{company_id: params.company_id,company_name: params.company_name});
    }
    render() {
        //部门信息
        var departData = this.state.departData;
        var departList = [];
        for(var i in departData) {
            departList.push(
                <TouchableHighlight  key={i}
                    onPress={this._nextDepart.bind(this,departData[i].id,departData[i].depart_name)}
                    underlayColor={'#F3F3F3'}>
                    <View style={styles.listRowContent}>
                        <Text>{departData[i].depart_name}</Text>
                        <View style={styles.listRight}>
                            <Text>{departData[i].num}人</Text>
                            <Image
                                style={styles.rightIcon}
                                source={require('../../imgs/jtxr.png')}/>
                        </View>
                    </View>
                </TouchableHighlight>)
        }
        //人员信息
        var userData = this.state.userData;
        var userList = [];
        for(var i in userData) {
            userList.push(
                <TouchableHighlight  key={i}
                     onPress={this._userMsg.bind(this,userData[i].id)}
                     underlayColor={'#F3F3F3'}>
                    <View style={styles.avatarContainer}>
                        <Image style={styles.avatarStyle}
                               source={ userData[i].avatar? {uri: userData[i].avatar}: require('../../imgs/avatar.png')}/>
                        <View>
                            <Text>{userData[i].name}</Text>
                            <View style={styles.positionStyle}>
                                {userData[i].position && <View style={styles.textBorder}>
                                    <Text style={styles.positionText}>{userData[i].position}</Text>
                                </View>}
                                <View style={styles.textBorder}>
                                    <Text style={styles.positionText}>{userData[i].role_name}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            )
        }
        const {params} = this.props.navigation.state;

        return (
            <View style={styles.container}>
                <Header navigation = {this.props.navigation}
                        title = {this.state.high_depart_name}
                        rightText = {params.high_depart_id?"部门设置":"设置"}
                        onPress={()=>this._departSetting()}/>

                <ScrollView style={styles.childContent}>
                    <TouchableWithoutFeedback onPress={()=>this._search()}>
                    <View style={styles.searchInfo}>
                        <Image  style={styles.searchPhoto} source={require('../../imgs/search.png')}/>
                        <Text  style={styles.searchText}>员工姓名/职位/角色</Text>
                    </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.contentContainer}>
                        <View style={styles.topContent}>
                            <TouchableWithoutFeedback onPress={()=>this.addDepart()} >
                                <View style={styles.addContent}>
                                    <Image
                                        style={styles.addImgStyle}
                                        source={require('../../imgs/depart.png')}/>
                                    <Text>添加部门</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>this.addPeople()} >
                                <View style={styles.addContent}>
                                    <Image
                                        style={styles.addImgStyle}
                                        source={require('../../imgs/add_people.png')}/>
                                    <Text>添加员工</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        {departList}
                    </View>
                    <View style={styles.peopleList}>
                        {userList}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    searchInfo:{
        margin: 10,
        backgroundColor:'#f5f5f5',
        borderWidth:1,
        borderColor:'#f0f0f0',
        width:ScreenW-20,
        height:30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        borderRadius:5
    },
    searchPhoto:{
        width:15,
        height:15,
        marginRight:10,
    },
    searchText:{
        fontSize:12,
    },
    contentContainer: {
        backgroundColor: '#fff',
    },
    topContent: {
        flexDirection: 'row',
        paddingTop: 6,
        paddingBottom: 6
    },
    addContent: {
        width: ScreenW*0.5,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ECECEC',
        borderRightWidth: 1,
    },
    addImgStyle: {
        width: 30,
        height: 26,
        tintColor: '#e4393c'
    },
    listRowContent: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderColor: '#F7F8F9',
        borderTopWidth: 1
    },
    listRight: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rightIcon: {
        height: 16,
        width: 16
    },
    peopleList: {
        marginTop: 10,
        backgroundColor: '#fff',
    },
    avatarContainer: {
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: '#F7F8F9',
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 10
    },
    avatarStyle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginRight: 8
    },
    positionStyle: {
        flexDirection: 'row'
    },
    textBorder: {
        marginRight: 6,
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 2,
        paddingRight: 2,
        borderColor: '#7DDBFF',
        borderWidth: 2,
        borderRadius: 2
    },
    positionText: {
        fontSize: 10,

    }

});