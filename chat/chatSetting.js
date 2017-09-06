/**
 * Created by Administrator on 2017/6/7.
 */
import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    DeviceEventEmitter
} from 'react-native';
import Header from '../common/header';
import config from '../common/config';
import toast from '../common/toast';
import request from '../common/request';
const screenW = Dimensions.get('window').width;
export default class app extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            userData: params.userData,
            group_id: ''
        }
    }
    componentDidMount() {
        this._listenter =DeviceEventEmitter.addListener('choosePeople',(e)=>{
            const {params} = this.props.navigation.state;
            var url = config.api.base + config.api.chatGroup;
            request.post(url, {
                from_user: params.from_user,
                to_user: params.to_user,
                userData: e.checkedData,
                company_id: params.company_id,
                group_id: this.state.group_id
            }).then((result) => {
                if (result.status == 1) {

                    this.props.navigation.navigate('ChatGroup',{from_user:params.from_user, group_id: result.data.group_id,name: '群聊('+result.data.group_num+')'});
                }
            }).catch((error) => {
                toast.bottom('网络连接失败，请检查网络后重试');
            });

        })
    }

    componentWillUnmount() {
        this._listenter.remove();
    }
    render() {
        const {navigate} = this.props.navigation;
        const {params} = this.props.navigation.state;
        var userList = [];
        var userData = this.state.userData;
        for(var i in userData) {
            userList.push(
                <TouchableHighlight underlayColor={"#fff"} onPress={()=>{navigate('SelfData')}} key={i}>
                    <View style={{width:56,alignItems:'center'}}>

                        <Image source={ userData[i].avatar? {uri: userData[i].avatar} : require('../imgs/avatar.png')}
                               style={styles.avatarStyle}/>
                        <Text style={{color:'#333'}}>{userData[i].name}</Text>
                    </View>
                </TouchableHighlight>
            )
        }
        return (
            <View style={styles.ancestorCon}>
                <Header navigation={this.props.navigation}
                        title="设置" />
                <View style={styles.peopleList}>
                    {userList}
                    <TouchableWithoutFeedback onPress={() =>{navigate('ChoosePeople',{company_id: params.company_id,userData: this.state.userData})}}>
                        <Image style={{width:35,height:35,marginLeft:10}} tintColor={"#aaa"} source={require('../imgs/customer/add_c.png')}/>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{navigate('ChoosePeople',{company_id: params.company_id,userData: this.state.userData,subtract: this.state.userData})}}>
                        <Image style={{width:35,height:35,marginLeft:10}} tintColor={"#aaa"} source={require('../imgs/customer/add_l.png')}/>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#F0F1F2',
    },
    add:{
        width:27,
        height:27,
    },
    avatarStyle: {
        height: 34,
        width: 34,
        borderRadius: 17,
        marginTop: 4
    },
    peopleList: {
        flexWrap: 'wrap',
        backgroundColor:'#fff',
        borderBottomWidth: 1,
        borderColor:'#ddd',
        flexDirection :'row',
        alignItems:'center',
        paddingLeft:10
    }
});