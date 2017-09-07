/*
* 表单多选框 选项页面 预览页面
* */
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
        for(var i in this.props.navigation.state.params.data){
            if(this.props.navigation.state.params.data[i].field_name==this.props.navigation.state.params.sing){
                var optionvalue=[];//多选的选项值
                for (var j=1;j<=5;j++){
                    var optionkey='option'+j;
                    if(this.props.navigation.state.params.data[i][optionkey]!=''){
                        optionvalue.push(this.props.navigation.state.params.data[i][optionkey])
                    }
                }
            }
        }
        this.setState({
            userData: optionvalue
        })
    }


    initCheckBoxData(checkbox){
        if(checkbox!=null){
            this.state.checkBoxData.push(checkbox);
        }
    }


    //判断是否 多选框选中
    contains(arr,id) {

        for(var i in arr ){
            if(arr[i]==id){
                return true;
            }
        }
        return false;
    }
    //判断是否 多选框选中


    //确定
    _confirm() {
        this.props.navigation.goBack(null);
    }

    //id 是 选择值 在选项数组中的排序
    _pressUser(id) {
        this.state.checkBoxData[id].onClick()
    }

    render() {
        var userData = this.state.userData;
        var userList=[]
        isChecked=false;
        for(var i in userData){

            var data = this.props.navigation.state.params.optionvaue;
            if(this.contains(data,userData[i])) {
                isChecked = true;
            }else{
                isChecked = false;
            }

            userList.push(

                <TouchableHighlight key={i}
                                    onPress={this._pressUser.bind(this,i)}
                                    underlayColor={'#F3F3F3'}>
                    <View style={styles.listRowContent}>
                        <View style={styles.listRowSide}>
                            <CheckBox
                                ref={(c)=>this.initCheckBoxData(c)}
                                style={styles.checkStyle}
                                value={userData[i]}
                                onClick={()=>{}}
                                isChecked={isChecked}
                                checkedImage={<Image source={require('../../imgs/selectnone.png')}/>}
                                unCheckedImage={<Image source={require('../../imgs/select.png')}/>}
                            />

                            <Text>{userData[i]}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            )

        }

        return (
            <View style={styles.container}>
                <Header navigation = {this.props.navigation}
                        title = "多项选择"/>

                <ScrollView>
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