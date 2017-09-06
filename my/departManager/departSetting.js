import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    ScrollView,
    TouchableHighlight,
    Alert,
    TextInput,
    Dimensions,
    DeviceEventEmitter
} from 'react-native';
import Header from '../../common/header';
import config from '../../common/config';
import toast from '../../common/toast';
import request from '../../common/request';
const ScreenW = Dimensions.get('window').width;
export default class DepartSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            depart_name: this.props.navigation.state.params.high_depart_name
        }
    }


    componentDidMount() {
        var url = config.api.base + config.api.departSetting;

        const {params} = this.props.navigation.state;
        request.post(url,{
            company_id: params.company_id,
            depart_id: params.high_depart_id
        }).then((result)=> {
            if(result.status == 1) {
                this.setState({
                    high_depart_name: result.data.high_depart.depart_name?result.data.high_depart.depart_name:params.company_name,
                    high_depart_id: result.data.high_depart.depart_id?result.data.high_depart.id:null,
                    leader: result.data.leader
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

        //注册监听
        //选择部门
        this.selectDepart = DeviceEventEmitter.addListener('selectDepart',
            (params)=>{
                this.setState({
                    high_depart_name: params.high_depart_name,
                    high_depart_id: params.high_depart_id
                })
            });


        //注册监听
        //选择人员
        this.choosePeople = DeviceEventEmitter.addListener('choosePeople',
            (params)=>{
                this.setState({
                    leader: params.checkedData,
                })
            });
    }


    componentWillUnmount() {
        this.selectDepart.remove();
        this.choosePeople.remove();
    }

    _selectDepart() {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('SelectDepart',{
            high_depart_name: this.state.high_depart_name,
            high_depart_id: this.state.high_depart_id,
            company_id:params.company_id,
            findCompany: true});
    }
    _complete() {

        var url = config.api.base + config.api.departSettingSave;

        const {params} = this.props.navigation.state;
        request.post(url,{
            company_id: params.company_id,
            depart_id: params.high_depart_id,
            depart_name: this.state.depart_name,
            high_depart: this.state.high_depart_id,
            leader: this.state.leader
        }).then((result)=> {
            if(result.status == 1) {
                toast.center(result.message);
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
        DeviceEventEmitter.emit('firstDepartAndUser');
    }
    _delDepart() {

        return Alert.alert(
            '确定删除该部门？',
            '删除后，此部门的客户将默认归属于父部门',
            [{text: '取消'},{text: '删除', onPress: ()=>{this._delDepartWay()}}]
        )
    }

    _delDepartWay() {
        var url = config.api.base + config.api.delDepart;
        const {params} = this.props.navigation.state;
        request.post(url,{
            company_id: params.company_id,
            depart_id: params.high_depart_id
        }).then((result)=> {
            if(result.status == 1) {
                toast.center(result.message);
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
        DeviceEventEmitter.emit('firstDepartAndUser');
    }
    render() {
        var leader = this.state.leader;
        var leaderList = [];
        for(var i in leader) {
            leaderList.push(
                <View style={styles.listRowContent} key={i}>
                    <Image style={styles.avatarStyle}
                           source={ leader[i].avatar? {uri: leader[i].avatar}: require('../../imgs/avatar.png')}/>
                    <Text style={styles.smallText}>{leader[i].name}</Text>
                </View>
            )
        }

        const {params} = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <Header navigation={this.props.navigation}
                        title="部门设置"
                        rightText="完成"
                        onPress={()=>{this._complete()}}/>
                <ScrollView>
                <View style={styles.companyContent}>
                    <View style={styles.listDepart}>
                        <Text>部门名称</Text>
                        <TextInput
                            placeholder={'请输入企业名称'}
                            underlineColorAndroid={"transparent"}
                            placeholderTextColor ={"#CFCFCF"}
                            style={styles.inputStyle}
                            onChangeText={(depart_name)=>{this.setState({depart_name})}}
                            value={this.state.depart_name}
                        />
                    </View>
                    <TouchableWithoutFeedback onPress={()=>{this._selectDepart()}}>
                        <View style={styles.listDepart}>
                            <Text>所属部门</Text>
                            <View style={styles.rightConent}>
                                <Text>{this.state.high_depart_name}</Text>
                                <Image
                                    style={styles.rightIcon}
                                    source={require('../../imgs/jtxr.png')} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>



                <View style={[styles.manager,{marginTop: 5}]}>
                    <Text>部门负责人</Text>
                    <View style={styles.avatarContainer}>
                        {leaderList}

                        <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('ChoosePeople',{company_id:params.company_id,company_name: params.company_name,userData: this.state.leader})}>
                            <Image source={require('../../imgs/customer/add_c.png')}
                                   style={styles.optionStyle}/>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('ChoosePeople',{company_id:params.company_id,company_name: params.company_name,userData: this.state.leader,subtract: this.state.leader})}>
                            <Image source={require('../../imgs/customer/add_l.png')}
                                   style={styles.optionStyle}/>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <Text style={styles.tipText}>具备该部门数据查看权限</Text>
                </ScrollView>
                <TouchableWithoutFeedback onPress={()=>this._delDepart()}>
                <View style={styles.btnStyle}>
                    <Image style={styles.delImg}
                           source={require('../../imgs/rubbsh.png')} />
                    <Text style={styles.delText}>删除部门</Text>
                </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    listDepart: {
        height: 50,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#F7F8F9',
    },
    inputStyle: {
        width: ScreenW*0.5,
        textAlign: 'right',
    },
    companyContent: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F7F8F9',
    },
    rightConent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rightIcon: {
        height: 16,
        width: 16,
        marginLeft: 4
    },


    companyBottom: {
        height: 50,
        justifyContent: 'center',
        paddingLeft: 10
    },
    smallText: {
        fontSize: 12
    },
    manager: {
        marginTop: 10,
        backgroundColor: '#fff',
        padding: 10
    },
    avatarContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',

    },
    listRowContent: {
        alignItems: 'center'
    },
    avatarStyle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        margin: 5,
    },
    optionStyle: {
        height: 40,
        width: 40,
        tintColor: '#ECECEC',
        margin: 5,
    },
    tipText: {
        fontSize: 12,
        marginLeft: 10,
        marginTop: 5
    },
    btnStyle: {
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#ECECEC',
        borderTopWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    delImg: {
        height: 20,
        width: 20,
        tintColor: 'red'
    },
    delText: {
        color: 'red',
        fontSize: 12
    }
});