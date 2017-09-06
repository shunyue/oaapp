
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
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
const ScreenW = Dimensions.get('window').width;
export default class SelectDepart  extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            high_depart_name: params.high_depart_name,
            high_depart_id: params.high_depart_id,
        }
    }

    componentDidMount() {

        const {params} = this.props.navigation.state;
        //如果上个界面传过来查询公司，则查找公司信息
        if(params.findCompany) {
            var url = config.api.base + config.api.getCompany;
            request.post(url,{
                company_id: params.company_id
            }).then((result)=> {
                if(result.status == 1) {

                    this.setState({
                        companyData: result.data,
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
        }else{

            var url = config.api.base + config.api.getFirstDepart;
            request.post(url,{
                company_id: params.company_id,
                company_name: params.company_name,
                depart_id: params.depart_id
            }).then((result)=> {
                if(result.status == 1) {
                    this.setState({
                        departData: result.data.departData,
                        routeName: result.data.routeName
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
    }


    onSelect(index, value){

        this.setState({
            high_depart_name: this.refs[value].props.children,
            high_depart_id: value
        })
    }
    _confirm() {

        //如果上个界面传过来查询公司，则查找公司信息

        DeviceEventEmitter.emit('selectDepart',{'high_depart_id':this.state.high_depart_id,'high_depart_name': this.state.high_depart_name});
        this.props.navigation.goBack('SelectDepart');

    }
    _selectDepart(depart_id,company_name) {

        const {params} = this.props.navigation.state;
        if(depart_id) {

            this.props.navigation.navigate('SelectDepart',{
                high_depart_name: this.state.high_depart_name,
                high_depart_id: this.state.high_depart_id,
                depart_id: depart_id,
                company_id:params.company_id,
                company_name: params.company_name
            });
        }else {

            this.props.navigation.navigate('SelectDepart',{
                high_depart_name: this.state.high_depart_name,
                high_depart_id: this.state.high_depart_id,
                company_id:params.company_id,
                company_name: company_name
            });
        }
    }
    render() {

        var departData = this.state.departData;
        var companyData = this.state.companyData;
        var dataList = [];
        var radioButton = [];
        //遍历部门信息
        for(var i in departData) {

            radioButton.push(
                <RadioButton value={departData[i].id} color='red' style={styles.radioStyle} key={i}></RadioButton>
            );
            dataList.push(
                <TouchableHighlight key={i}
                    underlayColor={'#F3F3F3'}
                    onPress={this._selectDepart.bind(this,departData[i].id,null)}>
                    <View style={styles.listRowContent}>
                        <Text style={styles.listRowText} ref={departData[i].id}>{departData[i].depart_name}</Text>
                    </View>
                </TouchableHighlight>
            )
        }
        //遍历公司信息
        for(var i in companyData) {
            radioButton.push(
                <RadioButton value={'company'} color='red' style={styles.radioStyle} key={i}></RadioButton>
            );
            dataList.push(
                <TouchableHighlight key={i}
                                    underlayColor={'#F3F3F3'}
                                    onPress={this._selectDepart.bind(this,null,companyData[i].company_name)}>
                    <View style={styles.listRowContent}>
                        <Text style={styles.listRowText} ref={'company'}>{companyData[i].company_name}</Text>
                    </View>
                </TouchableHighlight>
            )
        }
        var routeName = this.state.routeName;
        var routeList = [];
        for(var i in routeName) {
            routeList.push(
                <View key={i} style={styles.routeList}>
                    <Image style={styles.rightIcon}
                           source={require('../../imgs/jtxr.png')}/>
                    <Text style={styles.departText}>{routeName[i]}</Text>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <Header navigation = {this.props.navigation}
                        title = "选择上级部门"/>
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
                <View style={styles.departLevel}>
                    <Text style={[styles.departText,{color: '#e4393c'}]}>选择部门</Text>
                    {routeList}
                </View>
                {dataList[0]&&<View style={styles.contentContainer}>

                    <RadioGroup
                        style={styles.groupStyle}
                        color='#9575b2'
                        onSelect = {(index, value) => this.onSelect(index, value)}>

                        {radioButton}

                    </RadioGroup>
                    {dataList}


                </View>}
                </ScrollView>
                <View style={styles.bottomContent}>
                    <View style={styles.textBorder}>
                        <Text>{this.state.high_depart_name}</Text>
                    </View>

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
        flexWrap: 'wrap',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ECECEC',
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
    },
    listRowContent: {
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        borderBottomWidth: 1,
        borderColor: '#F7F8F9'
    },
    listRowText: {
        marginLeft:50
    },

    //单选框的样式
    groupStyle: {
        position: 'absolute',
        width: 40,
        zIndex: 99
    },
    radioStyle: {
        height: 50,
        alignItems: 'center'
    },

    //下面的按钮
    bottomContent: {
        paddingLeft: 10,
        paddingRight: 10,
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#CFCFCF',
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textBorder: {
        padding: 4,
        borderColor: '#CFCFCF',
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



});