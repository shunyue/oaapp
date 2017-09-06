
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
    DeviceEventEmitter,
    Alert
} from 'react-native';
import Header from '../../common/header';
import config from '../../common/config';
import toast from '../../common/toast';
import request from '../../common/request';
import DateTimePicker from 'react-native-modal-datetime-picker';
const ScreenW = Dimensions.get('window').width;
import moment from 'moment';
export default class UserInfo  extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            isDateTimePickerVisible: false,
            high_depart_id: params.high_depart_id?params.high_depart_id: null,
            high_depart_name: params.high_depart_name?params.high_depart_name:null
        }
    }

    componentDidMount() {
        var url = config.api.base + config.api.getUserMsg;
        const {params} = this.props.navigation.state;

        request.post(url,{
            user_id: params.user_id,
        }).then((result)=> {
            if(result.status == 1) {
                this.setState({
                    role_name: result.data.role_name,
                    name: result.data.name,
                    position: result.data.position,
                    tel: result.data.tel,
                    email: result.data.email,
                    birthday: result.data.birthday,
                    user_num: result.data.user_num,
                    high_depart_name: result.data.depart_name?result.data.depart_name:params.company_name
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


        this.selectDepart = DeviceEventEmitter.addListener('selectDepart',
            (params)=>{
                this.setState({
                    high_depart_name: params.high_depart_name,
                    high_depart_id: params.high_depart_id
                })
            });
    }
    componentWillUnmount() {
        this.selectDepart.remove();
    }
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this.setState({
           birthday: moment(date).format('YYYY-MM-DD')
        });
        this._hideDateTimePicker();
    };

    _selectDepart() {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('SelectDepart',{high_depart_name: this.state.high_depart_name,high_depart_id: this.state.high_depart_id,company_id:params.company_id,findCompany: true});
    }
    _delUser() {
        return Alert.alert(
            '删除该员工？',
            '该员工将被移出您的企业，此操作不可恢复',
            [{text: '取消'},{text: '删除', onPress: ()=>{this._delUserWay()}}]
        );
    }
    _delUserWay() {
        var url = config.api.base + config.api.delUser;
        const {params} = this.props.navigation.state;
        request.post(url,{
            user_id: params.user_id,
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
        this.props.navigation.goBack(null);
    }


    _editUserInfo() {

        var url = config.api.base + config.api.editUserInfo;
        const {params} = this.props.navigation.state;
        request.post(url,{
            id: params.user_id,
            name: this.state.name,
            position: this.state.position,
            email: this.state.email,
            birthday: this.state.birthday,
            user_num: this.state.user_num,
            depart_id: this.state.high_depart_id
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
        this.props.navigation.goBack(null);

    }
    render() {
        return (
            <View style={styles.container}>
                <Header navigation = {this.props.navigation}
                        title = {"编辑资料"}
                        rightText = {"确定"}
                        onPress={()=>this._editUserInfo()}/>
                <ScrollView>
                    <View style={styles.content}>
                        <View style={styles.listRowContent}>
                            <Text>姓名</Text>
                            <TextInput
                                placeholder={'请填写姓名'}
                                underlineColorAndroid={"transparent"}
                                placeholderTextColor ={"#CFCFCF"}
                                onChangeText={(name)=>{this.setState({name})}}
                                value={this.state.name}
                                style={styles.inputStyle}
                            />
                        </View>
                        <View style={styles.listRowContent}>
                            <Text>移动电话</Text>
                            <Text style={styles.textStyle}>{this.state.tel}</Text>
                        </View>
                        <View style={styles.listRowContent}>
                            <Text>邮箱</Text>
                            <TextInput
                                placeholder={'请填写名称'}
                                underlineColorAndroid={"transparent"}
                                placeholderTextColor ={"#CFCFCF"}
                                onChangeText={(email)=>{this.setState({email})}}
                                value={this.state.email}
                                style={styles.inputStyle}
                            />
                        </View>
                        <View style={styles.listRowContent}>
                            <Text>部门</Text>
                            <TouchableWithoutFeedback onPress={()=>this._selectDepart()}>
                                <View style={styles.listRight}>
                                    <Text>{this.state.high_depart_name}</Text>
                                    <Image source={require('../../imgs/jtxr.png')}
                                           style={styles.imgStyle} />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.listRowContent}>
                            <Text>职位</Text>
                            <TextInput
                                placeholder={'请填写职位'}
                                underlineColorAndroid={"transparent"}
                                placeholderTextColor ={"#CFCFCF"}
                                onChangeText={(position)=>{this.setState({position})}}
                                value={this.state.position}
                                style={styles.inputStyle}
                            />
                        </View>
                        <View style={styles.listRowContent}>
                            <Text>员工编号</Text>
                            <TextInput
                                placeholder={'请填写编号'}
                                underlineColorAndroid={"transparent"}
                                placeholderTextColor ={"#CFCFCF"}
                                onChangeText={(user_num)=>{this.setState({user_num})}}
                                value={this.state.user_num}
                                style={styles.inputStyle}
                            />
                        </View>
                        <View style={styles.listRowContent}>
                            <Text>生日</Text>
                            <TouchableWithoutFeedback onPress={this._showDateTimePicker}>
                                <View style={styles.listRight}>
                                    <Text style={[styles.textStyle,this.state.birthday?null:{color: '#CFCFCF'}]}>{this.state.birthday?this.state.birthday:"请选择"}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <DateTimePicker
                            cancelTextIOS="取消"
                            confirmTextIOS="确定"
                            datePickerModeAndroid="spinner"
                            isVisible={this.state.isDateTimePickerVisible}
                            mode={"date"}
                            onConfirm={this._handleDatePicked}
                            onCancel={this._hideDateTimePicker}
                        />
                        <View style={styles.listRowContent}>
                            <Text>角色</Text>
                            <Text style={styles.textStyle}>{this.state.role_name}</Text>
                        </View>
                    </View>

                    <TouchableWithoutFeedback onPress={()=>this._delUser()}>
                        <View style={styles.btnStyle}>
                            <Text style={styles.btnText}>移出企业</Text>
                        </View>
                    </TouchableWithoutFeedback>
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
    content: {
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingRight: 10
    },
    listRowContent: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#F7F8F9'
    },

    inputStyle: {
        textAlign: 'right',
        width: ScreenW*0.5,
        height: 50
    },
    listRight: {
        flexDirection: 'row',
        width:  ScreenW*0.5,
        justifyContent: 'flex-end'
    },
    imgStyle: {
        marginLeft: 6,
        height: 16,
        width: 16
    },

    textStyle: {
        marginRight: 10
    },
    btnStyle: {
        marginTop: 10,
        backgroundColor: '#fff',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        color: 'red'
    }
});