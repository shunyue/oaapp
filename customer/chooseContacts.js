
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
    DeviceEventEmitter,
    Alert
} from 'react-native';
import Header from '../common/header';
import config from '../common/config';
import toast from '../common/toast';
import request from '../common/request';
import Contacts from 'react-native-contacts';
const ScreenW = Dimensions.get('window').width;
export default class ChoosePeople  extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state
        this.state = {
            checkBoxData: [],
            checkedData: [],
        }
    }

    componentDidMount() {

        Contacts.getAll((err, contacts) => {
            if(err === 'denied'){
                // error
            } else {
                this.setState({
                    userData: contacts
                })
            }
        })
    }
    _choosePeople(user){
        DeviceEventEmitter.emit('chooseContacts',{
            tel: user.phoneNumbers[0].number.replace(/ /g,'').replace(/-/g,''),
            name:  user.givenName
        });

        this.props.navigation.goBack(null);


    }

    render() {
        var userData = this.state.userData;
        var userList = [];
        for(var i in userData) {

            userList.push(
                <TouchableHighlight key={i}
                                    onPress={this._choosePeople.bind(this,userData[i])}
                                    underlayColor={'#F3F3F3'}>
                    <View style={styles.listRowContent}>
                        <View style={styles.listRowSide}>
                            <Image
                                source={require('../imgs/avatar.png')}
                                style={styles.avatarStyle}/>
                            <View style={styles.userInfo}>
                                <Text>{userData[i].givenName}</Text>
                                <Text>{userData[i].phoneNumbers[0].number.replace(/ /g,'').replace(/-/g,'')}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            );
        }



        return (
            <View style={styles.container}>
                <Header navigation = {this.props.navigation}
                        title = "手机通讯录"/>
                <View style={styles.centerContent}>
                    <View style={styles.searchContainer}>
                        <Image style={styles.searchImg}
                               source={require('../imgs/search.png')}/>
                        <TextInput
                            placeholder={'搜索'}
                            underlineColorAndroid={"transparent"}
                            placeholderTextColor ={"#CFCFCF"}
                            style={styles.inputStyle}
                        />
                    </View>
                </View>
                <ScrollView>
                    {userList}
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

    listRowContent: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#F7F8F9',
        backgroundColor: '#fff'
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
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 20
    },
    userInfo: {
        flexDirection: 'column'
    },
});