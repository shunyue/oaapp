//新增合同
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image,
    Platform,
    ScrollView,
    Dimensions,
    ListView,
    Alert,
    TextInput,
    DeviceEventEmitter,
    TouchableOpacity,
    Picker,
} from 'react-native';
const screenW = Dimensions.get('window').width;

import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';

import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

export default class newBulidContract extends Component {


    constructor(props) {
        super(props);
        this.state={
            addproductsing:[],//新增产品的标识
            signtime:'',//签订日期
            approver_people:[],//审批人

            customer_name:'',//客户名称
            customer_id:'',//客户id

            customer_linkman_name:'',// 客户联系人姓名
            customer_linkman_id:'',//客户联系人id

            signman_name:'',//签单人姓名
            signman_id:'',//签单人的id

            contract_name:'',//合同名称
            contract_jine:'',//合同金额

            product_name_0:'',//固有的商品名称
            product_id_0:'',//固有的商品id
            product_price_0:'',//固有的商品单价
            product_num_0:'',//固有的商品数量
            product_total_prices_0:'',//固有的商品总价


        };

    }




    componentDidMount() {

        //客户 公司
        this.subscription = DeviceEventEmitter.addListener('choosecustomer',(value) => {
            this.setState({
                customer_name:value[0].cus_name,
                customer_id:value[0].id,
            })
        })

        //客户公司的联系人
        this.subscription = DeviceEventEmitter.addListener('choosecustomer_linkman',(value) => {
            this.setState({
                customer_linkman_name:value[0].con_name,
                customer_linkman_id:value[0].id,
            })
        })

        //产品
        this.subscription = DeviceEventEmitter.addListener('chooseproduct',(value) => {
            //console.log(value);
            //console.log(value['data'][0].product_name);
            //判断是固有产品还是新增的产品
            if(value.select_product_sing==0){
                this.setState({
                    product_name_0:value['data'][0].product_name,//固有的商品名称
                    product_id_0:value['data'][0].id,//固有的商品id
                    product_price_0:value['data'][0].product_price,//固有的商品单价
                })
            }else{
                var productidsing='product_id_'+value.select_product_sing;
                var productnamesing='product_name_'+value.select_product_sing;
                var productpricesing='product_price_'+value.select_product_sing;
                this.setState({
                    [productnamesing]:value['data'][0].product_name,//新增的商品名称
                    [productidsing]:value['data'][0].id,//新增的商品id
                    [productpricesing]:value['data'][0].product_price,//新增的商品单价
                })
            }
        })


        //审批人
        this.subscription = DeviceEventEmitter.addListener('choosePeople',(value) => {
            this.setState({
                approver_people:value,
            })
        })


        //通过 user_id  查找 登录姓名
        var url = config.api.base + config.api.select_username;
        request.post(url,{
            user_id: this.props.navigation.state.params.user_id,
        }).then((result)=> {
            this.setState({
                signman_name:result
            })

        })

    }


    componentWillUnmount() {
        this.subscription.remove();
    }


    back() {
        this.props.navigation.goBack(null);
    }


    //选择审批人
    select_approve_peopel(){
        this.props.navigation.navigate('select_approve_peopel',{selected_peopel:this.state.approver_people});
    }

    //选择客户
    select_customer(){
        this.props.navigation.navigate('select_customer',{user_id:this.props.navigation.state.params.user_id,customer_id:this.state.customer_id});
    }

    //选择客户联系人
    select_customerlinkman(){
        this.props.navigation.navigate('select_customer_linkman',{customer_id:this.state.customer_id,customer_linkman_id:this.state.customer_linkman_id });
    }

    //选择产品 当没有新增产品时e 是0  当有新增的产品时 测试新增产品标识
    select_product(e){
        var productidsing='product_id_'+e;//把已经选中的产品选中的
        this.props.navigation.navigate('select_product',{company_id:this.props.navigation.state.params.company_id,select_product_sing:e ,product_id:this.state[productidsing]});
    }



    //点击确认按钮
    submmit() {

           //判断基本信息是否为空
            if(this.state.customer_id==''|| this.state.customer_linkman_id==''||this.state.contract_name==''||this.state.signtime==''||this.state.contract_jine==''){
                return toast.center('基本信息不能为空');
            }

          //判断产品信息是否为空 固有产品和新增的产品
           if(this.state.product_name_0==''||this.state.product_price_0==''||this.state.product_num_0==''||this.state.product_total_prices_0==''){
               return toast.center('产品信息不能为空');
           }

        //说明有新增的产品
        if(this.state.addproductsing.length!=0){
            for(var i in this.state.addproductsing){
                var productnamemark='product_name_'+this.state.addproductsing[i];
                var productpricemark='product_price_'+this.state.addproductsing[i];
                var productnummark='product_num_'+this.state.addproductsing[i];
                var producttotalpricemark='product_total_prices_'+this.state.addproductsing[i];
                if(this.state[productnamemark]==undefined||this.state[productpricemark]==undefined||this.state[productnummark]==undefined||this.state[producttotalpricemark]==undefined){
                    return toast.center('产品信息不能为空');
                }
            }
        }
          //判断审批人是否为空
          if(this.state.approver_people.length==0){
              return toast.center('审批人不能为空');
          }



         //产品信息 固有和新增
        var product_info=[];
        product_info.push({product_id:this.state.product_id_0,product_count:this.state.product_num_0,product_total:this.state.product_total_prices_0});



        if(this.state.addproductsing.length!=0){
            for(var i in this.state.addproductsing){
                var productidmark='product_id_'+this.state.addproductsing[i];
                var productnummark='product_num_'+this.state.addproductsing[i];
                var producttotalpricemark='product_total_prices_'+this.state.addproductsing[i];
                product_info.push({product_id:this.state[productidmark],product_count:this.state[productnummark],product_total:this.state[producttotalpricemark]});
            }

        }



        var url = config.api.base + config.api.add_contract;
        request.post(url,{
               customer_id: this.state.customer_id,    //客户id
               customer_linkman_id:  this.state.customer_linkman_id,      //客户联系人id
               contract_name:  this.state.contract_name ,    //合同名称
               sign_time:this.state.signtime ,             //签订日期
               sign_peopel: this.props.navigation.state.params.user_id,       //签单人id
               contract_jine: this.state.contract_jine ,    //合同金额

               company_id:this.props.navigation.state.params.company_id,       //签单人公司id

               product_info:product_info,//产品信息
               approve_peopel:this.state.approver_people,      //审批人


        }).then((responseJson) => {

            if(responseJson.sing==1){
                toast.center(responseJson.msg);

                DeviceEventEmitter.emit('user_id',this.props.navigation.state.params.user_id);
                this.props.navigation.goBack(null);


            }else{
                toast.center(responseJson.msg);
            }

        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    };
    //点击确认按钮



    //继续添加产品
    addproduct() {
        //如果添加产品标识的数 没有值 就设置初始值1  如果有 取当前最大的值 加一在 push 到标识数组中
        // 这样就保证了 标识的数字没有重复值
        if (this.state.addproductsing.length == 0) {
            maxnumber = 1
        } else {

            for(var i in this.state.addproductsing){
                var productnamesing1='product_name_'+this.state.addproductsing[i];
                var productpricesing1='product_price_'+this.state.addproductsing[i];
                var productnumsing1='product_num_'+this.state.addproductsing[i];

                   if(this.state[productnamesing1]==undefined||this.state[productpricesing1]==undefined||this.state[productnumsing1]==undefined){

                        return toast.center('请完善产品信息');
                   }else{
                      var maxnumber = Math.max.apply(null, this.state.addproductsing) - (-1);
                   }
            }

        }

        this.state.addproductsing.push(maxnumber);

        this.setState({})

    }

    //继续添加产品

    //删除产品
    del_product(e){
        this.state.addproductsing.splice(e,1); // e 索引值 1 是删除的长度
        this.setState({
        })
    }
    //删除产品

    //当你 删除完  标识的数组值已经发生改变
    if_isset(e){
        for(var i  in this.state.addproductsing){
            if(this.state.addproductsing[i]==e){
                return true;
            }else{
                return false;
            }
        }
    }

    //计算总价  直接手填 计算有bug
    //countprice(e){
    //
    //
    //    var product_total_prices_sing='product_total_prices_'+e;
    //    var product_price_sing='product_price_'+e;
    //    var product_num_sing='product_num_'+e;
    //    var zongjine=this.state[product_price_sing]*this.state[product_num_sing];
    //    var zongjinestring=zongjine.toString();
    //
    //
    //    this.setState({
    //        [product_total_prices_sing]:zongjinestring,
    //    })
    //}


    render() {


        var isPickerVisible=''; //时间插件用

        //审批人
        var approverlist=[];
        for(var i in this.state.approver_people){
            approverlist.push(
                <View style={{flexDirection: 'row',alignItems: 'center'}} key={i}>
                    <View style={{paddingLeft:screenW*0.025,paddingTop:screenW*0.02,}}>
                        <Image style={{width:screenW*0.1,height:screenW*0.1,borderColor:'#d3d3d3',borderWidth:1,borderRadius:screenW*0.05}} source={{uri: this.state.approver_people[i]['avatar']}}/>
                        <Text style={{fontSize:12}}>{this.state.approver_people[i]['name']}</Text>
                    </View>
                    {this.state.approver_people[i-(-1)] &&<Image style={{height:16,width: 16}}
                                                                 source={require('../../imgs/rjt.png')}/>}
                </View>
            )
        }
        //审批人



        //继续添加产品
        var addproduct=[];
        var productsinglist=this.state.addproductsing;
        if(this.state.addproductsing.length>=1){

            //当标识不在 标识数组中  就让其隐藏
            for(var i in productsinglist) {

                if(this.if_isset(productsinglist[i]==false)){
                    addproduct.push(
                        <View key= {productsinglist[i]}  style={{display:'none'}}>
                            <View style={[styles.divRowCom1]}>
                                <Text style={[styles.divFontCom]}>产品信息{i-(-1)}</Text>
                                <Text   onPress={this.del_product.bind(this,i)} style={[styles.divFontCom]}>x</Text>
                            </View>


                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>产品名称</Text>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    editable={false}
                                    placeholderTextColor="#A2A2A2"
                                    onChangeText={(name) => this.setState({name})}
                                    placeholder="请选择(必填)"
                                />
                                <Text>  > </Text>

                            </View>
                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>单价</Text>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    placeholderTextColor="#A2A2A2"
                                    editable={false}
                                    onChangeText={(name) => this.setState({name})}
                                    placeholder="请填写(必填)"
                                />
                            </View>

                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>数量</Text>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    placeholderTextColor="#A2A2A2"
                                    onChangeText={(name) => this.setState({name})}
                                    placeholder="请填写(必填)"
                                />
                            </View>

                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>总价</Text>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    placeholderTextColor="#A2A2A2"
                                    onChangeText={(name) => this.setState({name})}
                                    placeholder="请填写(必填)"
                                />
                            </View>
                        </View>
                    )

                }else{

                    var productnamesing='product_name_'+productsinglist[i];
                    var productpricesing='product_price_'+productsinglist[i];
                    var productnumsing='product_num_'+productsinglist[i];
                    var producttotalpricesing='product_total_prices_'+productsinglist[i];

                    addproduct.push(
                        <View key= {productsinglist[i]} >
                            <View style={[styles.divRowCom1]}>
                                <Text style={[styles.divFontCom]}>产品信息{i-(-1)}</Text>
                                <Text   onPress={this.del_product.bind(this,i)} style={[styles.divFontCom]}>x</Text>
                            </View>


                            <TouchableOpacity  onPress= {this.select_product.bind(this,productsinglist[i])}>
                                <View style={[styles.divRowCom]}>
                                    <Text style={[styles.divFontCom]}>产品名称</Text>
                                    <TextInput
                                        style={styles.inputStyle}
                                        underlineColorAndroid={'transparent'}
                                        editable={false}
                                        placeholderTextColor="#A2A2A2"
                                        value={this.state[productnamesing]}
                                        placeholder="请选择(必填)"
                                    />
                                    <Text>  > </Text>

                                </View>
                            </TouchableOpacity>





                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>单价</Text>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    placeholderTextColor="#A2A2A2"
                                    editable={false}
                                    value={this.state[productpricesing]}
                                    placeholder="请填写(必填)"
                                />
                            </View>

                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>数量</Text>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                 /*   onEndEditing={this.countprice.bind(this,productsinglist[i])}*/
                                    placeholderTextColor="#A2A2A2"

                                    onChangeText={(t) => this.setState({[productnumsing]:t})}
                                    placeholder="请填写(必填)"
                                />
                            </View>

                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>总价</Text>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    placeholderTextColor="#A2A2A2"
                                  /*  value={this.state[producttotalpricesing]}*/
                                    onChangeText={(t) => this.setState({[producttotalpricesing]:t})}
                                    placeholder="请填写(必填)"
                                />
                            </View>
                        </View>
                    )
                }

            }
        }















        return (
            <View style={styles.body}>
                {/*导航栏*/}
                <View style={styles.nav}>
                    <TouchableHighlight
                        onPress={()=>this.back()}
                        underlayColor="#d5d5d5"
                    >
                        <View style={styles.navltys}>
                            <Image source={require('../../imgs/navxy.png')}/>
                            <Text style={[styles.fSelf,styles.navltyszt]}>返回</Text>
                        </View>

                    </TouchableHighlight>
                    <Text style={styles.fSelf}>新增合同</Text>
                    <TouchableHighlight

                        underlayColor="#d5d5d5"
                    >
                        <View style={styles.navltys}>
                            <Text  onPress={this.submmit.bind(this)} style={styles.navFont}>确定</Text>
                        </View>

                    </TouchableHighlight>
                </View>



                <ScrollView style={styles.childContent}>
                    <View style={[styles.ancestorCon]}>
                        <View style={[styles.divCom]}>

                            <TouchableOpacity  onPress= { () => {this.select_customer()}}>
                                <View style={[styles.divRowCom]}>
                                    <Text style={[styles.divFontCom]}>客户名称</Text>
                                    <TextInput
                                        style={styles.inputStyle}
                                        underlineColorAndroid={'transparent'}
                                        placeholderTextColor="#A2A2A2"
                                        value={this.state.customer_name}
                                        editable={false}
                                        placeholder="请选择(必填)"
                                    />
                                    <Text>  > </Text>
                                </View>
                            </TouchableOpacity>


                            <TouchableOpacity  onPress= { () => {this.select_customerlinkman()}}>
                                <View style={[styles.divRowCom]}>
                                    <Text style={[styles.divFontCom]}>客户联系人</Text>
                                    <TextInput
                                        style={styles.inputStyle}
                                        underlineColorAndroid={'transparent'}
                                        placeholderTextColor="#A2A2A2"
                                        value={this.state.customer_linkman_name}
                                        editable={false}
                                        placeholder="请选择(必填)"
                                    />
                                    <Text>  > </Text>
                                </View>
                            </TouchableOpacity>


                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>合同名称</Text>


                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    placeholderTextColor="#A2A2A2"
                                    onChangeText={(contract_name) => this.setState({contract_name})}
                                    placeholder="请输入文本(必填)"
                                />

                            </View>





                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>签订日期</Text>

                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    placeholderTextColor="#A2A2A2"
                                    placeholder="请选择时间(必填)"
                                    editable={false}
                                    value={this.state.signtime}
                                />

                                <TouchableOpacity  onPress= { () => {this.setState({ [isPickerVisible]:true });}}>
                                    <Image style={{marginLeft:10,width:20,height:20}} source={require('../../imgs/icon_shenpi/rili.png')}/>
                                </TouchableOpacity>

                                <DateTimePicker
                                    cancelTextIOS = "取消"
                                    confirmTextIOS = "确定"
                                    titleIOS = "选择日期"
                                    mode="date"
                                    is24Hour={true}
                                    datePickerModeAndroid="spinner"
                                    isVisible={this.state[isPickerVisible]}
                                    onConfirm={(date) => {this.setState({signtime: moment(date).format('YYYY-MM-DD'),[isPickerVisible]: false })}}
                                    onCancel={() => this.setState({ [isPickerVisible]: false })}
                                />




                            </View>


                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>签单人</Text>


                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    value={this.state.signman_name}
                                    placeholderTextColor="#A2A2A2"
                                    editable={false}
                                    placeholder="请输入文本(必填)"
                                />


                            </View>


                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>合同金额</Text>


                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(contract_jine) => this.setState({contract_jine})}
                                    placeholderTextColor="#A2A2A2"
                                    placeholder="请输入文本(必填)"
                                />

                            </View>




                            <View style={[styles.divRowCom1]}>
                                <Text style={[styles.divFontCom]}>产品信息</Text>
                            </View>


                            <TouchableOpacity  onPress= { () => {this.select_product(0)}}>
                                <View style={[styles.divRowCom]}>
                                    <Text style={[styles.divFontCom]}>产品名称</Text>
                                    <TextInput
                                        style={styles.inputStyle}
                                        underlineColorAndroid={'transparent'}
                                        editable={false}
                                        placeholderTextColor="#A2A2A2"
                                        value={this.state.product_name_0}
                                        placeholder="请选择(必填)"
                                    />
                                    <Text>  > </Text>
                                </View>
                            </TouchableOpacity>



                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>单价</Text>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    placeholderTextColor="#A2A2A2"
                                    editable={false}
                                    value={this.state.product_price_0}
                                    placeholder="请填写(必填)"
                                />
                            </View>

                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>数量</Text>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    placeholderTextColor="#A2A2A2"
                                /*    onEndEditing={this.countprice.bind(this,0)}*/
                                    onChangeText={(product_num_0) => {this.setState({product_num_0});}}
                                    placeholder="请填写(必填)"
                                />
                            </View>

                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>总价</Text>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    placeholderTextColor="#A2A2A2"
                                /*    value={this.state.product_total_prices_0}*/
                                    onChangeText={(product_total_prices_0) => {this.setState({product_total_prices_0});}}
                                    placeholder="请填写(必填)"
                                />
                            </View>


                            {addproduct}

                            <TouchableOpacity   onPress={()=>this.addproduct()}>
                                <View style={[styles.divRowCom,{justifyContent:'center'}]}>
                                    <Image  style={{width:20,height:20,marginRight:10}} source={require('../../imgs/add.png')} />
                                    <Text style={[styles.divFontCom1]}>继续添加产品</Text>
                                </View>
                            </TouchableOpacity>






                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>审批人</Text>
                                <TouchableOpacity   onPress={()=>this.select_approve_peopel()}>
                                    <Image style={{marginLeft:30,width:20,height:20}} source={require('../../imgs/icon_shenpi/jiahao.png')}/>
                                </TouchableOpacity>
                            </View>





                            <View style={{flexDirection:'row',flexWrap:'wrap',paddingBottom:screenW*0.02}}>
                                {approverlist}
                            </View>



                        </View>
                    </View>
                </ScrollView>






            </View>
        )

    }
}

const styles = StyleSheet.create({
    //nav
    navltys: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: (Platform.OS === 'ios') ? 50 : 30,
        alignItems: 'center',
    },
    navltyszt: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#e4393c',
    },

    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    body: {//祖先级容器
        flex: 1,
        backgroundColor: '#f8f8f8'
    },
    nav: {//头部导航
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#bbb',
    },
    sz: {//导航图标
        width: 30,
        height: 30
    },
    fSelf: {//导航字体相关
        color: '#000',
        //height: 30,
        fontSize: 16
    },
    navltysImg: {
        width: 24,
        height: 24,
    },
//    主题内容
    childContent: {//子容器页面级
        flex: 1,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#F8F8F8',
    },

    //页签切换
    ancestorCon: {//祖先级
        //flex: 1,
    },
    divTit: {//祖级--区域-主题内容title部分
        flexDirection: 'row',
        //justifyContent: 'space-around',
        height: 30,
        paddingTop: 5,
        marginBottom: 10,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#e3e3e3',
    },
    eleCon: {//父级-块
        width: screenW * 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#a4a4a4',
    },
    eleFontCon: {//子级-字体
        fontSize: 12,
    },
    eleSelf: {//私有级
        borderRightWidth: 1,
        borderColor: '#e3e3e3',
    },
    eleImgCon: {//子级-图片
        marginRight: 5,
    },

    //内容模块
    divCom: {//祖先级-区域
        flex:1,
    },
    rowCom: {//祖级-行
        paddingLeft:15,
        paddingRight:15,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:'#fff',
        borderTopWidth:1,
        borderBottomWidth:1,
        borderColor:'#F1F2F3',
    },

    eleTopCom: {//父级-块
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom:5
    },
    comLeft:{//次父级-次级块

    },
    comRight:{//次父级-次级块

    },
    elefontCom:{//子级-E
        fontSize:10,
        color:'#969696',
    },


    eleBottomCom: {//父级-块
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems:'center',
    },
    navltysImgSelf:{//子级-E-图片-文件夹
        width:14,
        height:14,
    },


//    内容区域
    divRowCom:{//父级-行
        paddingLeft:15,
        paddingRight:15,
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderColor:'#F3F3F3',
        height: 40,
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center'
    },

    divRowCom1:{//父级-行
        paddingLeft:15,
        paddingRight:15,
        backgroundColor:'#F8F8F8',
        borderBottomWidth:1,
        borderColor:'#F3F3F3',
        height: 30,
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center'
    },
    divFontCom:{//子级-E
        color:'#939393',
    },
    divFontCom1:{//子级-E
        color:'red',
    },
    divRowSelf:{//私有级
        paddingLeft:15,
        paddingRight:15,
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderColor:'#F3F3F3',
    },
    divFontSelf:{//私有级
        marginTop:10
    },
    divRowSelfBottomBorder:{
        borderBottomWidth:1,
        borderBottomColor:'#E9E9E9',
    },
    inputStyle: {
        height: 40,
        width:245,
        fontSize: 12,
        color: '#333'
    }
});
