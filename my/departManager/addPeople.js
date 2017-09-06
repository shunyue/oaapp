
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight
} from 'react-native';
import Header from '../../common/header';
import config from '../../common/config';
import request from '../../common/request';
import toast from  '../../common/toast';
export default class AddPeople  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyCode: ''
        }
    }

    componentDidMount() {
        var url =config.api.base + config.api.getCompanyCode;
        const {params} = this.props.navigation.state;
        request.post(url,{
            company_id: params.company_id
        }).then((res) => {
            if(res.status == 1) {
                this.setState({
                    companyCode: res.data.company_code
                })
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }
    _selectPeople() {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('SelectPeople',{depart_id: params.high_depart_id,depart_name: params.high_depart_name,company_id: params.company_id,company_name: params.company_name});
    }
    render() {
        return (
            <View style={styles.container}>
                <Header navigation = {this.props.navigation}
                        title = "添加员工"/>
                <View style={styles.contentStyle}>
                    <Text style={styles.codeStyle}>企业代码：{this.state.companyCode}</Text>
                    <Text style={styles.tipText}>让同事主动加人，申请时填写企业代码</Text>
                </View>
                <View style={styles.contentContainer}>
                    <TouchableHighlight onPress={()=>this._selectPeople()}
                                        underlayColor='#F3F3F3'>
                    <View style={styles.listRowContent}>
                        <View style={styles.imgContainer}>
                            <Image style={styles.imgStyle}
                               source={require('../../imgs/select_item.png')}/>
                        </View>
                        <View>
                            <Text style={styles.chooseText}>选择下属员工</Text>
                            <Text>选择员工转移至[顺越集团]</Text>
                        </View>
                    </View>
                    </TouchableHighlight>
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
    contentStyle: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgContainer: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#31C8FE',
    },
    imgStyle: {
        width: 20,
        height: 20,
        tintColor: '#fff'
    },
    codeStyle: {
        fontSize: 22,
        color: '#e4393c'
    },
    tipText: {
        marginTop: 16,
        fontSize: 12,
    },
    contentContainer: {
        backgroundColor: '#fff'
    },

    listRowContent: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
    },
    chooseText: {
        color: '#000'
    }

});