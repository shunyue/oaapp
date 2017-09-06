/**
 * Created by Administrator on 2017/7/3.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions
    } from 'react-native';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import Header from '../../common/header';
export default class PositionInput extends Component {
    constructor(props) {
        super(props);
        this.state = {position: '' };
    }
    OpBack() {
        this.props.navigation.goBack('PositionInput');
    }
    //点击保存按钮
    save() {
        var url = config.api.base + config.api.myselfInfomation;
        let {params}=this.props.navigation.state;
        request.post(url,{
            userid:params.canshu.userid,//使用者的id
            pname:this.state.position,//职位
        }).then((responseJson) => {
            if(responseJson.sing==0){
                toast.center('温馨提示：职位不能为空！');
            }
            if(responseJson.sing==1){
                toast.center('保存成功');
                this.props.navigation.navigate('Info', {id:params.canshu.userid});
            }
            if(responseJson.sing==2){
                toast.center('保存失败');
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    };
    //点击保存按钮
    render() {
        const {params} = this.props.navigation.state;
        return (
            <View style={styles.ancestorCon}>
                <Header navigation = {this.props.navigation}
                        title = "职位"
                        rightText = "保存"
                        onPress={()=>this.OpBack()}/>
                <View style={[styles.childContent,{marginTop:5,borderColor: '#F0F0F0', borderWidth: 1,backgroundColor:'#fff'}]} >
                    {(params.canshu.position=='' || params.canshu.position==null)?
                        (<TextInput
                            style={{height: 40,marginLeft:10 ,backgroundColor:'#fff'}}
                            onChangeText={(posiiton) => this.setState({posiiton})}
                            placeholder='职位'
                            underlineColorAndroid="transparent"
                            value={this.state.posiiton}
                            autoFocus={true}
                            />):(<TextInput
                        style={{height: 40, marginLeft:10 ,backgroundColor:'#fff'}}
                        onChangeText={(posiiton) => this.setState({posiiton})}
                        placeholder={params.canshu.position}
                        underlineColorAndroid="transparent"
                        value={this.state.posiiton}
                        autoFocus={true}
                        />)   }
                </View>
            </View>
        );
    }
}
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
const styles = StyleSheet.create({
    ancestorCon: {
        flex: 1,
        backgroundColor: '#F0F1F2',
    },
    childContent: {//子容器页面级
        //justifyContent: 'space-between',
    },
});