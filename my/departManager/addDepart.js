
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    Dimensions,
    Image,
    TouchableWithoutFeedback,
    DeviceEventEmitter,
    Alert
} from 'react-native';
import Header from '../../common/header';
import config from '../../common/config';
import toast from '../../common/toast';
import request from '../../common/request';
const ScreenW = Dimensions.get('window').width;
export default class AddDepart  extends Component {

    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            high_depart_name: params.high_depart_name,
            high_depart_id: params.high_depart_id
        }
    }

    componentDidMount() {

        this.selectDepart = DeviceEventEmitter.addListener('selectDepart',
            (params)=>{
            this.setState({
                high_depart_name: params.high_depart_name,
                high_depart_id: params.high_depart_id
            })
        });
    }

    componentWillUnmount() {
        this.selectDepart.remove();
    }


     _complete() {
        if(!this.state.depart_name) {
            return Alert.alert(
                '提示',
                '请输入部门名称',
                [{text: '确定'}]
            )
        }
         const {params} = this.props.navigation.state;
         var url = config.api.base + config.api.addDepart;
         request.post(url,{
             company_id: params.company_id,
             high_depart: this.state.high_depart_id,
             depart_name: this.state.depart_name
         }).then((result)=> {
             if(result.status == 1) {
                 toast.center(result.message);
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
         DeviceEventEmitter.emit('firstDepartAndUser');
     }
    _selectDepart() {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('SelectDepart',{
            high_depart_name: this.state.high_depart_name,
            high_depart_id: this.state.high_depart_id,
            company_id:params.company_id,
            findCompany: true});
    }
     render() {
         const {params}  = this.props.navigation.state;
         return (
             <View style={styles.container}>
                 <Header navigation = {this.props.navigation}
                         title = "添加部门"
                         rightText="完成"
                         onPress={()=>this._complete()}
                         />
                 <View style={styles.listRowContent}>
                     <Text >部门名称</Text>
                     <TextInput
                         placeholder={'请填写名称'}
                         underlineColorAndroid={"transparent"}
                         placeholderTextColor ={"#CFCFCF"}
                         onChangeText={(depart_name)=>{this.setState({depart_name})}}
                         style={styles.inputStyle}
                     />
                 </View>
                 <TouchableWithoutFeedback onPress={()=>this._selectDepart()}>
                     <View style={styles.listRowContent}>
                         <Text >上级部门</Text>
                         <View style={styles.listRight}>
                             <Text>{this.state.high_depart_name}</Text>
                             <Image source={require('../../imgs/jtxr.png')}
                                    style={styles.imgStyle} />
                         </View>
                     </View>
                 </TouchableWithoutFeedback>
             </View>
         )
     }
 }
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    listRowContent: {
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        flexDirection: 'row',
        borderColor: '#ECECEC',
        borderBottomWidth: 1
    },
    inputStyle: {
        textAlign: 'right',
        width: ScreenW*0.5,
        height: 50
    },
    listRight: {
        flexDirection: 'row'
    },
    imgStyle: {
        marginLeft: 6,
        height: 16,
        width: 16
    }
});