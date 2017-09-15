/**
 * Created by Administrator on 2017/7/12.
 */
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
    Switch,
    Dimensions,
    TextInput,
    TouchableOpacity,
    Alert,
    DeviceEventEmitter
    } from 'react-native';
const ScreenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import ImagePicker from 'react-native-image-picker';
import CheckBox from 'react-native-check-box';
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';
import Header from '../common/header';
export default class ChooseStaffs extends Component {
    back() {
        this.props.navigation.goBack('ChooseStaffs');
    }
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state
        // 初始状态
        this.state = {
            value: false,
            text: '',
            checkBoxData: [],
            checkedData: [],
            high_depart_id: params.high_depart_id?params.high_depart_id:null,
            high_depart_name: params.high_depart_name?params.high_depart_name:params.company_name,
        };
    }

    componentDidMount() {
        var url = config.api.base + config.api.firstDepartAndUser;
        const {params} = this.props.navigation.state;
        request.post(url,{
            company_id: params.companyid,
            company_name:params.company_name,
            depart_id: this.state.high_depart_id
        }).then((result)=> {
            if(result.status == 1) {
                this.setState({
                    userData: result.data.userData,//部门信息
                    departData: result.data.departData,//人员信息
                    routeName: result.data.routeName,
                    departNum: result.data.departData.length
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
    _nextDepart(depart_id,depart_name) {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('ChooseStaffs',{
            depart_id :params.depart_id,
            depart_name :params.depart_name,
            high_depart_id: depart_id,
            high_depart_name: depart_name,
            companyid: params.companyid,
            company_name: params.company_name});
    }


    _pressUser(id) {
        this.state.checkBoxData[id-(-this.state.departNum)].onClick()
    }

    chooseRangeSubmit() {
        for (var i = 0; i < this.state.checkBoxData.length; i++) {
            if (this.state.checkBoxData[i] != null && this.state.checkBoxData[i].state.isChecked == true) {
                this.state.checkedData.push(this.state.checkBoxData[i].props.value);
            }
        }
        DeviceEventEmitter.emit('staffs',this.state.checkedData);
        this.props.navigation.goBack('ChooseStaffs');
    }

    initCheckBoxData(checkbox){
        if(checkbox!=null){
            this.state.checkBoxData.push(checkbox);
        }

    }

    _selectAll() {
        if (this.selectAll.state.isChecked == false) {
            for (var i = 0; i < this.state.checkBoxData.length; i++) {
                if (this.state.checkBoxData[i] != null && this.state.checkBoxData[i].state.isChecked == false) {
                    this.state.checkBoxData[i].onClick();
                }
            }
        } else {
            for (var i = 0; i < this.state.checkBoxData.length; i++) {
                if (this.state.checkBoxData[i] != null && this.state.checkBoxData[i].state.isChecked == true) {
                    this.state.checkBoxData[i].onClick();
                }
            }
        }
    }

    render() {
        //部门信息
        var departData = this.state.departData;
        var departList = [];
        for(var i in departData) {
            departList.push(
                <TouchableHighlight key={i}
                                    onPress={this._nextDepart.bind(this,departData[i].id,departData[i].depart_name)}
                                    underlayColor={'transparent'}>
                    <View style={styles.listRowContent}>
                        <View style={styles.listRowSide}>
                            <CheckBox
                                ref={(c)=>this.initCheckBoxData(c)}
                                style={styles.checkStyle}
                                onClick={()=>{}}
                                value={departData[i]}
                                isChecked={false}
                                checkedImage={<Image source={require('../imgs/selectnone.png')}/>}
                                unCheckedImage={<Image source={require('../imgs/select.png')}/>}
                                />
                            <Text>{departData[i].depart_name}</Text>
                        </View>
                        <View style={styles.listRowSide}>
                            <Text>{departData[i].num}人</Text>
                            <Image style={styles.rightIcon}
                                   source={require('../imgs/jtxr.png')}/>
                        </View>
                    </View>
                </TouchableHighlight>
            )
        }
        //人员信息
        var userData = this.state.userData;
        var userList = [];
        for(var i in userData) {
            userList.push(
                <TouchableHighlight key={i}
                                    onPress={this._pressUser.bind(this,i)}
                                    underlayColor={'transparent'}>
                    <View style={styles.listRowContent}>
                        <View style={styles.listRowSide}>
                            <CheckBox
                                ref={(c)=>this.initCheckBoxData(c)}
                                style={styles.checkStyle}
                                onClick={()=>{}}
                                value={userData[i]}
                                isChecked={false}
                                checkedImage={<Image source={require('../imgs/selectnone.png')}/>}
                                unCheckedImage={<Image source={require('../imgs/select.png')}/>}
                                />
                            <Image source={ userData[i].avatar? {uri: userData[i].avatar} : require('../imgs/avatar.png')}
                                   style={styles.avatarStyle}/>
                            <Text>{userData[i].name}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            )
        }
        var routeName = this.state.routeName;
        var routeList = [];
        for(var i in routeName) {
            routeList.push(
                <View key={i} style={styles.routeList}>
                    <Text style={styles.departText}>{routeName[i]}</Text>
                    {routeName[i-(-1)] && <Image style={styles.rightIcon}
                                                 source={require('../imgs/jtxr.png')}/>}
                </View>
            )
        }
        const {params} = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <Header navigation = {this.props.navigation}
                        title = {"选择员工"}/>
                <ScrollView>
                    <View style={styles.departLevel}>
                        {routeList}
                    </View>
                    <View style={[styles.contentContainer,departList[0]?null:{borderBottomWidth: 0}]}>
                        {(departList[0] || userList[0]) &&
                        <View style={styles.listRowContent}>
                            <View style={styles.listRowSide}>
                                <CheckBox
                                    ref={(c)=>this.selectAll = c}
                                    style={styles.checkStyle}
                                    onClick={()=>{this._selectAll()}}
                                    isChecked={false}
                                    checkedImage={<Image source={require('../imgs/selectnone.png')}/>}
                                    unCheckedImage={<Image source={require('../imgs/select.png')}/>}
                                    />
                                <Text>全选</Text>
                            </View>
                        </View>}
                        {departList}
                    </View>
                    <View style={[styles.contentContainer,{marginTop: 10},userList[0]?null:{borderWidth: 0}]}>
                        {userList}
                    </View>
                </ScrollView>
                <View style={styles.bottomContent}>
                    <TouchableOpacity
                        style={styles.btnStyle}
                        onPress={()=>this.chooseRangeSubmit()}>
                        <Text style={styles.btnText}>确定</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    centerContent: {
        height: 40,
        justifyContent: 'center' ,
        alignItems: 'center',
        backgroundColor: '#EFEFEF'
    },
    searchContainer: {
        backgroundColor: '#fff',
        width: ScreenW*0.94,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 4
    },
    searchImg: {
        marginLeft: 6,
        marginRight: 6,
        height: 16,
        width: 16
    },
    inputStyle: {
        paddingTop: 0,
        paddingBottom: 0,
        width: ScreenW*0.76,
        height: 30
    },
    departLevel: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,

    },

    routeList: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightIcon: {
        height: 16,
        width: 16,
        margin: 4
    },
    departText: {
        fontSize: 12
    },

    contentContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ECECEC',
    },
    listRowContent: {
        marginLeft: 10,
        marginRight: 10,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#F7F8F9'
    },
    checkStyle: {
        width: 50,
        height: 50,
        padding: 14
    },
    listRowSide: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatarStyle: {
        height: 40,
        width: 40,
        marginRight: 10,
        borderRadius: 20
    },
    bottomContent: {
        paddingLeft: 10,
        paddingRight: 10,
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#ECECEC',
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    selected:{
        height: 36,
        //  borderColor: '#ECECEC',
        //  borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    selectedRow:{
        width: ScreenW*0.12,
        backgroundColor: '#F8F8F8',
        borderColor: '#ECECEC',
        borderWidth: 1,
        flexDirection: 'row',
        marginLeft: ScreenW*0.01,
        justifyContent: 'center',
    },
    textBorder: {
        padding: 4,
        borderColor: '#ECECEC',
        borderWidth: 1,
        borderRadius: 4
    },
    btnStyle: {
        width: 70,
        padding: 2,
        backgroundColor: '#e4393c',
        alignItems: 'center',
        borderRadius: 2,
        justifyContent: 'flex-end',
    },
    btnText: {
        color: '#fff'
    },


});