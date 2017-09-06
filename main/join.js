import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    Dimensions,
    TouchableOpacity,
    Image,
    TouchableWithoutFeedback,
    Alert
} from 'react-native';
import Header from '../common/header';
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';
const ScreenW = Dimensions.get('window').width;
export default class Join extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSecure: true,
            account: '',
            password: '',
            name: '',
            tel: '',
            company_code: '',
            message:''
        }
    }
    _joinCompany() {
        if(!this.state.account.trim()) {
            return toast.bottom('账号不能为空')
        }
        if(!this.state.account.match(/\d/) || !this.state.account.match(/[a-zA-Z]/) || this.state.account.length < 6) {
            return toast.bottom('账号必须是6位以上的数字和字符组合')
        }

        if(!this.state.password.trim()) {
            return toast.bottom('密码不能为空')
        }
        if(!this.state.password.match(/\d/) || !this.state.password.match(/[a-zA-Z]/) || this.state.account.length < 6) {
            return toast.bottom('密码必须是6位以上的数字和字符组合')
        }
        if(!this.state.name.trim()) {
            return toast.bottom('姓名不能为空')
        }
        if(!this.state.tel.trim()) {
            return toast.bottom('手机号码不能为空')
        }
        if(!this.state.tel.match(/^\d{11}$/)) {
            return toast.bottom('请输入正确的手机号码')
        }
        if(!this.state.company_code.trim()) {
            return toast.bottom('公司代码不能为空')
        }


        var url = config.api.base + config.api.companyJoin;

        request.post(url,{
            account: this.state.account,
            password: this.state.password,
            name: this.state.name,
            tel: this.state.tel,
            company_code: this.state.company_code,
            message: this.state.message
        }).then((result)=> {
            if(result.status == 1) {
                return toast.center(result.message);
            }else{
                return toast.bottom(result.message)
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }
    focusNextField = (nextField) => {
        this.refs[nextField].focus();
    };
    render() {
        return (
            <View style={styles.container}>
                <Header
                    navigation = {this.props.navigation}
                    title={"加入企业"}/>
                <View style={styles.contentContainer}>
                    <View style={styles.listRowContent}>
                        <Text style={styles.textStyle}>账号</Text>
                        <TextInput
                            ref="1"
                            returnKeyType="next"
                            returnKeyLabel={"下一步"}
                            placeholder={'6位以上数字和字母的组合'}
                            underlineColorAndroid={"transparent"}
                            placeholderTextColor ={"#CFCFCF"}
                            style={styles.inputStyle}
                            onChangeText={(account)=>{this.setState({account})}}
                            onSubmitEditing={() => this.focusNextField('2')}
                        />
                    </View>
                    <View style={styles.listRowContent}>
                        <Text style={styles.textStyle}>设置密码</Text>
                        <TextInput
                            ref="2"
                            returnKeyType="next"
                            returnKeyLabel={"下一步"}
                            placeholder={'6位以上数字和字母的组合'}
                            underlineColorAndroid={"transparent"}
                            placeholderTextColor ={"#CFCFCF"}
                            secureTextEntry={this.state.isSecure}
                            style={[styles.inputStyle,{width: ScreenW*0.6}]}
                            onChangeText={(password)=>{this.setState({password})}}
                            onSubmitEditing={() => this.focusNextField('3')}
                        />
                        <TouchableWithoutFeedback
                            onPress={()=>this.setState({isSecure: !this.state.isSecure})}>
                            <Image style={styles.imgStyle}
                                   source={this.state.isSecure?require('../imgs/eye_close.png'):require('../imgs/eye_open.png')}/>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.listRowContent}>
                        <Text style={styles.textStyle}>姓名</Text>
                        <TextInput
                            ref="3"
                            returnKeyType="next"
                            returnKeyLabel={"下一步"}
                            placeholder={'请输真实姓名'}
                            underlineColorAndroid={"transparent"}
                            placeholderTextColor ={"#CFCFCF"}
                            style={styles.inputStyle}
                            onChangeText={(name)=>{this.setState({name})}}
                            onSubmitEditing={() => this.focusNextField('4')}
                        />
                    </View>
                    <View style={styles.listRowContent}>
                        <Text style={styles.textStyle}>手机号</Text>
                        <TextInput
                            ref="4"
                            returnKeyType="next"
                            returnKeyLabel={"下一步"}
                            placeholder={'请输手机号'}
                            underlineColorAndroid={"transparent"}
                            placeholderTextColor ={"#CFCFCF"}
                            keyboardType={"numeric"}
                            style={styles.inputStyle}
                            onChangeText={(tel)=>{this.setState({tel})}}
                            onSubmitEditing={() => this.focusNextField('5')}
                        />
                    </View>
                    <View style={styles.listRowContent}>
                        <Text style={styles.textStyle}>企业代码</Text>
                        <TextInput
                            ref="5"
                            returnKeyType="next"
                            returnKeyLabel={"下一步"}
                            placeholder={'请输入企业代码'}
                            underlineColorAndroid={"transparent"}
                            placeholderTextColor ={"#CFCFCF"}
                            style={styles.inputStyle}
                            onChangeText={(company_code)=>{this.setState({company_code})}}
                            onSubmitEditing={() => this.focusNextField('6')}
                        />
                    </View>

                    <View style={[styles.listRowContent,{borderBottomWidth: 0,height: 100,alignItems: 'flex-start'}]}>
                        <Text style={[styles.textStyle,{paddingTop: 10}]}>附加信息</Text>
                        <TextInput
                            ref="6"
                            placeholder={'附加信息'}
                            underlineColorAndroid={"transparent"}
                            multiline={true}
                            placeholderTextColor ={"#CFCFCF"}
                            style={[styles.inputStyle,{textAlignVertical: 'top',height: 100}]}
                            onChangeText={(message)=>{this.setState({message})}}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={()=>this._joinCompany()}
                    underlayColor={'#832c1a'}
                    style={styles.btnStyle}>
                    <Text style={styles.btnText}>注册</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    contentContainer: {
        marginTop: 10,
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: '#FFFFFF',
        borderColor: '#CFCFCF',
        borderWidth: 1
    },
    listRowContent: {
        flexDirection: 'row',
        height: 46,
        alignItems: 'center',
        borderColor: '#CFCFCF',
        borderBottomWidth: 1
    },
    textStyle: {
        marginRight: 6,
        width: ScreenW*0.2
    },
    inputStyle: {
        width: ScreenW*0.7,
        height: 46
    },
    btnStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        height: 40,
        borderRadius: 4,
        backgroundColor: '#E4393C'
    },
    btnText: {
        color: '#FFFFFF'
    },
    imgStyle: {
        height: 20,
        width: 30
    }
});
