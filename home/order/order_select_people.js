/*订单筛选 发起人员*/
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
import Header from '../../common/header';
import config from '../../common/config';
import toast from '../../common/toast';
import request from '../../common/request';
import CheckBox from 'react-native-check-box'

const ScreenW = Dimensions.get('window').width;
export default class faqi_people  extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state
        this.state = {
            checkBoxData: [],
            checkedData: [],
            select_all: 'http://118.178.241.223/oa/icon_shenpi/select.png',
        }
    }

    componentDidMount() {
        var url = config.api.base + config.api.select_approve_peopel;
        const {params} = this.props.navigation.state;
        request.post(url,{
            company_id: this.props.navigation.state.params.company_id,
        }).then((result)=> {

          //  alert(JSON.stringify(result));
            if(result.status == 1) {
                this.setState({
                    userData: result.data
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

    initCheckBoxData(checkbox){
        if(checkbox!=null){
            this.state.checkBoxData.push(checkbox);
        }
    }


    //判断是否 多选框选中
    contains(arr,id) {
        //var i = arr.length;
        //while (i --) {
        //    if(arr[i].id === id) {
        //        return true;
        //    }
        //}
        //return false;

        for(var i in arr ){
            if(arr[i].id==id){
                return true;
            }
        }
        return false;
    }
    //判断是否 多选框选中


    //确定
    _confirm() {

        for (var i = 0; i < this.state.checkBoxData.length; i++) {
            if(this.state.checkBoxData[i]!=null && this.state.checkBoxData[i].state.isChecked == true){
                this.state.checkedData.push(this.state.checkBoxData[i].props.value);
            }
        }


       // alert(JSON.stringify(this.state.checkedData))
       // console.log(this.state.checkedData);
        DeviceEventEmitter.emit('faqi_people', this.state.checkedData);
        this.props.navigation.goBack(null);
    }


    //id 是 选择值 在选项数组中的排序
    _pressUser(id) {
        this.state.checkBoxData[id].onClick()
    }


    //全选
    select_all(){
        if(this.state.select_all=='http://118.178.241.223/oa/icon_shenpi/selectnone.png'){
            //全不选
            for (var i = 0; i < this.state.checkBoxData.length; i++) {
                this.state.checkBoxData[i].state.isChecked = false
            }
            this.setState({
                select_all: 'http://118.178.241.223/oa/icon_shenpi/select.png',
            })
            //全选
        }else{
            for (var i = 0; i < this.state.checkBoxData.length; i++) {
                this.state.checkBoxData[i].state.isChecked = true
            }
            this.setState({
                select_all: 'http://118.178.241.223/oa/icon_shenpi/selectnone.png',
            })
        }
    }



    render() {


        var userData = this.state.userData;

        var k=-1;
        var userList = [];
        var isChecked = false;

        for(var i in userData) {


            var user = [];
            for(var j in userData[i]) {
                k+=1;
                var data = this.props.navigation.state.params.selected_peopel;
                if(this.contains(data,userData[i][j].id)) {
                    isChecked = true;
                }else{
                    isChecked = false;
                }
                user.push(
                    <TouchableHighlight key={j}
                                        onPress={this._pressUser.bind(this,k)}
                                        underlayColor={'#F3F3F3'}>
                        <View style={styles.listRowContent}>
                            <View style={styles.listRowSide}>
                                <CheckBox
                                    ref={(c)=>this.initCheckBoxData(c)}
                                    style={styles.checkStyle}
                                    value={userData[i][j]}
                                    onClick={()=>{}}
                                    isChecked={isChecked}
                                    checkedImage={<Image source={require('../../imgs/selectnone.png')}/>}
                                    unCheckedImage={<Image source={require('../../imgs/select.png')}/>}
                                />
                                <Image source={ userData[i][j].avatar? {uri: userData[i][j].avatar} : require('../../imgs/avatar.png')}
                                       style={styles.avatarStyle}/>
                                <Text>{userData[i][j].name}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                );
            }

            userList.push(
                <View key={i}>
                    <View style={styles.departLevel}>
                        <Text style={styles.departText}>{userData[i][0].first_char}</Text>
                    </View>
                    {user}
                </View>
            )
        }



        return (
            <View style={styles.container}>
                <Header navigation = {this.props.navigation}
                        title = "创建人员"/>
                <View style={styles.centerContent}>
                    <View style={styles.searchContainer}>
                        <Image style={styles.searchImg}
                               source={require('../../imgs/search.png')}/>
                        <TextInput
                            placeholder={'搜索'}
                            underlineColorAndroid={"transparent"}
                            placeholderTextColor ={"#CFCFCF"}
                            style={styles.inputStyle}
                        />
                    </View>
                </View>
                <ScrollView>
                    <TouchableHighlight key={j}
                                        onPress={()=>this.select_all()}
                                        underlayColor={'#F3F3F3'}>
                        <View style={{flexDirection: 'row',marginTop:10,marginBottom:10}}>
                            <Image source={{uri:this.state.select_all}}
                                   style={{width: 20, height: 20,marginLeft:10,marginRight:10}} />
                            <Text>全选</Text>
                        </View>
                    </TouchableHighlight>
                    {userList}
                </ScrollView>
                <View style={styles.bottomContent}>

                    <TouchableOpacity
                        style={styles.btnStyle}
                        onPress={()=>this._confirm()}>
                        <Text style={styles.btnText}>确定</Text>
                    </TouchableOpacity>
                </View>

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
        padding: 4,

    },
    rightIcon: {
        height: 16,
        width: 16,
    },
    departText: {
        fontSize: 14,
        marginLeft: 10
    },
    contentContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#CFCFCF',
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
        marginRight: 10,
        borderRadius: 20
    },
    bottomContent: {
        paddingLeft: 10,
        paddingRight: 10,
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#CFCFCF',
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
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


});