import React, { Component } from 'react';
import { AppRegistry,
    ListView,
    StyleSheet,
    View,
    Text,
    Button,
    ScrollView,
    Image
} from 'react-native';
export default class Home extends Component {

    render() {
        return (
            <View style={styles.ancestorCon}>
                {/*头部导航*/}
                <View style={styles.nav}>
                    <Image  style={styles.sz} source={require('../imgs/bb.png')}/>
                    <Text style={styles.fSelf}>首页</Text>
                    <Image style={styles.sz} source={require('../imgs/sz.png')}/>
                </View>
                <ScrollView style={styles.childContent}>
                    {/*顶部滚动模块*/}
                    <View style={[styles.topDiv]}>
                        {/*块级导航*/}
                        <View style={[styles.rowCon,styles.rowCon,styles.rowConFlexStart]}>
                            <View>
                                <Text style={styles.bestMark}>最新业绩</Text>
                            </View>
                            <View style={[styles.rowCon,styles.floatLeft]}>
                                <Text style={[styles.rowConCommonSize,styles.rowConCommonColor]}>本月</Text>
                                <Text style={[styles.rowConCommonText,styles.rowConCommonSize]}>本季度</Text>
                                <Text style={styles.rowConCommonSize}>本年度</Text>
                            </View>
                        </View>
                        {/*块级中间部分-业绩*/}
                        <View style={[styles.rowCon,styles.rowConSpaceBetween]}>
                            <View>
                                <Text style={[styles.textAlignCenter,styles.textMarginBottom15]}>0</Text>
                                <Text style={[styles.textFontSize11]}>已确认回款(万)</Text>
                            </View>
                            <View>
                                <Text
                                    style={[styles.textAlignCenter,styles.textMarginBottom15,styles.textFontSize30,styles.textTop]}>0</Text>
                                <Text style={[styles.textTop,styles.textFontSize18]}>总业绩(万)</Text>
                            </View>
                            <View>
                                <Text style={[styles.textAlignCenter,styles.textMarginBottom15]}>0</Text>
                                <Text style={[styles.textFontSize11]}>未确认回款(万)</Text>
                            </View>
                        </View>
                        {/*块级底部部分-居中-目标:0(万)*/}
                        <View style={[styles.rowCon,styles.rowConCenter]}>
                            <Text style={[styles.textMarginBottom20]}>目标:0(万)</Text>
                        </View>
                    </View>

                    {/*中间图标导航模块*/}
                    <View style={[styles.DIV]}>
                        <View style={[styles.DIVRowCon,styles.row,styles.rowSpaceBetween]}>
                            <View style={[styles.DIVRowConDiv]}>
                                <Image style={styles.DIVImg} source={require('../imgs/sj32.png')}/>
                                <Text>商机</Text>
                            </View>
                            <View style={[styles.DIVRowConDiv]}>
                                <Image style={styles.DIVImg} source={require('../imgs/ld32.png')}/>
                                <Text>礼单</Text>
                            </View>
                            <View style={[styles.DIVRowConDiv]}>
                                <Image style={styles.DIVImg} source={require('../imgs/ht32.png')}/>
                                <Text>合同</Text>
                            </View>
                            <View style={[styles.DIVRowConDiv]}>
                                <Image style={styles.DIVImg} source={require('../imgs/dd32.png')}/>
                                <Text>订单</Text>
                            </View>
                        </View>
                        <View style={[styles.DIVRowCon,styles.row,styles.rowSpaceBetween]}>
                            <View style={[styles.DIVRowConDiv]}>
                                <Image style={styles.DIVImg} source={require('../imgs/bb32i.png')}/>
                                <Text>报表</Text>
                            </View>
                            <View style={[styles.DIVRowConDiv]}>
                                <Image style={styles.DIVImg} source={require('../imgs/mb32.png')}/>
                                <Text>目标</Text>
                            </View>
                            <View style={[styles.DIVRowConDiv]}>
                                <Image style={styles.DIVImg} source={require('../imgs/gz32.png')}/>
                                <Text>审批</Text>
                            </View>
                            <View style={[styles.DIVRowConDiv]}>
                                <Image style={styles.DIVImg} source={require('../imgs/rz32.png')}/>
                                <Text>日志</Text>
                            </View>
                        </View>
                        <View style={[styles.DIVRowCon,styles.row,styles.rowSpaceBetween]}>
                            <View style={[styles.DIVRowConDiv]}>
                                <Image style={styles.DIVImg} source={require('../imgs/bd32.png')}/>
                                <Text>必达</Text>
                            </View>
                            <View style={[styles.DIVRowConDiv]}>
                                <Image style={styles.DIVImg} source={require('../imgs/gg32.png')}/>
                                <Text>公告</Text>
                            </View>
                            <View style={[styles.DIVRowConDiv]}>
                                <Image style={styles.DIVImg} source={require('../imgs/kq32.png')}/>
                                <Text>考勤</Text>
                            </View>
                            <View style={[styles.DIVRowConDiv]}>
                                <Image style={styles.DIVImg} source={require('../imgs/xlbf32.png')}/>
                                <Text>线路拜访</Text>
                            </View>
                        </View>
                        <View style={[styles.DIVRowCon,styles.row,styles.rowSpaceBetween]}>
                            <View style={[styles.DIVRowConDiv]}>
                                <Image style={styles.DIVImg} source={require('../imgs/xm32.png')}/>
                                <Text>项目</Text>
                            </View>
                            <View style={[styles.DIVRowConDiv]}>
                                <Image style={styles.DIVImg} source={require('../imgs/cp32.png')}/>
                                <Text>产品</Text>
                            </View>
                            <View style={[styles.DIVRowConDiv]}>
                                <Image style={styles.DIVImg} source={require('../imgs/jgb32.png')}/>
                                <Text>价格表</Text>
                            </View>
                            <View style={[styles.DIVRowConDiv]}>
                                <Image style={styles.DIVImg}/>
                                <Text></Text>
                            </View>
                        </View>

                    </View>

                    {/*底部三大功能模块*/}
                    <View style={[styles.threeDIVCON]}>
                        {/*今日日程*/}
                        {/*头部*/}
                        <View style={[styles.threeSpaceBetween,styles.row]}>
                            <Text
                                style={[styles.borderLeft,styles.paddingLeft,styles.threeDIVCONTITHei,styles.threeDIVCONTITSiz]}>今日日程</Text>
                            <View style={[styles.threeSpaceBetween,styles.row]}>
                                <Text style={[styles.threeDIVCONTITSiz,styles.threeDIVCONTITPadR]}>导航</Text>
                                <Image source={require('../imgs/threefj32.png')}/>
                            </View>
                        </View>
                        {/*内容*/}
                        <View style={[styles.threeTwoCenter]}>
                            <View style={[styles.row]}>
                                <Image source={require('../imgs/rc16.png')}/>
                                <Text style={[styles.threeText]}>
                                    您今天还没有日程
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.threeDIVCON]}>
                        {/*重点关注*/}
                        {/*头部*/}
                        <View style={[styles.row]}>
                            <Text
                                style={[styles.borderLeft,styles.paddingLeft,styles.threeDIVCONTITHei,styles.threeDIVCONTITSiz]}>重点关注</Text>
                        </View>
                        {/*内容*/}
                        <View style={[styles.threeTwoCenter]}>
                            <View style={[styles.row]}>
                                <Image source={require('../imgs/gcon16.png')}/>
                                <Text style={[styles.threeText]}>
                                    您还没有关注客户的动态
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.threeDIVCON]}>
                        {/*待审批*/}
                        {/*头部*/}
                        <View style={[styles.row]}>
                            <Text
                                style={[styles.borderLeft,styles.paddingLeft,styles.threeDIVCONTITHei,styles.threeDIVCONTITSiz]}>待审批</Text>
                        </View>
                        {/*内容*/}
                        <View style={[styles.threeTwoCenter]}>
                            <View style={[styles.row]}>
                                <Image source={require('../imgs/gcon16.png')}/>
                                <Text style={[styles.threeText]}>
                                    您没有待审批的内容
                                </Text>
                            </View>
                        </View>
                    </View>

                </ScrollView>

            </View>

        );

    }
}
;

const styles = StyleSheet.create({
    ancestorCon: {//祖先级容器
        flex: 1,
        backgroundColor: '#EEEFF4'
    },
    nav: {//头部导航
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: '#EA3B49',
        padding: 5
    },
    sz: {//导航图标
        width: 30,
        height: 30
    },
    fSelf: {//导航字体相关
        color: '#fff',
        height: 30,
        fontSize: 20
    },
    childContent: {//子容器页面级
        flex: 1,

        //justifyContent: 'space-between',
    },
    topDiv: {
        height: 170,
        backgroundColor: '#fff',
        //width: 290,

        margin: 15,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#fcf',
        justifyContent: 'space-between',
        paddingTop: 10
    },
    row: {//行级布局
        flexDirection: 'row',
    },
    rowCon: {//行级元素左浮动
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    rowConFlexStart: {//左浮动
        justifyContent: 'flex-start',//左浮动
    },
    rowConSpaceBetween: {//公共级平均分布
        justifyContent: 'space-between',//一行平均分布
        padding: 10,
        marginTop: 10
    },
    rowSpaceBetween: {//平均分布
        justifyContent: 'space-between',//一行平均分布
        //alignItems: 'center',
        padding: 10,
    },
    rowConCenter: {//公共级分布
        justifyContent: 'center',//居中
    },
    bestMark: {
        backgroundColor: '#FF7C7C',
        color: '#fff',
        borderRadius: 3,
        padding: 3
    },
    floatLeft: {
        borderWidth: 1,
        borderColor: '#fcf',
        borderRadius: 10,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 12,
        paddingRight: 12,
        marginLeft: 5

    },
    rowConCommonText: {
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 10,
        marginRight: 10,
        borderLeftWidth: 1,
        borderColor: '#D0D0D0',
        borderRightWidth: 1,

    },
    rowConCommonSize: {
        fontSize: 12
    },
    rowConCommonColor: {
        color: '#000'
    },
    textAlignCenter: {
        textAlign: 'center',
        color: '#FF5362'
    },
    textMarginBottom15: {
        marginBottom: 5
    },
    textFontSize30: {
        fontSize: 30
    },
    textTop: {
        top: -15
    },
    textFontSize18: {
        fontSize: 18
    },
    textFontSize11: {
        fontSize: 11
    },
    textMarginBottom20: {
        marginBottom: 20
    },
    //图标导航部分
    DIV: {
        height: 350,
        paddingLeft: 10,
        paddingRight: 15,
        backgroundColor: '#fff'
    },
    DIVRowCon: {
        height: 50,
        marginBottom: 37
    },
    DIVImg: {
        marginBottom: 5
    },
    DIVRowConDiv: {
        height: 50,
        width: 72,
        alignItems: 'center'
    },

    //三大功能模块区域
    //公共部分
    //height,marginTop/bottom,bgcolor
    threeDIVCON: {
        height: 100,
        marginTop: 15,
        marginBottom: 5,
        backgroundColor: '#fff',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 8,
    },
    threeTwoCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    threeSpaceBetween: {
        justifyContent: 'space-between',//一行平均分布
    },
    borderLeft: {
        borderLeftWidth: 2,
        borderLeftColor: '#7D7D7D',
    },
    paddingLeft: {
        paddingLeft: 15
    },
    threeDIVCONTITHei: {
        height: 14,
        top: -1
    },
    threeDIVCONTITSiz: {
        fontSize: 12,
    },
    threeDIVCONTITPadR: {
        paddingRight: 3
    },
    threeText: {
        fontSize: 12,
        color: '#D0D0D0',
        marginLeft:5
    },



});
