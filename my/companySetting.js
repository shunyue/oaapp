/**
 * Created by Administrator on 2017/6/12.
 */
/**
 * Created by Administrator on 2017/6/8.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    Alert,
    ScrollView,
    TouchableNativeFeedback,
    TouchableHighlight,
    TouchableOpacity,
    } from 'react-native';
import Header from '../common/header';
export default class CompanySetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text:'',
        };
    }
    OpBack() {
        this.props.navigation.goBack('CompanySetting')
        //this.props.navigation.navigate('My',{companyid:this.props.navigation.state.params.companyid})
    };
    depart(){
        this.props.navigation.navigate('DepartManager',{company_name: '顺越集团',company_id: 3})
    }
    render(){
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.ancestorCon}>
                <Header navigation = {this.props.navigation}
                        title = "企业设置"
                        onPress={()=>this.OpBack()}/>
                <ScrollView style={styles.childContent}>
                    <View style={styles.employeeManage}>
                        <Text style={styles.employeeManageTitle}>员工管理</Text>
                    </View>
                    <View style={styles.employeeManageContent}>
                        <TouchableHighlight
                            underlayColor={"#c5c5c5"}
                            onPress={()=>this.depart()}
                            >
                            <View style={[styles.employeeDepartManage,styles.border_bottom]}>
                                <View style={styles.tubiaoPosition}>
                                    <View style={styles.tubiaoBorder}>
                                        <Image  style={{width:16,height:14,tintColor:'#e15151'}} source={require('../imgs/depart.png')}/>
                                    </View>
                                    <View>
                                        <Text style={styles.wenzi}>部门管理</Text>
                                        <Text style={styles.wenzibu}>调整部门和员工</Text>
                                    </View>
                                </View>
                                <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor={'#fff'}
                            onPress={() => { navigate('AttendanceManage',{companyid: 3});}}
                            >
                            <View style={[styles.employeeDepartManage,styles.border_bottom]}>
                                <View style={styles.tubiaoPosition}>
                                    <View style={styles.tubiaoBorder}>
                                        <Image  style={{width:14,height:14,tintColor:'#e15151'}} source={require('../imgs/kaoqin.png')}/>
                                    </View>
                                    <View>
                                        <Text style={styles.wenzi}>考勤管理</Text>
                                        <Text style={styles.wenzibu}>设置员工上班时间</Text>
                                    </View>
                                </View>
                                <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor={'#fff'}
                            onPress={() => { navigate('OrientationManage',{ title: '考勤管理'});}}
                            >
                            <View style={[styles.employeeDepartManage]}>
                                <View style={styles.tubiaoPosition}>
                                    <View style={styles.tubiaoBorder}>
                                        <Image  style={{width:18,height:18,tintColor:'#e15151'}} source={require('../imgs/employeedw.png')}/>
                                    </View>
                                    <View>
                                        <Text style={styles.wenzi}>员工定位管理</Text>
                                        <Text style={styles.wenzibu}>设置员工定位轨迹和电子围栏</Text>
                                    </View>
                                </View>
                                <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.employeeManage}>
                        <Text style={styles.employeeManageTitle}>业务管理</Text>
                    </View>
                    <View style={styles.employeeManageContent}>
                        <View style={[styles.employeeDepartManage,styles.border_bottom]}>
                            <View style={styles.tubiaoPosition}>
                                <View style={[styles.tubiaoBorder,{borderColor:'#1297db'}]}>
                                    <Image  style={{width:15,height:15,tintColor:'#1297db'}} source={require('../imgs/muban.png')}/>
                                </View>
                                <View>
                                    <Text style={styles.wenzi}>模板管理</Text>
                                    <Text style={styles.wenzibu}>日程汇报，日志，审批的模板配置</Text>
                                </View>
                            </View>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                        <View style={[styles.employeeDepartManage,styles.border_bottom]}>
                            <View style={styles.tubiaoPosition}>
                                <View style={[styles.tubiaoBorder,{borderColor:'#1297db'}]}>
                                    <Image  style={{width:15,height:15,tintColor:'#1297db'}} source={require('../imgs/customer.png')}/>
                                </View>
                                <View>
                                    <Text style={styles.wenzi}>客户管理</Text>
                                    <Text style={styles.wenzibu}>栏位、分配、编辑权限等</Text>
                                </View>
                            </View>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                        <View style={[styles.employeeDepartManage,styles.border_bottom]}>
                            <View style={styles.tubiaoPosition}>
                                <View style={[styles.tubiaoBorder,{borderColor:'#1297db'}]}>
                                    <Image  style={{width:14,height:14,tintColor:'#1297db'}} source={require('../imgs/project.png')}/>
                                </View>
                                <View>
                                    <Text style={styles.wenzi}>项目管理</Text>
                                    <Text style={styles.wenzibu}>项目的自定义栏位</Text>
                                </View>
                            </View>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                        <View style={[styles.employeeDepartManage,styles.border_bottom]}>
                            <View style={styles.tubiaoPosition}>
                                <View style={[styles.tubiaoBorder,{borderColor:'#1297db'}]}>
                                    <Image  style={{width:16,height:16,tintColor:'#1297db'}} source={require('../imgs/chanpin.png')}/>
                                </View>
                                <View>
                                    <Text style={styles.wenzi}>产品管理</Text>
                                    <Text style={styles.wenzibu}>产品的分类管理</Text>
                                </View>
                            </View>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                        <View style={[styles.employeeDepartManage,styles.border_bottom]}>
                            <View style={styles.tubiaoPosition}>
                                <View style={[styles.tubiaoBorder,{borderColor:'#1297db'}]}>
                                    <Image  style={{width:20,height:20,tintColor:'#1297db'}} source={require('../imgs/qyapply.png')}/>
                                </View>
                                <View>
                                    <Text style={styles.wenzi}>企业应用管理</Text>
                                    <Text style={styles.wenzibu}>栏位、分配、编辑权限等</Text>
                                </View>
                            </View>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                        <View style={[styles.employeeDepartManage]}>
                            <View style={styles.tubiaoPosition}>
                                <View style={[styles.tubiaoBorder,{borderColor:'#1297db'}]}>
                                    <Image  style={{width:15,height:15,tintColor:'#1297db'}} source={require('../imgs/price.png')}/>
                                </View>
                                <View>
                                    <Text style={styles.wenzi}>价格表管理</Text>
                                    <Text style={styles.wenzibu}>产品价格表的编辑和分配</Text>
                                </View>
                            </View>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                    </View>

                    <View style={styles.employeeManage}>
                        <Text style={styles.employeeManageTitle}>CRM管理</Text>
                    </View>
                    <View style={styles.employeeManageContent}>
                        <View style={[styles.employeeDepartManage,styles.border_bottom]}>
                            <View style={styles.tubiaoPosition}>
                                <View style={[styles.tubiaoBorder,{borderColor:'#ee9f15'}]}>
                                    <Image  style={{width:20,height:20,tintColor:'#ee9f15'}} source={require('../imgs/sjgl.png')}/>
                                </View>
                                <View>
                                    <Text style={styles.wenzi}>商机管理</Text>
                                    <Text style={styles.wenzibu}>CRM销售阶段设置及审批设置</Text>
                                </View>
                            </View>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                        <View style={[styles.employeeDepartManage,styles.border_bottom]}>
                            <View style={styles.tubiaoPosition}>
                                <View style={[styles.tubiaoBorder,{borderColor:'#ee9f15'}]}>
                                    <Image  style={{width:16,height:16,tintColor:'#ee9f15'}} source={require('../imgs/xiansuo.png')}/>
                                </View>
                                <View>
                                    <Text style={styles.wenzi}>线索管理</Text>
                                    <Text style={styles.wenzibu}>栏位、分配、编辑权限等</Text>
                                </View>
                            </View>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                        <View style={[styles.employeeDepartManage,styles.border_bottom]}>
                            <View style={styles.tubiaoPosition}>
                                <View style={[styles.tubiaoBorder,{borderColor:'#ee9f15'}]}>
                                    <Image  style={{width:28,height:28,tintColor:'#ee9f15'}} source={require('../imgs/publicsea.png')}/>
                                </View>
                                <View>
                                    <Text style={styles.wenzi}>公海管理</Text>
                                    <Text style={styles.wenzibu}>项目的自定义栏位</Text>
                                </View>
                            </View>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                        <View style={[styles.employeeDepartManage,styles.border_bottom]}>
                            <View style={styles.tubiaoPosition}>
                                <View style={[styles.tubiaoBorder,{borderColor:'#ee9f15'}]}>
                                    <Image  style={{width:14,height:14,tintColor:'#ee9f15'}} source={require('../imgs/contract.png')}/>
                                </View>
                                <View>
                                    <Text style={styles.wenzi}>合同管理</Text>
                                    <Text style={styles.wenzibu}>产品的分类管理</Text>
                                </View>
                            </View>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                        <View style={[styles.employeeDepartManage,styles.border_bottom]}>
                            <View style={styles.tubiaoPosition}>
                                <View style={[styles.tubiaoBorder,{borderColor:'#ee9f15'}]}>
                                    <Image  style={{width:14,height:14,tintColor:'#ee9f15'}} source={require('../imgs/order.png')}/>
                                </View>
                                <View>
                                    <Text style={styles.wenzi}>订单管理</Text>
                                    <Text style={styles.wenzibu}>栏位、分配、编辑权限等</Text>
                                </View>
                            </View>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                        <View style={[styles.employeeDepartManage,styles.border_bottom]}>
                            <View style={styles.tubiaoPosition}>
                                <View style={[styles.tubiaoBorder,{borderColor:'#ee9f15'}]}>
                                    <Image  style={{width:15,height:15,tintColor:'#ee9f15'}} source={require('../imgs/free.png')}/>
                                </View>
                                <View>
                                    <Text style={styles.wenzi}>费用管理</Text>
                                    <Text style={styles.wenzibu}>产品价格表的编辑和分配</Text>
                                </View>
                            </View>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                        <View style={[styles.employeeDepartManage,styles.border_bottom]}>
                            <View style={styles.tubiaoPosition}>
                                <View style={[styles.tubiaoBorder,{borderColor:'#ee9f15'}]}>
                                    <Image  style={{width:16,height:16,tintColor:'#ee9f15'}} source={require('../imgs/backmoney.png')}/>
                                </View>
                                <View>
                                    <Text style={styles.wenzi}>回款管理</Text>
                                    <Text style={styles.wenzibu}>日程汇报，日志，审批的模板配置</Text>
                                </View>
                            </View>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                        <View style={[styles.employeeDepartManage,styles.border_bottom]}>
                            <View style={styles.tubiaoPosition}>
                                <View style={[styles.tubiaoBorder,{borderColor:'#ee9f15'}]}>
                                    <Image  style={{width:15,height:15,tintColor:'#ee9f15'}} source={require('../imgs/linkperson.png')}/>
                                </View>
                                <View>
                                    <Text style={styles.wenzi}>联系人管理</Text>
                                    <Text style={styles.wenzibu}>栏位、分配、编辑权限等</Text>
                                </View>
                            </View>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                        <View style={[styles.employeeDepartManage]}>
                            <View style={styles.tubiaoPosition}>
                                <View style={[styles.tubiaoBorder,{borderColor:'#ee9f15'}]}>
                                    <Image  style={{width:18,height:18,tintColor:'#ee9f15'}} source={require('../imgs/prevent.png')}/>
                                </View>
                                <View>
                                    <Text style={styles.wenzi}>防撞单模式</Text>
                                    <Text style={styles.wenzibu}>项目的自定义栏位</Text>
                                </View>
                            </View>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                    </View>

                    <View style={styles.employeeManage}>
                        <Text style={styles.employeeManageTitle}>高级功能</Text>
                    </View>
                    <View style={styles.employeeManageContent}>
                        <View style={[styles.employeeDepartManage,styles.border_bottom]}>
                            <View style={styles.tubiaoPosition}>
                                <View style={[styles.tubiaoBorder,{borderColor:'#11a23a'}]}>
                                    <Image  style={{width:15,height:15,tintColor:'#11a23a'}} source={require('../imgs/rubbsh.png')}/>
                                </View>
                                <View>
                                    <Text style={styles.wenzi}>数据回收站</Text>
                                    <Text style={styles.wenzibu}>已删除客户、模板和离职员工</Text>
                                </View>
                            </View>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                        <View style={[styles.employeeDepartManage,styles.border_bottom]}>
                            <View style={styles.tubiaoPosition}>
                                <View style={[styles.tubiaoBorder,{borderColor:'#11a23a'}]}>
                                    <Image  style={{width:15,height:15,tintColor:'#11a23a'}} source={require('../imgs/datasafe.png')}/>
                                </View>
                                <View>
                                    <Text style={styles.wenzi}>数据安全</Text>
                                    <Text style={styles.wenzibu}>显示水印防截图，手机号智能隐藏</Text>
                                </View>
                            </View>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                        <View style={[styles.employeeDepartManage]}>
                            <View style={styles.tubiaoPosition}>
                                <View style={[styles.tubiaoBorder,{borderColor:'#11a23a'}]}>
                                    <Image  style={{width:26,height:26,tintColor:'#11a23a'}} source={require('../imgs/mycom.png')}/>
                                </View>
                                <View>
                                    <Text style={styles.wenzi}>我的企业</Text>
                                    <Text style={styles.wenzibu}>修改企业名称。解散企业</Text>
                                </View>
                            </View>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ancestorCon: {
        flex: 1,
        backgroundColor: '#F0F1F2',
    },
    childContent: {//子容器页面级
        flex: 1
        //justifyContent: 'space-between',
    },
    employeeManage:{
        height:20,
        justifyContent:'center'
    },
    employeeManageTitle:{
        paddingLeft:15,
        fontSize:12,
    },
    employeeDepartManage:{
        height:40,
        backgroundColor: '#fff',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingLeft:10,
        paddingRight:10
    },
    tubiaoPosition:{
        flexDirection:'row',
        alignItems:'center',
    },
    tubiaoBorder:{
        width:28,
        height:28,
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#e15151',
        borderWidth:1,
        borderRadius:15,
        marginRight:10
    },
    tubiao:{
        width:16,
        height:14,
        tintColor:'#e15151',
    },
    employeeManageContent:{
        borderTopWidth:1,
        borderBottomWidth:1,
        borderColor:'#e8e8e8'
    },
    border_top:{
        borderTopWidth:1,
        borderColor:'#e8e8e8'
    },
    border_bottom:{
        borderBottomWidth:1,
        borderColor:'#e8e8e8'
    },
    wenzi:{
        fontSize:12,
        color:"#333"
    },
    wenzibu:{
        fontSize:10
    }
});