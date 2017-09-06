/**
 * Created by Administrator on 2017/8/18.
 * 周飞飞  编辑已经分解后的目标
 */
/**
 * Created by Administrator on 2017/8/15.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableHighlight,
    ScrollView,
    TextInput,
    TouchableWithoutFeedback,
    DeviceEventEmitter,
    } from 'react-native';
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';

const screenH = Dimensions.get('window').height;
const screenW = Dimensions.get('window').width;
export default class EditResolve extends Component {
    OpBack() {
        this.props.navigation.goBack('EditResolve')
    }
    constructor(props) {
        super(props);
        this.state = {
            dataInfo:[],
            resolver_0:'',
            total_money:0,
            totaled_money:0,
            total_examine:0,
            totaled_examine:0,
            sell_money:0,
            selled_money:0,
            sell_examine:0,
            selled_examine:0,
            total_center_money:0,
            total_center_examine:0,
            sell_center_money:0,
            sell_center_examine:0,
            total_money_0:'',
            total_examine_0:'',
            sell_number_0:'',
            sell_examine_0:'',
            load:true,
            pname:[],
            addproductsing:[],
            listArr:[],
            content:"重新分解",
        };
    }
    componentDidMount() {
        this.getResolverId= DeviceEventEmitter.addListener('resolve_modify', (value)=>{
            //判断是固有产品还是新增的产品
            var id='id_'+value.select_product_sing;
            var productidsing='resolver_did_'+value.select_product_sing;
            var productnamesing='resolver_'+value.select_product_sing;
            var productconsing='confirm_'+value.select_product_sing;
            this.setState({
                [id]:value.info.id,
                [productnamesing]:value.pname,//新增的商品名称
                [productidsing]:value.pid,//新增的商品id
                [productconsing]:value.confirm,
            })
            var arr=this.state.pname;
            for(var i in arr){
                if(arr[i]==value.pname) {
                    toast.center('该分解者已存在，不可重复添加');
                    return false;
                }else{
                    if (value.select_product_sing == i) {
                        arr[i] = value.pname;
                    }
                }
            }
            this.setState({
                pname: arr,
            });
        }  )

        this.firstProduce();
    }
    componentWillUnmount() {
        this.getResolverId.remove();
    }
    firstProduce(){
        var url=config.api.base + config.api.resolveGoal;
        request.post(url,{
            company_id: this.props.navigation.state.params.company_id,
            target_id:this.props.navigation.state.params.target_id,
            resolved_target:1,
        }).then((responseJson) => {
            this.setState({
                dataInfo:responseJson.data.dataInfo,
                total_money:responseJson.data.total_money,
                totaled_money:0,
                total_examine:responseJson.data.total_examine,
                totaled_examine:0,
                sell_number:responseJson.data.sell_number,
                selled_number:0,
                sell_examine:responseJson.data.sell_examine,
                selled_examine:0,
                resolveData:responseJson.data.resolve,
                total_1: responseJson.data.total_money,
                total_2: responseJson.data.total_examine,
                sell_1: responseJson.data.sell_number,
                sell_2: responseJson.data.sell_examine,
            });
            var reslove=this.state.resolveData;
            for(var i in reslove){
                this.state.pname.push(reslove[i].name)
                var resolveid='id_'+i;
                var resolveidsing='resolver_did_'+i;
                var resolvenamesing='resolver_'+i;
                var resolveconsing='confirm_'+i;
                var resolvetotalsing='total_money_'+i;
                var resolvenumsing= "total_examine_"+i;
                var resolvesellsing='sell_number_'+i;
                var resolvesellnumsing='sell_examine_'+i;
                this.setState({
                    [resolveid]:reslove[i].id,
                    [resolveidsing]:reslove[i].name,//新增的商品名称
                    [resolvenamesing]:i,//新增的商品id
                    [resolveconsing]:reslove[i].confirm,
                    [resolvetotalsing]:reslove[i].total_money,
                    [resolvenumsing]:reslove[i].total_examine,
                    [resolvesellsing]:reslove[i].sell_number,
                    [resolvesellnumsing]:reslove[i].sell_examine,
                    load:false,
                })
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }
    //分解目标 添加
    add_listView(){
        if(this.state.resolveData.length !=0) {
            var total_1=this.state.total_1;
            var total_2=this.state.total_2;
            var sell_1= this.state.sell_1;
            var sell_2=this.state.sell_2;
            var brr=this.state.pname;
            for(var i in brr){
                brr[i]=false;
            }
            this.setState({
                resolveData:[],
                pname:brr,
                totaled_money:total_1,
                totaled_examine: total_2,
                selled_number: sell_1,
                selled_examine: sell_2 ,
                content:"继续添加",
            });
        }
        //如果添加产品标识的数 没有值 就设置初始值1  如果有 取当前最大的值 加一在 push 到标识数组中
        // 这样就保证了 标识的数字没有重复值
        if (this.state.addproductsing.length == 0) {
            var maxnumber = 0;
        } else {
            for(var i in this.state.addproductsing){
                var resolveidsing1='resolver_'+this.state.addproductsing[i];
                var resolvetotalsing1='total_money_'+this.state.addproductsing[i];
                var resolvenumsing1='total_examine_'+this.state.addproductsing[i];
                var resolvesellsing1='sell_number_'+this.state.addproductsing[i];
                var resolveexnumsing1='sell_examine_'+this.state.addproductsing[i];
                if(this.state[resolveidsing1]==undefined  || this.state[resolveidsing1]==''){
                    return toast.center('请选择分解者');
                }else if(this.state[resolvetotalsing1]==undefined  || this.state[resolvetotalsing1]==''){
                    return toast.center('请完善金额目标值');
                }else if(this.state[resolvenumsing1]==undefined || this.state[resolvenumsing1]==''){
                    return toast.center('请完善金额考核值');
                }else if(this.state[resolvesellsing1]==undefined || this.state[resolvesellsing1]==''){
                    return toast.center('请完善销量目标值');
                }else if(this.state[resolveexnumsing1]==undefined || this.state[resolveexnumsing1]==''){
                    return toast.center('请完善销量考核值');
                }else{
                    var maxnumber = Math.max.apply(null, this.state.addproductsing) - (-1);
                }
            }

        }
        this.state.addproductsing.push(maxnumber);
        var arr=this.state.addproductsing;
        var brr=this.state.pname;
        if(parseInt(arr.length)==1){
             for(var i in brr){
                 if(i!=0){
                     brr.splice(i,1);
                 }
             }
            this.setState({
                addproductsing:arr,
                pname:brr,
            })
        }else if(parseInt(arr.length)>parseInt(brr.length)){
            brr.push(false);
            this.setState({
                addproductsing:arr,
                pname:brr,
            })
        }else{
            this.setState({
                addproductsing:arr,
            })
        }
    }
    //失焦事件
    aimBlur(position){
        var resolvetotalsing='total_money_'+position;
        var total=this.state.total_money;
        var use=this.state[resolvetotalsing];
        var remaining= this.state.totaled_money;
        if(parseFloat(total)==parseFloat(remaining)){
            var remain= total*1 - use*1;
        } else{
            var remain= remaining*1 - use*1;
        }
        if(parseFloat(remain)<parseFloat(0)){
            remain=0;
            toast.center('所填金额目标不能大于目标值');
            return false;
        }else{
            this.setState({
                totaled_money: remain,
            })
        }
    }
    aimBlur1(position){
        var resolvetotalsing='sell_number_'+position;
        var total=this.state.sell_number;
        var use=this.state[resolvetotalsing];
        var remaining= this.state.selled_number;
        if(parseFloat(total)==parseFloat(remaining)){
            var remain= total*1 - use*1;
        } else{
            var remain= remaining*1 - use*1;
        }
        if(parseFloat(remain)<parseFloat(0)){
            remain=0;
            toast.center('所填销量目标不能大于目标值');
            return false;
        }else{
            this.setState({
                selled_number: remain,
            })
        }
    }
    testBlur(position) {
        var resolvetotalsing='total_examine_'+position;
        var total=this.state.total_examine;
        var use=this.state[resolvetotalsing];
        var remaining= this.state.totaled_examine;
        if(parseFloat(total)==parseFloat(remaining)){
            var remain= total*1 - use*1;
        } else{
            var remain= remaining*1 - use*1;
        }
        if(parseFloat(remain)<parseFloat(0)){
            remain=0;
            toast.center('所填考核金额不能大于考核值');
            return false;
        }else{
            this.setState({
                totaled_examine: remain,
            })
        }
    }
    testBlur1(position) {
        var resolvetotalsing='sell_examine_'+position;
        var total=this.state.sell_examine;
        var use=this.state[resolvetotalsing];
        var remaining= this.state.selled_examine;
        if(parseFloat(total)==parseFloat(remaining)){
            var remain= total*1 - use*1;
        } else{
            var remain= remaining*1 - use*1;
        }
        if(parseFloat(remain)<parseFloat(0)){
            remain=0;
            toast.center('所填考核销量不能大于考核值');
            return false;
        }else{
            this.setState({
                selled_examine: remain,
            })
        }
    }
    //获焦事件
    aimFocus(position){
        alert(position)
        var resolvetotalsing='total_money_'+position;
        var use=this.state[resolvetotalsing];
        alert(use)
        var remaining= parseFloat(this.state.totaled_money)*1+parseFloat(use)*1;
        var center='total_center_money_'+position;
        this.setState({
            [center]: remaining,
        })
    }
    confirm(){
        if(this.state.resolveData.length==0) {
            var info = this.state.addproductsing;
            var sum1 = 0;
            var sum2 = 0;
            var sum3 = 0;
            var sum4 = 0;
            var dataInfo1 = [];
            for (var i in info) {
                var productidsing = 'resolver_did_' + i;
                var confirm = 'confirm_' + i;
                var id = 'id_' + i;
                var productnamesing = 'resolver_' + i;
                var producttotalsing = 'total_money_' + i;
                var productnumsing = "total_examine_" + i;
                var productsellsing = 'sell_number_' + i;
                var productsellnumsing = 'sell_examine_' + i;
                if (this.state[productnamesing] && this.state[id]) {
                    sum1 = sum1 * 1 - (-this.state[producttotalsing]);
                    sum2 = sum2 * 1 - (-this.state[productnumsing]);
                    sum3 = sum3 * 1 - (-this.state[productsellsing]);
                    sum4 = sum4 * 1 - (-this.state[productsellnumsing]);
                    dataInfo1.push({
                        id: this.state[id],
                        confirm: this.state[confirm],
                        name: this.state[productnamesing],
                        total_money: this.state[producttotalsing],
                        total_examine: this.state[productnumsing],
                        sell_number: this.state[productsellsing],
                        sell_examine: this.state[productsellnumsing]
                    });
                }
            }
            if (parseFloat(sum1) != parseFloat(this.state.total_money)) {
                toast.center('所填的金额目标值累和与原金额总目标不相等，提交不成功');
                return false;
            }
            if (parseFloat(sum2) != parseFloat(this.state.total_examine)) {
                toast.center('所填的金额考核值累和与原金额总考核不相等，提交不成功');
                return false;
            }
            if (parseFloat(sum3) != parseFloat(this.state.sell_number)) {
                toast.center('所填的销量目标值累和与原销量总目标不相等，提交不成功');
                return false;
            }
            if (parseFloat(sum4) != parseFloat(this.state.sell_examine)) {
                toast.center('所填的销量考核值累和与原销量总考核不相等，提交不成功');
                return false;
            }
            //alert(JSON.stringify(dataInfo1))
                var url=config.api.base + config.api.resolveGoal;
                request.post(url,{
                    company_id: this.props.navigation.state.params.company_id,
                    target_id:this.props.navigation.state.params.target_id,
                    modify:1,
                    dataInfo:dataInfo1,
                }).then((responseJson) => {
                    if(responseJson.status==1){
                        toast.center('分解目标成功');
                        this.props.navigation.goBack('EditResolve')
                    }else if(responseJson.status==0){
                        toast.center('分解目标失败');
                    }
                }).catch((error)=>{
                    toast.bottom('网络连接失败，请检查网络后重试');
                })
            } else if(parseInt(this.state.resolveData.length) >= parseInt(0)) {
                this.props.navigation.goBack('EditResolve')
            }
    }
    selectResolver(e){
        this.props.navigation.navigate('SelectResolver',{dataInfo:this.state.dataInfo,select_product_sing:e,modify:1})
    }
    delete(position){
        var info=this.state.addproductsing;
        if(info.length==1){
            var arr=this.state.pname;
            for(var i in arr){
                arr[i]=false;
            }
            this.setState({
                pname:arr
            }) ;
        } else{
            var pname=this.state.pname;
            for(var i in pname){
                if(i==position){
                    pname[i]=false;
                    pname.splice(i,1);
                }
            }
            for(var i in info){
                if(i==position){
                    info.splice(i,1);
                }
            }
            for(var i in info){
                info[i]=i;
            }
            this.setState({
                addproductsing:info,
                pname:pname
            }) ;
            var sum1=parseFloat(0);
            var sum2=parseFloat(0);
            var sum3=parseFloat(0);
            var sum4=parseFloat(0);
            for(var i in this.state.addproductsing){
                var resolvetotalsing='total_money_'+i;
                var resolvenumsing='total_examine_'+i;
                var resolvesellsing='sell_number_'+i;
                var resolvexnumsing='sell_examine_'+i;
                sum1= parseFloat(sum1)+ parseFloat(this.state[resolvetotalsing]);
                sum2= parseFloat(sum2)+ parseFloat(this.state[resolvenumsing]);
                sum3= parseFloat(sum3)+ parseFloat(this.state[resolvesellsing]);
                sum4= parseFloat(sum4)+ parseFloat(this.state[resolvexnumsing]);
            }
            var remaine1=parseFloat(this.state.total_money)- parseFloat(sum1);
            var remaine2=parseFloat(this.state.total_examine)- parseFloat(sum2);
            var remaine3=parseFloat(this.state.sell_number)- parseFloat(sum3);
            var remaine4=parseFloat(this.state.sell_examine)- parseFloat(sum4);
            this.setState({
                totaled_money:remaine1,
                totaled_examine:remaine2,
                selled_number:remaine3,
                selled_examine:remaine4,
            }) ;
        }
    }
    render() {
        var arrlist=this.state.resolveData;
        var infoList=[];
        for(var i in arrlist){
            var resolvetotalsing='total_money_'+i;
            var resolvenumsing='total_examine_'+i;
            var resolvesellsing='sell_number_'+i;
            var resolvexnumsing='sell_examine_'+i;
            infoList.push(
                <View key={i}>
                    <View style={[{backgroundColor:'#fff'}]}>
                        <TouchableHighlight underlayColor={'transparent'}>
                            <View style={[{height:35,flexDirection :'row',justifyContent:'space-between',paddingLeft:15,paddingRight:15,alignItems:'center'}]}>
                                <Text style={{color:'#333',alignItems:'center'}}>选择分解者</Text>
                                <View style={{flexDirection :'row',alignItems:'center'}}>
                                    <Text style={{color:'#e15151'}}>{this.state.pname[i]}</Text>
                                    <Image  style={{width:14,height:14,marginLeft:20,}} source={require('../imgs/customer/arrow_r.png')}/>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={[{backgroundColor:'#fff'},styles.borderTop]}>
                        <View style={[{height:30,justifyContent:'center',paddingLeft:15},styles.borderBottom]}>
                            <Text style={{color:'#333'}}>总金额</Text>
                        </View>
                        <View style={[{height:50,paddingLeft:15},styles.place,styles.borderBottom]}>
                            <View style={{borderColor:'#ccc',borderRightWidth:1,justifyContent:'center',height:60,width:60}}>
                                <Text style={{color:'#333',fontSize:13}}>目标值</Text>
                            </View>
                            <View style={{height:50,width:screenW-60}}>
                                <View style={[{height:30,paddingLeft:5},styles.place,styles.borderBottom]}>
                                    <TextInput
                                        style={{padding:0,width:screenW-105}}
                                        onChangeText={(t) => {this.setState({[resolvetotalsing]:t})}}
                                        placeholder ={'请输入金额'}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        value={this.state[resolvetotalsing]}
                                        editable={false}
                                        />
                                    <Text style={{color:'#333'}}>元</Text>
                                </View>
                                <View style={{height:20,justifyContent:'center',paddingLeft:5}}>
                                    <Text style={{color:'#333',fontSize:12}}>共{this.state.total_money}元，剩{this.state.totaled_money}元</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[{height:50,paddingLeft:15},styles.place,styles.borderBottom]}>
                            <View style={{borderColor:'#ccc',borderRightWidth:1,justifyContent:'center',height:60,width:60}}>
                                <Text style={{color:'#333',fontSize:13}}>考核值</Text>
                            </View>
                            <View style={{height:50,width:screenW-60}}>
                                <View style={[{height:30,paddingLeft:5},styles.place,styles.borderBottom]}>
                                    <TextInput
                                        style={{padding:0,width:screenW-105}}
                                        onChangeText={(t) => {this.setState({[resolvenumsing]:t})}}
                                        placeholder ={'请输入金额'}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        value={arrlist[i].total_examine}
                                        editable={false}
                                        />
                                    <Text style={{color:'#333'}}>元</Text>
                                </View>
                                <View style={{height:20,justifyContent:'center',paddingLeft:5}}>
                                    <Text style={{color:'#333',fontSize:12}}>共{this.state.total_examine}元，剩{this.state.totaled_examine}元</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[{backgroundColor:'#fff'}]}>
                        <View style={[{height:30,justifyContent:'center',paddingLeft:15},styles.borderBottom]}>
                            <Text style={{color:'#333'}}>总销量</Text>
                        </View>
                        <View style={[{height:50,paddingLeft:15},styles.place,styles.borderBottom]}>
                            <View style={{borderColor:'#ccc',borderRightWidth:1,justifyContent:'center',height:60,width:60}}>
                                <Text style={{color:'#333',fontSize:13}}>目标值</Text>
                            </View>
                            <View style={{height:50,width:screenW-60}}>
                                <View style={[{height:30,paddingLeft:5},styles.place,styles.borderBottom]}>
                                    <TextInput
                                        style={{padding:0,width:screenW-105}}
                                        onChangeText={(t) => {this.setState({[resolvesellsing]:t})}}
                                        placeholder ={'请输入金额'}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        value={arrlist[i].sell_number}
                                        editable={false}
                                        />
                                    <Text style={{color:'#333'}}>单</Text>
                                </View>
                                <View style={{height:20,justifyContent:'center',paddingLeft:5}}>
                                    <Text style={{color:'#333',fontSize:12}}>共{this.state.sell_number}单，剩{this.state.selled_number}单</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[{height:50,paddingLeft:15},styles.place,styles.borderBottom]}>
                            <View style={{borderColor:'#ccc',borderRightWidth:1,justifyContent:'center',height:60,width:60}}>
                                <Text style={{color:'#333',fontSize:13}}>考核值</Text>
                            </View>
                            <View style={{height:50,width:screenW-60}}>
                                <View style={[{height:30,paddingLeft:5},styles.place,styles.borderBottom]}>
                                    <TextInput
                                        style={{padding:0,width:screenW-105}}
                                        onChangeText={(t) => {this.setState({[resolvexnumsing]:t})}}
                                        placeholder ={'请输入金额'}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        value={arrlist[i].sell_examine}
                                        editable={false}
                                        />
                                    <Text style={{color:'#333'}}>单</Text>
                                </View>
                                <View style={{height:20,justifyContent:'center',paddingLeft:5}}>
                                    <Text style={{color:'#333',fontSize:12}}>共{this.state.sell_examine}单，剩{this.state.selled_examine}单</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            )
        }
        if(this.state.addproductsing.length>=1){
            var  productsinglist= this.state.addproductsing;
            var resolvelist=[];
            for(var i in productsinglist) {
                var resolvetotalsing='total_money_'+i;
                var resolvenumsing='total_examine_'+i;
                var resolvesellsing='sell_number_'+i;
                var resolvexnumsing='sell_examine_'+i;
                resolvelist.push(
                    <View key= {productsinglist[i]}>
                        <View style={[{backgroundColor:'#fff',marginTop:10},styles.borderTop]}>
                            <TouchableHighlight underlayColor={'transparent'}
                                                onPress={()=>this.selectResolver(productsinglist[i])}>
                                <View style={[{height:35,flexDirection :'row',justifyContent:'space-between',paddingLeft:15,paddingRight:15,alignItems:'center'}]}>
                                    <Text style={{color:'#333',alignItems:'center'}}>选择分解者</Text>
                                    <View style={{flexDirection :'row',alignItems:'center'}}>
                                        {this.state.pname[i]==false ? <Text style={{color:'#333',marginRight:screenW*0.01,alignItems:'center'}}></Text>:
                                            <Text style={{color:'#e15151'}}>{this.state.pname[i]}</Text>}
                                        <Image  style={{width:14,height:14,marginLeft:20,}} source={require('../imgs/customer/arrow_r.png')}/>
                                    </View>

                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={[{backgroundColor:'#fff'},styles.borderTop]}>
                            <View style={[{height:30,justifyContent:'center',paddingLeft:15},styles.borderBottom]}>
                                <Text style={{color:'#333'}}>总金额</Text>
                            </View>
                            <View style={[{height:50,paddingLeft:15},styles.place,styles.borderBottom]}>
                                <View style={{borderColor:'#ccc',borderRightWidth:1,justifyContent:'center',height:60,width:60}}>
                                    <Text style={{color:'#333',fontSize:13}}>目标值</Text>
                                </View>
                                <View style={{height:50,width:screenW-60}}>
                                    <View style={[{height:30,paddingLeft:5},styles.place,styles.borderBottom]}>
                                        <TextInput
                                            style={{padding:0,width:screenW-105}}
                                            onChangeText={(t) => {this.setState({[resolvetotalsing]:t})}}
                                            placeholder ={'请输入金额'}
                                            placeholderTextColor={"#888"}
                                            underlineColorAndroid="transparent"
                                            onBlur={this.aimBlur.bind(this,productsinglist[i])}
                                            />
                                        <Text style={{color:'#333'}}>元</Text>
                                    </View>
                                    <View style={{height:20,justifyContent:'center',paddingLeft:5}}>
                                        <Text style={{color:'#333',fontSize:12}}>共{this.state.total_money}元，剩{this.state.totaled_money}元</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[{height:50,paddingLeft:15},styles.place,styles.borderBottom]}>
                                <View style={{borderColor:'#ccc',borderRightWidth:1,justifyContent:'center',height:60,width:60}}>
                                    <Text style={{color:'#333',fontSize:13}}>考核值</Text>
                                </View>
                                <View style={{height:50,width:screenW-60}}>
                                    <View style={[{height:30,paddingLeft:5},styles.place,styles.borderBottom]}>
                                        <TextInput
                                            style={{padding:0,width:screenW-105}}
                                            onChangeText={(t) => {this.setState({[resolvenumsing]:t})}}
                                            placeholder ={'请输入金额'}
                                            placeholderTextColor={"#888"}
                                            underlineColorAndroid="transparent"
                                            onBlur={this.testBlur.bind(this,productsinglist[i])}
                                            />
                                        <Text style={{color:'#333'}}>元</Text>
                                    </View>
                                    <View style={{height:20,justifyContent:'center',paddingLeft:5}}>
                                        <Text style={{color:'#333',fontSize:12}}>共{this.state.total_examine}元，剩{this.state.totaled_examine}元</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[{backgroundColor:'#fff'}]}>
                            <View style={[{height:30,justifyContent:'center',paddingLeft:15},styles.borderBottom]}>
                                <Text style={{color:'#333'}}>总销量</Text>
                            </View>
                            <View style={[{height:50,paddingLeft:15},styles.place,styles.borderBottom]}>
                                <View style={{borderColor:'#ccc',borderRightWidth:1,justifyContent:'center',height:60,width:60}}>
                                    <Text style={{color:'#333',fontSize:13}}>目标值</Text>
                                </View>
                                <View style={{height:50,width:screenW-60}}>
                                    <View style={[{height:30,paddingLeft:5},styles.place,styles.borderBottom]}>
                                        <TextInput
                                            style={{padding:0,width:screenW-105}}
                                            onChangeText={(t) => {this.setState({[resolvesellsing]:t})}}
                                            placeholder ={'请输入金额'}
                                            placeholderTextColor={"#888"}
                                            underlineColorAndroid="transparent"
                                            onBlur={this.aimBlur1.bind(this,productsinglist[i])}
                                            />
                                        <Text style={{color:'#333'}}>单</Text>
                                    </View>
                                    <View style={{height:20,justifyContent:'center',paddingLeft:5}}>
                                        <Text style={{color:'#333',fontSize:12}}>共{this.state.sell_number}单，剩{this.state.selled_number}单</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[{height:50,paddingLeft:15},styles.place,styles.borderBottom]}>
                                <View style={{borderColor:'#ccc',borderRightWidth:1,justifyContent:'center',height:60,width:60}}>
                                    <Text style={{color:'#333',fontSize:13}}>考核值</Text>
                                </View>
                                <View style={{height:50,width:screenW-60}}>
                                    <View style={[{height:30,paddingLeft:5},styles.place,styles.borderBottom]}>
                                        <TextInput
                                            style={{padding:0,width:screenW-105}}
                                            onChangeText={(t) => {this.setState({[resolvexnumsing]:t})}}
                                            placeholder ={'请输入金额'}
                                            placeholderTextColor={"#888"}
                                            underlineColorAndroid="transparent"
                                            onBlur={this.testBlur1.bind(this,productsinglist[i])}
                                            />
                                        <Text style={{color:'#333'}}>单</Text>
                                    </View>
                                    <View style={{height:20,justifyContent:'center',paddingLeft:5}}>
                                        <Text style={{color:'#333',fontSize:12}}>共{this.state.sell_examine}单，剩{this.state.selled_examine}单</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <TouchableHighlight underlayColor={'transparent'}
                                            onPress={this.delete.bind(this,i)}
                            >
                            <View style={[styles.place,styles.borderBottom,{justifyContent:'center',paddingLeft: 15,paddingRight:15,backgroundColor:'#fff',height:30}]}>
                                <Text style={{color:"#e15151"}}>删除</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                )
            }
        }
        const {navigate} = this.props.navigation
        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <View style={{flexDirection:'row'}}>
                            <Image  style={styles.back_icon} source={require('../imgs/customer/back.png')}/>
                            <Text style={styles.back_text}>返回</Text>
                        </View>
                    </TouchableHighlight>
                    <Text style={{color:'#333',fontSize:17}}>分解目标</Text>
                    <TouchableHighlight underlayColor={'transparent'}
                                        style={[styles.goRight,styles.go]}
                                        onPress={()=>this.confirm()}>
                        <Text style={styles.back_text}>确定</Text>
                    </TouchableHighlight>
                </View>
                <ScrollView  keyboardShouldPersistTaps={'always'}>
                    {infoList}
                    {resolvelist}
                    <TouchableHighlight underlayColor={'#fff'} onPress={()=>{this.add_listView()}} >
                        <View style={[styles.place,styles.borderBottom,{justifyContent:'center',paddingLeft: 15,paddingRight:15,backgroundColor:'#fff',height:30}]}>
                            <Text style={{color:"#e15151"}}>+ {this.state.content}</Text>
                        </View>
                    </TouchableHighlight>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#F0F1F2',
    },
    container: {
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
    borderBottom:{
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
    goRight:{
        right:15
    },
    tabar_scroll:{
        height:44,
        justifyContent:'flex-start',
        paddingRight:40
    },
    back_icon:{
        width:10,
        height:17,
        marginTop: 3
    },
    back_text:{
        color:'#e15151',
        fontSize: 16,
        marginLeft:6
    },
    add:{
        width:22,
        height:22,
    },
    place:{
        flexDirection:'row',
        alignItems:'center',
    },
    borderTop:{
        borderTopWidth:1,
        borderColor:'#ccc'
    },
    borderBottom:{
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
    //动态信息
    modelUp:{
        width:screenW,
        position: 'absolute',
        left:0,
        top:85,
        backgroundColor:'#fff'
    },
    xinxiiala:{
        height:35,
        marginLeft:20,
        justifyContent:'center'
    },
    bordernone:{
        borderBottomWidth:0,
    },
    go:{
        position:'absolute',
        top:8
    },
    goRight:{
        right:15
    },
});