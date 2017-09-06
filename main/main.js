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
import { StackNavigator,TabNavigator } from "react-navigation";
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStackStyleInterpolator';
import Home from '../home/home';
import Chat from '../chat/chat';
import Customer from '../customer/customer';
import Daily from '../daily/daily';
import My from '../my/my';

import Page from '../home/page';



//周飞飞
//工商局查询
import WebViewExample from  '../my/webViewExample';
//个人页面
import Info from  '../my/info';
//部门管理页面
import DepartManager from  '../my/departManager/departManager';
//企业设置页面
import CompanySetting from  '../my/companySetting';
//人员组织
import AddDepart from '../my/departManager/addDepart';
import AddPeople from '../my/departManager/addPeople';
import SelectDepart from '../my/departManager/selectDepart';
import SelectPeople from '../my/departManager/selectPeople';
import EnterpriceSetting from '../my/departManager/enterpriseSetting';
import DepartSetting from '../my/departManager/departSetting';
import CompanyName from '../my/departManager/companyName';
import ChoosePeople from '../my/departManager/choosePeople';
import UserInfo from '../my/departManager/userInfo';
import Search from '../my/departManager/search'


//客户


import GongHai from '../customer/gonghai/gonghai';
import SearchGonghai from '../customer/gonghai/searchGonghai';
import GongHaiDetail from '../customer/gonghai/gonghaiDetail';
import addThread from '../customer/thread/addThread';
import AddCustomer from '../customer/addCustomer';
import AddContacts from '../customer/addContacts';
import ChoseAddress from '../customer/choseAddress';

import FollowRecord from '../customer/followRecord';
import AddDaily from '../customer/daily/addDaily';
import DailyDescribe from '../customer/daily/dailyDescribe';
import ChooseContacts from '../customer/chooseContacts';
import Classify from '../customer/classify';
import CustomerDetail from '../customer/customerDetail';
import CustomerSearch from '../customer/customerSearch';

import FollowPeople from '../customer/flollowPeople'
import UserMsg from '../customer/userMsg'
import Form from '../customer/forms';
import Remind from '../customer/daily/remind';
import SearchCustomer from '../customer/searchCustomer';

//线索
import SearchThread from '../customer/thread/searchThread'
import Thread from '../customer/thread/thread';
import ThreadDetail from '../customer/thread/threadDetail'
import threadClassify from '../customer/thread/threadClassify';



//沟通
import Organization from '../chat/organization';
import UserSearch from '../chat/Search/userSearch';
import CustomerList from '../chat/Contact/customerList';
import CusContactDetail from '../chat/Contact/cusContactDetail';
import EditCusContact from '../chat/Contact/edit_CusContact';
import ContactSearch from '../chat/Search/contactSearch';
import PhoneContactList from '../chat/Contact/phoneContactList';
import PhoneContactInfo from '../chat/Contact/phoneContactInfo';
import PhoneContactSearch from '../chat/Search/phoneContactSearch';
import ChatMsg from '../chat/chatMsg';
import ChatSetting from '../chat/chatSetting';
import ChatGroup from '../chat/chatGroup';
import ApplyNotice from '../chat/applyNotice';
import RequestPeople from '../chat/requestPeople';

import ChatMessage from '../chat/chatMessage'




//邱志娟

//首页-公告
import Notice from '../home/notice/notice';
//公告-nav-发公告
import SendNotice from '../home/notice/sendNotice';
//公告详情
import NoticeDetail from '../home/notice/noticeDetail';
//发公告
import SendNoticeNextStep from '../home/notice/sendNoticeNextStep';
//预览公告
import NoticePreview from '../home/notice/noticePreview';



//日志
import Log from '../home/log/log';
//日志-日报表
import LogTodyReport from '../home/log/logTodyReport';
//日志-周报表
import LogWeekReport from '../home/log/logWeekReport';
//日志-月报表
import LogMonthReport from '../home/log/logMonthReport';
//日志-日志详情
import LogDetail   from '../home/log/logDetail';
//日志-搜索日志
import LogSearch from '../home/log/logSearch';
//日志-下属个人日志
import PersonalLog from '../home/log/personalLog';
import SubordinateLog  from '../home/log/subordinateLog';
import SubordinateLogDetail from '../home/log/subordinateLogDetail';


//日程
//日程新建拜访,任务,会议,培训
import AddWork from '../daily/newWork/addWork';//日程-新建任务
import AddMeeting from '../daily/newMeeting/addMeet';//日程-新建会议
import AddTrain from '../daily/newTrain/addTrain';//日程-新建培训
import AddVisit from '../daily/newVisit/addVisit';//日程-新建拜访
//修改
import EditWork from '../daily/newWork/editWork';//日程-修改任务
import EditMeeting from '../daily/newMeeting/editMeet';//日程-修改会议
import EditTrain from '../daily/newTrain/editTrain';//日程-修改培训
import EditVisit from '../daily/newVisit/editVisit';//日程-修改拜访
import ChooseCustomer from '../daily/dailyCommon/chooseCustomer';//日程-选择客户
import ChooseMultipleCustomer from '../daily/dailyCommon/chooseMultipleCustomer';//日程-选择多个客户
import AddAlert from '../daily/dailyCommon/add-Alert';//日程-添加提醒
import ChooseExecutor from '../daily/dailyCommon/chooseExecutor';//日程-选择执行人
import ChooseSubordinate from '../daily/dailyCommon/chooseSubordinate';//日程-选择下属
import AddDescribe from '../daily/dailyCommon/add-describe';//日程-添加描述
//详情页面
import DailyDetail from '../daily/dailyDetail';//日程-详情页面
import DailyCustomer from '../daily/DetailCommon/dailyCustomer';//日程-日程客户详情页面
import DailyExecutor from '../daily/DetailCommon/dailyExecutor';//日程-日程执行人详情页面
import DailyReport from '../daily/dailyReport/dailyReport';//日程-日程报告页面
import VisitPosition from '../daily/dailyReport/visitPosition';//日程-日程客户详情页面



//彭黎明

//首页-审批
import Approval from '../home/process/approval';
//审批页面-nav-筛选审批
import NewBulidApproval from '../home/process/newBulidApproval';
//首页-合同
import Contract from '../home/contract/contract';
//合同页面-nav-新建
import NewBulidContract from '../home/contract/newBulidContract';
//首页-订单
import Order from '../home/order/order';
//首页-产品
import Product from '../home/product/product';
//产品页面-nav-新增产品
import NewBulidProduct from '../home/product/newBulidProduct';
//产品详情
import ProductDetail from '../home/product/productDetail';
//产品类型列表
import Producttypelist from '../home/product/producttypelist';
//新增产品类型
import NewBulidProducttype from '../home/product/newBulidProducttype';
//产品修改
import Productedit from '../home/product/productedit';
//产品搜索
import Productsearch from '../home/product/productsearch';
//发起审批
import Approvalfaqi from '../home/process/approvalfaqi';
//表单图标列表
import Formiconlist from '../home/process/formiconlist';
//表单预览
import Formyulan from '../home/process/formyulan';
//表单字段编辑
import Formfieldedit from '../home/process/formfieldedit';
//新建模板
import NewBulidForm from '../home/process/newBulidForm';
//表单详情 发起审批
import formDetail from '../home/process/formDetail';
//表单 选择审批人
import select_approve_peopel from '../home/process/select_approve_peopel';
//审批时 转交审批人
import pass_on_to from '../home/process/pass_on_to';
//审批筛选时 审批类型
import approve_filtrate_approvetype from '../home/process/approve_filtrate_approvetype';
//审批筛选时 发起人员
import faqi_people from '../home/process/faqi_people';
//审批筛选 query后的页面
import approve_query from '../home/process/approve_query';
//合同  选择客户
import select_customer from '../home/contract/select_customer';
//合同  选择客户联系人
import select_customer_linkman from '../home/contract/select_customer_linkman';
//合同  选择产品
import select_product from '../home/contract/select_product';
//合同  合同详情
import contract_detail from '../home/contract/contract_detail';
//合同  审批详情
import approve_detail from '../home/contract/approve_detail';
//合同  回款详情
import return_money_detail from '../home/contract/return_money_detail';
//合同  新增回款
import new_return_money from '../home/contract/new_return_money';
//表单审批
import form_approve from '../home/process/form_approve';
//合同审批
import contract_approve from '../home/process/contract_approve';
//合同回款审批
import return_money_approve from '../home/process/return_money_approve';
//首页报表最新业绩 展开
import newer_performance from '../home/contract/newer_performance';
//首页报表业绩对比 展开
import performance_constrast from '../home/contract/performance_constrast';
//订单筛选
import order_filtrate from '../home/order/order_filtrate';
//订单搜索
import order_search from '../home/order/order_search';
//订单选择客户
import order_select_costom from '../home/order/order_select_costom';
//订单选择创建人
import order_select_people from '../home/order/order_select_people';



//周飞飞
//首页-目标
import Aim from '../home/aim';
//新增企业目标
import AddGoal from '../home/addGoal';
// 新增企业目标  中选择产品
import AimAddProduct from  '../home/aimAddProduct';
// 修改企业目标  中选择产品
import AimEditContent from  '../home/aimEditContent';
//目标详情页面
import AimDetail from '../home/aimDetail';
//分解目标     周飞飞
import AimResolve from '../home/aimResolve';
import SelectResolver from '../home/selectResolver';
import EditResolve from '../home/editResolve';
import ResolveAimDetail from '../home/resolveDetail';

//周飞飞
//工商局查询
// import WebViewExample from  '../my/webViewExample';

//个人页面   周飞飞
import myInfo from  '../my/info';
//个人信息页面      周飞飞
import PositionInput from  '../my/Info/positionInput';//添加职位名称
import ModifyTel from  '../my/Info/modifyTel';//修改手机号
import ModifyEmail from  '../my/Info/modifyEmail';//修改邮箱
import ModifyAddress from  '../my/Info/modifyAddress';//修改地址

//考勤管理     周飞飞
import AttendanceManage from '../my/attendanceManage';//考勤管理总页面
import AttendanceWhiteDetail from '../my/attendanceWhiteDetail';//考勤白名单
import AttendanceOperationAdd from '../my/AttendanceOperationAdd';//考勤白名单 添加
import AttendanceOperationMinue from '../my/AttendanceOperationMinue';//考勤白名单 删除
import AttendanceSetting from '../my/attendanceSetting';//考勤白名单 删除
import ManageNewGroup from '../my/manageNewGroup';//新建分组   (考勤管理中的新建）
import ManageEditGroup from '../my/manageEditGroup';//编辑分组   (考勤管理中的编辑）
import ChooseDepart from '../my/chooseDepart';   //  新建分组中根据部门选择使用范围   (考勤管理的新建分组中的根据部门选择）
import ChooseStaffs from '../my/chooseStaffs';   //  新建分组中根据员工选择使用范围   (考勤管理的新建分组中的根据员工选择）
//员工定位管理    周飞飞
import OrientationManage from '../my/orientationManage';

//个人设置        周飞飞
import Mine from  '../my/mine';  //个人设置总页面
import AccountSafe from  '../my/accountsafe';//账号与安全
import TelSafe from  '../my/telSafe';//账号安全中的修改手机号
import ModifyPassword  from  '../my/modifyPassword';  //账号安全中的修改密码


//公海客户
const MyApp = TabNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            tabBarLabel: '首页',
            tabBarIcon: ({ tintColor,focused }) => (
                focused ? <Image
                    source={require('../imgs/tabbar/home-s.png')}
                    style={[styles.icon, {tintColor: tintColor}]}
                />: <Image
                    source={require('../imgs/tabbar/home.png')}
                    style={styles.icon}
                />
            )
        }
    },
    Chat: {
        screen: Chat,
        navigationOptions: {
            tabBarLabel: '沟通',
            tabBarIcon: ({ tintColor,focused }) => (
                focused ? <Image
                    source={require('../imgs/tabbar/chat-s.png')}
                    style={[styles.icon, {tintColor: tintColor}]}
                />: <Image
                    source={require('../imgs/tabbar/chat.png')}
                    style={styles.icon}
                />
            )

        }
    },
    Customer: {
        screen: Customer,
        navigationOptions: {
            tabBarLabel: '客户',
            tabBarIcon: ({ tintColor,focused }) => (
                focused ? <Image
                    source={require('../imgs/tabbar/customer-s.png')}
                    style={[styles.icon, {tintColor: tintColor}]}
                />: <Image
                    source={require('../imgs/tabbar/customer.png')}
                    style={styles.icon}
                />
            )
        }
    },
    Daily: {
        screen: Daily,
        navigationOptions: {
            tabBarLabel: '日程',
            tabBarIcon: ({ tintColor,focused }) => (
                focused ? <Image
                    source={require('../imgs/tabbar/daily-s.png')}
                    style={[styles.icon, {tintColor: tintColor}]}
                />: <Image
                    source={require('../imgs/tabbar/daily.png')}
                    style={styles.icon}
                />
            )
        }
    },
    My: {
        screen: My,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({ tintColor,focused }) => (
                focused ? <Image
                    source={require('../imgs/tabbar/my-s.png')}
                    style={[styles.icon, {tintColor: tintColor}]}
                />: <Image
                    source={require('../imgs/tabbar/my.png')}
                    style={styles.icon}
                />
            )
        }
    }
}, {
    animationEnabled: false,
    tabBarPosition: 'bottom',
    backBehavior: 'none', // 按 back 键是否跳转到第一个 Tab， none 为不跳转
    swipeEnabled: false, // 禁止左右滑动
    tabBarOptions: {
        pressOpacity: 1,
        activeTintColor: '#e91e63',
        inactiveTintColor: '#999', // 文字和图片默认颜色
        indicatorStyle: {height: 0}, // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了
        labelStyle: {
            fontSize: 12,
        },
        iconStyle: {
            height: 26,
            width: 26
        },
        showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
        style: {
            backgroundColor: '#EFF1F3',
            height:59
        }
    },
});
const styles = StyleSheet.create({
    icon: {
        width: 26,
        height: 26,
        tintColor: '#999'
    },
});
const app = StackNavigator({
    Home: {screen: MyApp,navigationOptions: {header: null}},
    Page: {screen: Page},


    //zhoufeifei    my页面
    WebViewExample:{screen: WebViewExample,navigationOptions: {header: null}},
    CompanySetting:{screen: CompanySetting,navigationOptions: {header: null}},
    Info:{screen: Info,navigationOptions: {header: null}},
    DepartManager:{screen: DepartManager,navigationOptions: {header: null}},
    //人员组织
    AddDepart:{screen: AddDepart,navigationOptions: {header: null}},
    AddPeople:{screen: AddPeople,navigationOptions: {header: null}},
    SelectDepart:{screen: SelectDepart,navigationOptions: {header: null}},
    SelectPeople:{screen: SelectPeople,navigationOptions: {header: null}},
    EnterpriceSetting: {screen :EnterpriceSetting,navigationOptions: {header:null}},
    DepartSetting: {screen: DepartSetting,navigationOptions: {header: null}},
    CompanyName: {screen: CompanyName,navigationOptions: {header: null}},
    ChoosePeople: {screen: ChoosePeople,navigationOptions: {header: null}},
    UserInfo: {screen: UserInfo,navigationOptions: {header: null}},
    Search: {screen: Search,navigationOptions: {header: null}},


    //客户

    GongHai: {screen:GongHai,navigationOptions: {header: null}},

    addThread: {screen:addThread,navigationOptions: {header: null}},
    AddCustomer: {screen:AddCustomer,navigationOptions: {header: null}},
    AddContacts: {screen:AddContacts,navigationOptions:{header:null}},
    ChoseAddress: {screen:ChoseAddress,navigationOptions:{header:null}},
    SearchGonghai: {screen:SearchGonghai,navigationOptions:{header:null}},
    Form: {screen:Form,navigationOptions:{header:null}},
    AddDaily: {screen:AddDaily,navigationOptions:{header:null}},
    DailyDescribe: {screen:DailyDescribe,navigationOptions:{header:null}},
    ChooseContacts: {screen:ChooseContacts,navigationOptions:{header:null}},
    Classify: {screen:Classify,navigationOptions:{header:null}},
    CustomerDetail: {screen:CustomerDetail,navigationOptions:{header:null}, },
    CustomerSearch: {screen:CustomerSearch,navigationOptions:{header:null}},
    FollowPeople: {screen:FollowPeople,navigationOptions:{header:null}},
    UserMsg: {screen:UserMsg,navigationOptions:{header:null}},
    Remind:{screen:Remind,navigationOptions:{header:null}},
    SearchCustomer: {screen:SearchCustomer,navigationOptions:{header:null}},

    //线索
    Thread: {screen:Thread,navigationOptions: {header: null}},
    SearchThread:{screen:SearchThread,navigationOptions:{header:null}},
    ThreadDetail:{screen:ThreadDetail,navigationOptions:{header:null}},
    FollowRecord:{screen:FollowRecord,navigationOptions:{header:null}},
    threadClassify: {screen:threadClassify,navigationOptions:{header:null}},
    GongHaiDetail: {screen: GongHaiDetail,navigationOptions:{header:null}},

    //沟通
    Organization:{screen:Organization,navigationOptions: {header: null}},
    UserSearch:{screen:UserSearch,navigationOptions: {header: null}},
    CustomerList:{screen:CustomerList,navigationOptions: {header: null}},
    CusContactDetail:{screen:CusContactDetail,navigationOptions: {header: null}},
    ContactSearch:{screen:ContactSearch,navigationOptions: {header: null}},
    PhoneContactList:{screen:PhoneContactList,navigationOptions: {header: null}},
    PhoneContactSearch:{screen: PhoneContactSearch,navigationOptions: {header: null}},
    PhoneContactInfo:{screen:PhoneContactInfo,navigationOptions: {header: null}},
    EditCusContact:{screen:EditCusContact,navigationOptions: {header: null}},
    ChatMsg:{screen:ChatMsg,navigationOptions: {header: null}},
    ChatSetting: {screen:ChatSetting,navigationOptions: {header: null}},
    ChatGroup: {screen:ChatGroup,navigationOptions: {header: null}},
    ApplyNotice: {screen:ApplyNotice,navigationOptions: {header: null}},
    RequestPeople: {screen:RequestPeople,navigationOptions: {header: null}},
    ChatMessage: {screen:ChatMessage,navigationOptions: {header: null}},


    //邱志娟


    //公告

    Notice: {screen: Notice, navigationOptions: {header: null}},
    NoticeDetail: {screen: NoticeDetail, navigationOptions: {header: null}},
    SendNoticeNextStep: {screen: SendNoticeNextStep, navigationOptions: {header: null}},
    SendNotice: {screen: SendNotice, navigationOptions: {header: null}},

    NoticePreview: {screen: NoticePreview, navigationOptions: {header: null}},


    //日志
    Log: {screen: Log, navigationOptions: {header: null}},
    LogTodyReport: {screen: LogTodyReport, navigationOptions: {header: null}},
    LogWeekReport: {screen: LogWeekReport, navigationOptions: {header: null}},
    LogMonthReport: {screen: LogMonthReport, navigationOptions: {header: null}},
    LogDetail: {screen: LogDetail, navigationOptions: {header: null}},
    LogSearch: {screen: LogSearch, navigationOptions: {header: null}},
    PersonalLog:{screen: PersonalLog, navigationOptions: {header: null}},
    SubordinateLog:{screen:SubordinateLog, navigationOptions: {header: null}},
    SubordinateLogDetail:{screen:SubordinateLogDetail, navigationOptions: {header: null}},

    //日程
    //日程页面
    AddVisit: {screen: AddVisit, navigationOptions: {header: null}},
    AddWork: {screen: AddWork, navigationOptions: {header: null}},
    AddMeeting: {screen: AddMeeting, navigationOptions: {header: null}},
    AddTrain: {screen: AddTrain, navigationOptions: {header: null}},
    EditVisit: {screen: EditVisit, navigationOptions: {header: null}},
    EditWork: {screen: EditWork, navigationOptions: {header: null}},
    EditMeeting: {screen: EditMeeting, navigationOptions: {header: null}},
    EditTrain: {screen: EditTrain, navigationOptions: {header: null}},
    AddDescribe: {screen: AddDescribe, navigationOptions: {header: null}},
    ChooseCustomer: {screen: ChooseCustomer, navigationOptions: {header: null}},
    AddAlert:{screen:AddAlert,navigationOptions: {header: null}},
    ChooseExecutor:{screen:ChooseExecutor,navigationOptions: {header: null}},
    ChooseSubordinate:{screen:ChooseSubordinate,navigationOptions: {header: null}},
    ChooseMultipleCustomer:{screen:ChooseMultipleCustomer,navigationOptions: {header: null}},
    DailyDetail:{screen:DailyDetail,navigationOptions: {header: null}},
    DailyCustomer:{screen:DailyCustomer,navigationOptions: {header: null}},
    DailyExecutor:{screen:DailyExecutor,navigationOptions: {header: null}},
    DailyReport:{screen:DailyReport,navigationOptions: {header: null}},






    //彭黎明
    ProductDetail: {screen: ProductDetail,navigationOptions: {header: null}},
    Approval: {screen: Approval,navigationOptions: {header: null}},
    NewBulidApproval: {screen: NewBulidApproval,navigationOptions: {header: null}},
    Product: {screen: Product,navigationOptions: {header: null}},
    NewBulidProduct: {screen: NewBulidProduct,navigationOptions: {header: null}},
    Contract: {screen: Contract,navigationOptions: {header: null}},
    NewBulidContract: {screen: NewBulidContract,navigationOptions: {header: null}},
    Order: {screen: Order,navigationOptions: {header: null}},
    Producttypelist: {screen: Producttypelist,navigationOptions: {header: null}},
    NewBulidProducttype: {screen: NewBulidProducttype,navigationOptions: {header: null}},
    Productedit: {screen: Productedit,navigationOptions: {header: null}},
    Productsearch: {screen: Productsearch,navigationOptions: {header: null}},
    Approvalfaqi: {screen: Approvalfaqi,navigationOptions: {header: null}},
    NewBulidForm: {screen: NewBulidForm,navigationOptions: {header: null}},
    Formiconlist: {screen: Formiconlist,navigationOptions: {header: null}},
    Formyulan: {screen: Formyulan,navigationOptions: {header: null}},
    Formfieldedit: {screen: Formfieldedit,navigationOptions: {header: null}},
    formDetail: {screen: formDetail,navigationOptions: {header: null}},
    select_approve_peopel: {screen: select_approve_peopel,navigationOptions: {header: null}},
    select_customer: {screen: select_customer,navigationOptions: {header: null}},
    select_customer_linkman: {screen: select_customer_linkman,navigationOptions: {header: null}},
    select_product: {screen: select_product,navigationOptions: {header: null}},
    contract_detail: {screen: contract_detail,navigationOptions: {header: null}},
    approve_detail: {screen: approve_detail,navigationOptions: {header: null}},
    return_money_detail: {screen: return_money_detail,navigationOptions: {header: null}},
    new_return_money: {screen: new_return_money,navigationOptions: {header: null}},
    form_approve: {screen: form_approve,navigationOptions: {header: null}},
    contract_approve: {screen: contract_approve,navigationOptions: {header: null}},
    return_money_approve: {screen: return_money_approve,navigationOptions: {header: null}},
    pass_on_to: {screen: pass_on_to,navigationOptions: {header: null}},
    approve_filtrate_approvetype: {screen: approve_filtrate_approvetype,navigationOptions: {header: null}},
    faqi_people: {screen: faqi_people,navigationOptions: {header: null}},
    approve_query: {screen: approve_query,navigationOptions: {header: null}},
    order_filtrate: {screen: order_filtrate,navigationOptions: {header: null}},
    order_search: {screen: order_search,navigationOptions: {header: null}},
    order_select_costom: {screen: order_select_costom,navigationOptions: {header: null}},
    order_select_people: {screen: order_select_people,navigationOptions: {header: null}},
    newer_performance: {screen: newer_performance,navigationOptions: {header: null}},
    performance_constrast: {screen: performance_constrast,navigationOptions: {header: null}},


    //周飞飞
    // my页面

    myInfo:{screen: myInfo,navigationOptions: {header: null}},
    Mine:{screen: Mine,navigationOptions: {header: null}},
    AccountSafe:{screen: AccountSafe,navigationOptions: {header: null}},
    TelSafe:{screen: TelSafe,navigationOptions: {header: null}},
    PositionInput:{screen: PositionInput,navigationOptions: {header: null}},
    ModifyTel:{screen: ModifyTel,navigationOptions: {header: null}},
    ModifyEmail:{screen:ModifyEmail,navigationOptions: {header: null}},
    ModifyAddress:{screen:ModifyAddress,navigationOptions: {header: null}},
    AttendanceWhiteDetail: {screen:AttendanceWhiteDetail,navigationOptions:{header:null}},
    AttendanceManage: {screen:AttendanceManage,navigationOptions:{header:null}},
    OrientationManage:{screen:OrientationManage,navigationOptions:{header:null}},
    AttendanceOperationAdd: {screen:AttendanceOperationAdd,navigationOptions:{header:null}},
    AttendanceOperationMinue:{screen:AttendanceOperationMinue,navigationOptions:{header:null}},
    ManageNewGroup: {screen:ManageNewGroup,navigationOptions:{header:null}},
    ManageEditGroup: {screen:ManageEditGroup,navigationOptions:{header:null}},
    AttendanceSetting:{screen:AttendanceSetting,navigationOptions:{header:null}},
    ChooseDepart:{screen:ChooseDepart,navigationOptions:{header:null}},
    ChooseStaffs:{screen:ChooseStaffs,navigationOptions:{header:null}},
    ModifyPassword :{screen:ModifyPassword,navigationOptions:{header:null}},
    AddGoal:{screen:AddGoal,navigationOptions:{header:null}},
    AimEditContent:{screen:AimEditContent,navigationOptions:{header:null}},
    AimDetail:{screen:AimDetail,navigationOptions:{header:null}},
    AimResolve:{screen:AimResolve,navigationOptions:{header:null}},
    AimAddProduct: {screen:AimAddProduct,navigationOptions:{header:null}},
    SelectResolver: {screen:SelectResolver,navigationOptions:{header:null}},
    EditResolve: {screen:EditResolve,navigationOptions:{header:null}},
    ResolveAimDetail: {screen:ResolveAimDetail,navigationOptions:{header:null}},


    //公共客户
},{//安卓跳转实现平滑动画
    headerMode: 'screen',
    transitionConfig:()=>({
        screenInterpolator:CardStackStyleInterpolator.forHorizontal,
    })
});
module.exports = app;