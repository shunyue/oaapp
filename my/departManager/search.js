
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
import Header from '../../common/header';
import config from '../../common/config';
import toast from '../../common/toast';
import request from '../../common/request';
const ScreenW = Dimensions.get('window').width;
export default class UserInfo  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'user'
        }
    }
    _onChangeText = (t) => {
        if(!t) {
            return this.setState({
                userData: null,
                text: null
            })
        }
        this.setState({
            text: t
        });
        this._searchPeople(t);

    };
    _searchPeople(t) {
        if(!t && !this.state.text) {
            return this.setState({
                userData: null
            })
        }
        const {params} = this.props.navigation.state;
        var url = config.api.base + config.api.searchPeople;
        request.post(url,{
            type: this.state.type,
            company_id: params.company_id,
            text: t? t: this.state.text
        }).then((result)=> {
            if(result.status == 1) {
                this.setState({
                    userData: result.data
                })
            }else{
                return this.setState({
                    userData: null
                })
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }
    //用户信息
    _navigateUserInfo(id) {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('UserInfo',{user_id: id,company_id: params.company_id,company_name: params.company_name,});
    }


    _userInfo(data) {
        if(this.state.type == 'user') {
            return data.tel
        }
        if(this.state.type == 'position') {
            return data.position
        }
        if(this.state.type == 'role') {
            return data.role_name
        }
    }


    render() {
        var userData = this.state.userData;
        var userList = [];
        for(var i in userData) {
            userList.push(
                <TouchableHighlight key={i} onPress={this._navigateUserInfo.bind(this,userData[i].id)}>
                    <View style={styles.peopleList}>
                        <Image style={styles.avatarStyle}
                               source={ require('../../imgs/avatar.png')}/>
                        <View>
                            <Text style={styles.peopleName}>{userData[i].name}</Text>
                            <Text>{this._userInfo(userData[i])}</Text>
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
                        <Image source={require('../../imgs/navxy.png')}
                            style={styles.leftIcon}/>
                    </View>
                    </TouchableOpacity>
                    <View style={styles.inputContainer}>
                    <Image source={require('../../imgs/search.png')}
                           style={styles.searchIcon}/>
                        <TextInput
                            placeholder={'搜索员工'}
                            underlineColorAndroid={"transparent"}
                            placeholderTextColor ={"#A2A2A2"}
                            onChangeText={this._onChangeText}
                            style={styles.inputStyle}
                        />
                    </View>
                    <TouchableOpacity activeOpacity={0.7} onPress={()=>this._searchPeople(null)}>
                        <View style={styles.textContainer}>
                            <Text style={styles.searchText}>搜索</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {!this.state.userData?
                    <View style={styles.searchTip}>
                        <View style={styles.topContent}>
                            <Text>指定搜索内容</Text>
                        </View>
                        <View style={styles.searchCondition}>
                            <Text style={styles.conditionText} onPress={()=>this.setState({type: 'user'})}>员工</Text>
                            <Text style={styles.conditionText} onPress={()=>this.setState({type: 'position'})}>职位</Text>
                            <Text style={styles.conditionText} onPress={()=>this.setState({type: 'role'})}>角色</Text>
                        </View>
                    </View> :
                    <View style={styles.searchInfo}>
                        <Text>员工</Text>
                        {userList}
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
    },
    peopleList: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        borderColor: '#F7F8F9',
        height: 50,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    peopleName: {
        color: '#000',
        fontSize: 16
    },
    avatarStyle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginRight: 10,
    },

});