
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
    TouchableOpacity,
    TouchableHighlight,
    Alert,
    DeviceEventEmitter
} from 'react-native';
import Header from '../../common/header';
import config from '../../common/config';
import toast from '../../common/toast';
import request from '../../common/request';
import CheckBox from 'react-native-check-box'
const screenW = Dimensions.get('window').width;
const ScreenW = Dimensions.get('window').width;
export default class Organization  extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            high_depart_id: params.high_depart_id?params.high_depart_id:null,
            high_depart_name: params.high_depart_name?params.high_depart_name:params.company_name,
        }
    }

    componentDidMount() {
        var url = config.api.base + config.api.firstDepartAndUser;
        const {params} = this.props.navigation.state;
        request.post(url,{
            company_id: params.company_id,
            company_name: params.company_name,
            depart_id: this.state.high_depart_id
        }).then((result)=> {
            if(result.status == 1) {
                this.setState({
                    userData: result.data.userData,
                    departData: result.data.departData,
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
        this.props.navigation.navigate('Organization',{
            depart_id:params.depart_id,
            depart_name :params.depart_name,
            high_depart_id: depart_id,
            high_depart_name: depart_name,
            company_id: params.company_id,
            company_name: params.company_name});
    }
    _pressUser(id) {
        alert(id);
       /* const {params} = this.props.navigation.state;
        this.props.navigation.navigate('人员详情组件',{
            company_id: params.company_id,
            user_id:params.user_id
         })*/
    }
    //搜索员工
    goPage_UserSearch(){
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('UserSearch',{
            company_id: params.company_id,
            user_id: params.user_id
        })
    }
    render() {
        //部门信息
        var departData = this.state.departData;
        var departList = [];
        for(var i in departData) {
            departList.push(
                <TouchableHighlight key={i}
                    onPress={this._nextDepart.bind(this,departData[i].id,departData[i].depart_name)}
                    underlayColor={'#F3F3F3'}>
                    <View style={styles.listRowContent}>
                        <View style={styles.listRowSide}>
                            <Text>{departData[i].depart_name}</Text>
                        </View>
                        <View style={styles.listRowSide}>
                            <Text>{departData[i].num}人</Text>
                            <Image style={styles.rightIcon}
                                   source={require('../../imgs/jtxr.png')}/>
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
                    onPress={this._pressUser.bind(this,userData[i].id)}
                    underlayColor={'#F3F3F3'}>
                    <View style={styles.listRowContent}>
                        <View style={styles.listRowSide}>
                            <Image source={ userData[i].avatar? {uri: userData[i].avatar} : require('../../imgs/avatar.png')}
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
                           source={require('../../imgs/jtxr.png')}/>}
                </View>
            )
        }



        const {params} = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <Header navigation = {this.props.navigation}
                        title = {params.company_name}/>
                <View style={styles.centerContent}>
                <TouchableHighlight underlayColor={'transparent'} onPress={()=>{this.goPage_UserSearch()}}>
                    <View style={[styles.search,styles.margin,styles.flex_row]}>
                        <Image style={{width:15,height:15,marginRight:7}} source={require('../../imgs/customer/search.png')}/>
                        <Text>搜索</Text>
                    </View>
                </TouchableHighlight>
                </View>
                <ScrollView>
                    <View style={styles.departLevel}>

                        {routeList}
                    </View>
                    <View style={[styles.contentContainer,departList[0]?null:{borderBottomWidth: 0}]}>
                        {departList}

                    </View>
                    <View style={[styles.contentContainer,{marginTop: 10},userList[0]?null:{borderWidth: 0}]}>
                        {userList}
                    </View>
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
        borderRadius: 2
    },
    btnText: {
        color: '#fff'
    },

    search:{
        width:screenW*0.95,
        height:30,
        backgroundColor:'#fff',
        justifyContent:'center',
        margin:screenW*0.02,
        borderRadius:7,
    },
    flex_row :{
        flexDirection:'row',
        alignItems:'center',
    },
    margin:{
        marginTop:10,
        marginBottom:10
    }
});