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
            userData: params.userData
        }
    }
    componentDidMount() {
        this._listenter =DeviceEventEmitter.addListener('choosePeople',(e)=>{
            const {params} = this.props.navigation.state;
            var url = config.api.base + config.api.addUserId;
            request.post(url, {
                customer_id: params.customer_id,
                userData: e.checkedData,
                type: 1
            }).then((result) => {
                if (result.status == 1) {
                    toast.center(result.message);
                    this.setState({
                        userData: e.checkedData
                    });

                    DeviceEventEmitter.emit('addUserId',e.checkedData);
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
                        title="跟进人" />
                <View style={styles.peopleList}>
                    {userList}
                    <TouchableWithoutFeedback onPress={() =>{navigate('ChoosePeople',{company_id: params.company_id,userData: this.state.userData})}}>
                        <Image style={{width:35,height:35,marginLeft:10,tintColor:"#aaa"}}  source={require('../imgs/customer/add_c.png')}/>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{navigate('ChoosePeople',{company_id: params.company_id,userData: this.state.userData,subtract: this.state.userData})}}>
                        <Image style={{width:35,height:35,marginLeft:10,tintColor:"#aaa"}}  source={require('../imgs/customer/add_l.png')}/>
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