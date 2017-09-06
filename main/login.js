import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Dimensions,
    TouchableOpacity,
    Alert,
    AsyncStorage,
} from 'react-native';
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';
import JPushModule from 'jpush-react-native';
const ScreenW = Dimensions.get('window').width;
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onFocusAcc: true,
            onFocusPass: false,
            account: '',
            password: ''
        }
    }
    _login() {
        if(!this.state.account.trim()) {
            return toast.bottom('账号不能为空')
        }
        if(!this.state.password.trim()) {
            return toast.bottom('密码不能为空')
        }

        var url = config.api.base + config.api.login;
        request.post(url,{
            account: this.state.account,
            password: this.state.password
        }).then((result)=> {
            if(result.status == 1) {
                AsyncStorage.setItem('user',JSON.stringify(result.data));
                // 设置极光推送的别名
                JPushModule.setAlias(result.data.user_id, (map) => {
                    if (map.errorCode === 0) {
                        console.log("set alias succeed");
                    } else {
                        console.log("set alias failed, errorCode: " + map.errorCode);
                    }
                });
                this.props.navigation.navigate('Main');

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
    _onFocusAcc() {
        this.setState({
            onFocusAcc: true,
            onFocusPass: false
        })
    }
    _onFocusPass() {
        this.setState({
            onFocusAcc: false,
            onFocusPass: true
        })
    }
    _navJoin() {
        this.props.navigation.navigate('Join')
    }
    _navCreate() {
        this.props.navigation.navigate('Create')
    }
    focusNextField = (nextField) => {
        this.refs[nextField].focus();
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.imgContainer}>
                    <View style={styles.imgBorder}>
                        <Image source={require('../imgs/crm.png')}
                                style={styles.imgStyle}/>
                    </View>
                </View>
                <View style={[styles.listRowContent,{borderColor: this.state.onFocusAcc?'red':'#CFCFCF'}]}>
                    <Text style={styles.textStyle}>账号</Text>
                    <TextInput
                        ref="1"
                        placeholder={'请填写账号'}
                        returnKeyType="next"
                        returnKeyLabel={"下一步"}
                        onFocus={()=>this._onFocusAcc()}
                        underlineColorAndroid={"transparent"}
                        placeholderTextColor ={"#CFCFCF"}
                        style={styles.inputStyle}
                        onChangeText={(account)=>{this.setState({account})}}
                        onSubmitEditing={() => this.focusNextField('2')}
                        />
                </View>
                <View style={[styles.listRowContent,{borderColor: this.state.onFocusPass?'red':'#CFCFCF'}]}>
                    <Text style={styles.textStyle}>账号</Text>
                    <TextInput
                        ref="2"
                        placeholder={'请输入密码'}
                        onFocus={()=>this._onFocusPass()}
                        secureTextEntry={true}
                        underlineColorAndroid={"transparent"}
                        placeholderTextColor ={"#CFCFCF"}
                        style={styles.inputStyle}
                        onChangeText={(password)=>{this.setState({password})}}
                    />
                </View>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.btnStyle}
                    onPress={()=>this._login()}>
                    <View style={styles.loginView}>
                        <Text style={styles.loginText}>登录</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.registerView}>
                    <Text onPress={()=>this._navJoin()}
                        style={styles.registerText}>加入企业</Text>
                    <Text onPress={()=>this._navCreate()}
                        style={styles.registerText}>创建企业</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    imgContainer: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgBorder: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 68,
        width: 68,
        borderRadius: 34,
        borderColor: '#CFCFCF',
        borderWidth: 1
    },
    imgStyle: {
        height: 64,
        width: 64,
    },
    listRowContent: {
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
        borderColor: 'red',
        borderBottomWidth: 1
    },
    textStyle: {
        marginRight: 8
    },
    inputStyle: {
        width: ScreenW*0.8,
        height: 50
    },
    btnStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginView: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: ScreenW*0.9,
        height: 40,
        backgroundColor: '#E4393C',
        borderRadius: 20,
    },
    loginText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 4
    },
    registerView: {
        padding: 30,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    registerText: {
        color: '#e4393c'
    }
});
