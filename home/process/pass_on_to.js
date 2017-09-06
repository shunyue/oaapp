//转交审批人  多选做出单选 效果
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
var  kaiguan = false;
const ScreenW = Dimensions.get('window').width;
export default class select_customer    extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state
        this.state = {
            checkBoxData: [],
            checkedData: [],

        }
    }

    componentDidMount() {
        var url = config.api.base + config.api.approve_pass_on_to_list;;
        const {params} = this.props.navigation.state;
        request.post(url,{
            user_id: this.props.navigation.state.params.user_id,
            company_id: this.props.navigation.state.params.company_id,//公司id
        }).then((result)=> {

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

    //确定
    _confirm() {
        for (var i = 0; i < this.state.checkBoxData.length; i++) {
            if(this.state.checkBoxData[i]!=null && this.state.checkBoxData[i].state.isChecked == true){
                this.state.checkedData.push(this.state.checkBoxData[i].props.value);
            }
        }
        var url = config.api.base + config.api.replace_approve_people;;
        request.post(url,{
            user_id: this.props.navigation.state.params.user_id,
            company_id: this.props.navigation.state.params.company_id,//公司id
            replace_people_user_id:this.state.checkedData[0]['id'],
            replace_people_dp_id:this.state.checkedData[0]['depart_id'],
            example_id: this.props.navigation.state.params.example_id,
        }).then((result)=> {
           // alert(JSON.stringify(result));
             if(result.sing==1){
                 this.props.navigation.navigate('Approval',{user_id:this.props.navigation.state.params.user_id,company_id:this.props.navigation.state.params.company_id})
             }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }


    //点击laber 将选项选中  id 是选项在 选项数组 中的 排序  onClick() 方法将 选项选中
    _pressUser(id) {
        this.state.checkBoxData[id].onClick()
        kaiguan = true;

    }

    select_one(id){
        if(kaiguan) {
            kaiguan = false
            for (var i = 0; i < this.state.checkBoxData.length; i++) {
                if(this.state.checkBoxData[i]!=null && this.state.checkBoxData[i].state.isChecked == true){
                    this.state.checkBoxData[i].onClick()
                }
            }
        }
    }

    render() {

        var userData = this.state.userData;
        var userList = [];
        var isChecked = false;
        var k=0;

        for(var i in userData) {
            var user = [];
            for(var j in userData[i]) {
                var customer_id = this.props.navigation.state.params.customer_id;
                if(customer_id==userData[i][j].id) {
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
                                    onClick={this.select_one.bind(this,k)}
                                    isChecked={isChecked}
                                    checkedImage={<Image source={require('../../imgs/selectnone.png')}/>}
                                    unCheckedImage={<Image source={require('../../imgs/select.png')}/>}
                                />
                                <View style={{flex: 1,zIndex: 999,backgroundColor: 'transparent'}}>
                                    <Text style={styles.textStyle}>{userData[i][j].name}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableHighlight>
                );
                k+=1;
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
                        title = "选择转交审批人"/>
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
        backgroundColor: '#fff',

    },
    checkStyle: {
        position: 'absolute',
        top: 1,
        left: 10,
        zIndex: 1
    },
    listRowSide: {

        flexDirection: 'row',
        alignItems: 'center',

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
    textStyle: {
        marginLeft: 50
    }


});