import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    DeviceEventEmitter
} from 'react-native';
import Header from '../../common/header';
import config from '../../common/config';
import toast from '../../common/toast';
import request from '../../common/request';
export default class CompanyName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company_name: this.props.navigation.state.params.company_name
        }
    }
    _confirm() {
        DeviceEventEmitter.emit('companyName',this.state.company_name);
        this.props.navigation.goBack(null);

    }
    render() {
        return (
            <View style={styles.container}>
                <Header navigation={this.props.navigation}
                        title="企业名称"
                        rightText="确定"
                        onPress={()=>{this._confirm()}}/>
                <TextInput
                    placeholder={'请输入企业名称'}
                    returnKeyType="next"
                    returnKeyLabel={"下一步"}
                    underlineColorAndroid={"transparent"}
                    placeholderTextColor ={"#CFCFCF"}
                    style={styles.inputStyle}
                    onChangeText={(company_name)=>{this.setState({company_name})}}
                    value={this.state.company_name}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    inputStyle: {
        paddingLeft: 10,
        marginTop: 10,
        backgroundColor: '#fff',
        height: 50,
        flexDirection: 'row'
    }
});