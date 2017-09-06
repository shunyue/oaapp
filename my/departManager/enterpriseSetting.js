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
    DeviceEventEmitter
} from 'react-native';
import Header from '../../common/header';
import config from '../../common/config';
import toast from '../../common/toast';
import request from '../../common/request';

export default class EnterPriseSetting extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            company_name: params.company_name
        }
    }
    componentDidMount() {
        var url = config.api.base + config.api.companySetting;
        const {params} = this.props.navigation.state;
        request.post(url,{
            company_id: params.company_id,

        }).then((result)=> {
            if(result.status == 1) {
                this.setState({
                    create_date: result.data.date,
                    company_num: result.data.num,
                    createDate: result.data.date,
                    manager: result.data.manager,
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
        this.choosePeople = DeviceEventEmitter.addListener('choosePeople',
            (params)=>{
                if(params.type == 'manager'){
                    this.setState({
                        manager: params.checkedData,
                    })
                }else if(params.type == 'leader') {
                    this.setState({
                        leader: params.checkedData,
                    })
                }

            });


        this.companyName = DeviceEventEmitter.addListener('companyName',
            (e)=>{
                this.setState({
                    company_name: e
                })
            }
        )
    }

    componentWillUnmount() {
        this.choosePeople.remove();
        this.companyName.remove();
    }
    _complete() {

        var url = config.api.base + config.api.companySettingSave;
        const {params} = this.props.navigation.state;
        request.post(url,{
            company_id: params.company_id,
            company_name: this.state.company_name,
            manager: this.state.manager,
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

    }

    render() {
        var manager = this.state.manager;
        var managerList = [];
        for(var i in manager) {
            managerList.push(
                <View style={styles.listRowContent} key={i}>
                    <Image style={styles.avatarStyle}
                       source={ manager[i].avatar? {uri: manager[i].avatar} : require('../../imgs/avatar.png')}/>
                    <Text style={styles.smallText}>{manager[i].name}</Text>
                </View>
            )
        }

        var leader = this.state.leader;
        var leaderList = [];

        for(var i in leader) {
            leaderList.push(
                <View style={styles.listRowContent}  key={i}>
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
                        title="企业设置"
                        rightText="完成"
                        onPress={()=>{this._complete()}}/>
                <ScrollView>
                    <View style={styles.companyContent}>
                        <TouchableHighlight
                            underlayColor={'#F3F3F3'}
                            onPress={()=>{this.props.navigation.navigate('CompanyName',{company_id:params.company_id,company_name: this.state.company_name})}}
                        >
                            <View style={styles.companyTop}>
                                <View style={styles.companyLeft}>
                                    <View style={styles.companyContainer}>
                                        <Image style={styles.companyImg}
                                           source={require('../../imgs/customer.png')}/>
                                    </View>
                                    <Text>{this.state.company_name}</Text>
                                </View>
                                <Image style={styles.rightIcon}
                                       source={require('../../imgs/jtxr.png')}/>
                            </View>
                        </TouchableHighlight>
                        <View style={styles.companyBottom}>
                            <Text style={styles.smallText}>企业人数：{this.state.company_num}人</Text>
                            <Text style={styles.smallText}>创建时间：{this.state.create_date}</Text>
                        </View>
                    </View>

                    <View style={styles.manager}>
                        <Text>企业管理员</Text>
                        <View style={styles.avatarContainer}>
                            {managerList}
                            <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('ChoosePeople',{company_id:params.company_id,company_name: params.company_name,userData: this.state.manager,type: 'manager'})}>
                                <Image source={require('../../imgs/add32.png')}
                                       style={styles.optionStyle}/>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('ChoosePeople',{company_id:params.company_id,company_name: params.company_name,userData: this.state.manager,type: 'manager',subtract: this.state.manager})}>
                                <Image source={require('../../imgs/subtract.png')}
                                       style={styles.optionStyle}/>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <Text style={styles.tipText}>企业管理员具备该企业最高设置权限</Text>


                    <View style={[styles.manager,{marginTop: 5}]}>
                        <Text>企业负责人</Text>
                        <View style={styles.avatarContainer}>
                            {leaderList}
                            <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('ChoosePeople',{company_id:params.company_id,company_name: params.company_name,userData: this.state.leader,type: 'leader',add: 'leader'})}>
                                <Image source={require('../../imgs/add32.png')}
                                       style={styles.optionStyle}/>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('ChoosePeople',{company_id:params.company_id,company_name: params.company_name,userData: this.state.leader,type: 'leader',subtract: this.state.leader})}>
                                <Image source={require('../../imgs/subtract.png')}
                                       style={styles.optionStyle}/>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <Text style={styles.tipText}>企业负责人仅可选择跟节点成员，默认查看所有数据</Text>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    companyContent: {
        marginTop: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F7F8F9',
    },
    companyTop: {
        height: 50,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#F7F8F9'

    },
    companyLeft: {
        flexDirection: 'row',
    },
    companyContainer: {
        marginLeft: 10,
        marginRight: 20,
        height: 24,
        width: 24,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3CC7FF'
    },
    companyImg: {
        height: 16,
        width: 16,
        tintColor: '#fff'
    },
    rightIcon: {
        height: 16,
        width: 16,
        marginRight: 10
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
        flexWrap: 'wrap'
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
    }

});