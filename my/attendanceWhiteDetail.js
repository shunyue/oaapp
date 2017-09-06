/**
 * Created by Administrator on 2017/7/5.
 * 考勤白名单
 */
import React ,{Component} from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableHighlight,
    Image,
    TextInput,
    DeviceEventEmitter,
    } from 'react-native';
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class AttendanceWhiteDetail extends Component {
    OpBack() {
        this.props.navigation.goBack('AttendanceWhiteDetail');
        //this.props.navigation.navigate('AttendanceManage',{companyid:this.props.navigation.state.params.companyid})
    }
    constructor(props) {
        super(props);
        this.state = {
            text: '员工姓名',
            attend:0,
            type: 'user',
            modalVisible:false
        };
    }

    componentDidMount() {
        //注册监听
        this.firstWhiteUser = DeviceEventEmitter.addListener('firstWhiteUser',()=>{this._firstWhiteUser()})
        this._firstWhiteUser() ;
    }
    componentWillUnmount(){
        this.firstWhiteUser.remove();
    }
    //页面一加载进来，就获取数据
    _firstWhiteUser(){
        var url = config.api.base + config.api.myselfInfomation;
        var id=this.props.navigation.state.params.companyid;
        request.post(url,{
            companyid: id,
        }).then((responseJson) => {
            this.setState({
                userData: responseJson,
            })
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }
    changeAttend(attend){
        if(attend==0){
            this.setState({
                attend:1
            })
        }
        if(attend==1){
            this.setState({
                attend:0
            })
        }
    }
    searchStatus(attend){
        if(attend==0){
            //this.changeAttend(attend);
            this.state.attend=0;
            this._firstWhiteUser() ;
            return(
                <TouchableHighlight underlayColor={'#fff'}
                                    onPress={()=>{
                     this.searchStatus(1);
                     this.setState({modalVisible: !this.state.modalVisible});}}>
                    <View style={styles.search_bj}>
                        <View style={[styles.search_border,styles.search_border2,{justifyContent:'center',alignItems:'center'}]}>
                            <Image style={styles.subNav_img} source={require('../imgs/customer/search.png')}/>
                            <Text>员工姓名</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            )
        }else if(attend==1){
            //this.changeAttend(attend);
            this.state.attend=1;
            return(
                <View style={styles.search_bj}>
                    <View style={styles.search_border}>
                        <Image style={styles.subNav_img} source={require('../imgs/customer/search.png')}/>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={this._onChangeText}
                            placeholder ={this.state.text}
                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"
                            />
                    </View>
                    <TouchableHighlight
                        underlayColor={'#fff'}
                        style={{height:40,justifyContent:'center',alignItems:'center',marginLeft:10}}
                        onPress={()=>{this.searchStatus(0);this.setState({modalVisible: !this.state.modalVisible});}}
                        >
                        <Text>取消</Text>
                    </TouchableHighlight>
                </View>
            )
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
        })
        this._searchPeople(t);

    }
    _searchPeople(t) {
        if(!t && !this.state.text) {
            return this.setState({
                userData: null
            })
        }
        const {params} = this.props.navigation.state;
        var url = config.api.base + config.api.searchEmployee;
        request.post(url,{
            type: this.state.type,
            company_id: this.props.navigation.state.params.companyid,
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
    render(){
        const {navigate} = this.props.navigation;
        const {state} = this.props.navigation;
        //人员信息
        var userData = this.state.userData;
        var userList = [];
        for(var i in userData) {
            userList.push(
                <View key={i} style={styles.avatarContainer}>
                    <Image style={styles.avatarStyle}
                           source={ userData[i].avatar? {uri: userData[i].avatar}: require('../imgs/avatar.png')}/>
                    <View>
                        <Text style={styles.positionText}>{userData[i].name}</Text>
                        <Text style={styles.positionText}>{userData[i].department}</Text>
                    </View>
                </View>
            )
        }
        return(
            <View style={[styles.container]}>
                <View style={styles.header}>
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <View style={{ flexDirection :'row',alignItems:'center',justifyContent:'center'}}>
                            <Image  style={styles.back_icon} source={require('../imgs/customer/back.png')}/>
                            <Text style={styles.back_text}>返回</Text>
                        </View>
                    </TouchableHighlight>
                    <Text style={styles.formHeader}>考勤白名单</Text>
                </View>
                <View style={styles.search_bj}>
                    <View style={styles.search_border}>
                        <Image style={styles.subNav_img} source={require('../imgs/customer/search.png')}/>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={this._onChangeText}
                            placeholder ={this.state.text}
                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"
                            />
                    </View>
                    <TouchableHighlight
                        underlayColor={'transparent'}
                        style={{height:40,justifyContent:'center',alignItems:'center',marginLeft:3}}
                        onPress={()=>{this.searchStatus(0);}}
                        >
                        <Text>取消</Text>
                    </TouchableHighlight>
                </View>
                <ScrollView>

                    <View style={styles.peopleList}>
                        {userList}
                    </View>
                </ScrollView>
                <View style={{marginTop:10,height:40,backgroundColor:'#fff',flexDirection:'row',alignItems:'center',justifyContent:'center',borderColor:'#ddd',borderWidth:1}}>
                    <TouchableHighlight underlayColor={'transparent'} onPress={()=>{ navigate('AttendanceOperationAdd',{ companyid:this.props.navigation.state.params.companyid});}}>
                        <View style={{flexDirection:'row',marginRight:screenW*0.2}}>
                            <Image style={{width:20,height:20}} source={require('../imgs/customer/add.png')}/>
                            <Text style={{color:'#e15151',marginLeft:5}}>添加成员</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'transparent'} onPress={()=>{ navigate('AttendanceOperationMinue',{ companyid:this.props.navigation.state.params.companyid});}}>
                        <View style={{flexDirection:'row'}}>
                            <Image tintColor={'#e15151'} style={{width:20,height:20}} source={require('../imgs/customer/delete.png')}/>
                            <Text style={{color:'#e15151',marginLeft:5}}>删除成员</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#eee',
    },
    header: {
        height: 40,
        flexDirection :'row',
        alignItems:'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor:'#bbb',
        justifyContent:'center',

    },
    go:{
        position:'absolute',
        top:8
    },
    goback:{
        left:15,
        flexDirection :'row',
    },
    goRight:{
        right:15
    },
    back_icon:{
        width:10,
        height:17,
        marginTop: 1
    },
    back_text:{
        color:'#e15151',
        fontSize: 16,
        marginLeft:6
    },
    formHeader:{
        fontSize:16,
        color:'#333'
    },
    search_bj:{
        backgroundColor:'#ddd',
        height:44,
        width:screenW,
        flexDirection:'row',
        alignContent:'center',
    },
    search_border:{
        width:screenW*0.82,
        height:28,
        backgroundColor:'#fff',
        marginLeft:9,
        marginRight:9,
        marginTop:8,
        borderRadius:5,
        flexDirection:'row',
        alignContent:'center',
    },
    search_border2:{
        width:screenW*0.95,
    },
    subNav_img:{
        width:15,
        height:15,
        marginTop:7,
        marginLeft:6,
        marginRight:4
    },
    input_text:{
        width:screenW*0.8,
        height:30,
        padding:0,
    },
    peopleList: {
        marginTop: 10,
        backgroundColor: '#eee',
    },
    avatarContainer: {
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: '#F7F8F9',
        borderBottomWidth: 1,
        width:screenW,
        paddingLeft:10,
        borderColor:'#ddd',
        borderWidth:1,
        backgroundColor: '#fff',
        marginTop:10
    },
    avatarStyle: {
        width:34,
        height:34,
        marginRight:10,
        borderRadius: 20,
    },
    positionStyle: {
        flexDirection: 'row'
    },
    textBorder: {
        marginRight: 6,
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 2,
        paddingRight: 2,
        borderColor: '#7DDBFF',
        borderWidth: 2,
        borderRadius: 2
    },
    positionText: {
        fontSize: 12,
    }
});