module.exports = {
    api: {
        base: 'http://118.178.241.223/',
        //登录
        login: 'oa/index.php?c=Register&a=login',
        companyRegister: 'oa/index.php?c=Register&a=companyRegister',
        companyJoin: 'oa/index.php?c=Register&a=companyJoin',
        //人员组织
        firstDepartAndUser: 'oa/index.php?c=DepartmentInterface&a=firstDepartAndUser',
        addDepart: 'oa/index.php?c=DepartmentInterface&a=addDepart',
        getCompany: 'oa/index.php?c=DepartmentInterface&a=getCompany',
        getFirstDepart: 'oa/index.php?c=DepartmentInterface&a=getFirstDepart',
        companySetting: 'oa/index.php?c=DepartmentInterface&a=companySetting',
        companySettingSave: 'oa/index.php?c=DepartmentInterface&a=companySettingSave',
        orderUser: 'oa/index.php?c=DepartmentInterface&a=orderUser',
        departSetting: 'oa/index.php?c=DepartmentInterface&a=departSetting',
        departSettingSave: 'oa/index.php?c=DepartmentInterface&a=departSettingSave',
        delDepart: 'oa/index.php?c=DepartmentInterface&a=delDepart',
        selectDownUser: 'oa/index.php?c=DepartmentInterface&a=selectDownUser',
        getUserMsg: 'oa/index.php?c=DepartmentInterface&a=getUserMsg',
        editUserInfo: 'oa/index.php?c=DepartmentInterface&a=editUserInfo',
        delUser: 'oa/index.php?c=DepartmentInterface&a=delUser',
        searchPeople: 'oa/index.php?c=DepartmentInterface&a=searchPeople',
        getCompanyCode: 'oa/index.php?c=DepartmentInterface&a=getCompanyCode',


        //客户关联
        addCustomer: 'oa/index.php?c=CustomerInterface&a=addCustomer',
        customerInfo: 'oa/index.php?c=CustomerInterface&a=customerInfo',
        classify: 'oa/index.php?c=CustomerInterface&a=classify',
        customerMsgAndDaily: 'oa/index.php?c=CustomerInterface&a=customerMsgAndDaily',
        updatePrivate: 'oa/index.php?c=CustomerInterface&a=updatePrivate',
        addFollowRecord: 'oa/index.php?c=CustomerInterface&a=addFollowRecord',
        addContacts: 'oa/index.php?c=CustomerInterface&a=addContacts',
        addUserId: 'oa/index.php?c=CustomerInterface&a=addUserId',
        addCustomerDaily: 'oa/index.php?c=CustomerInterface&a=addCustomerDaily',
        getDailyAndUser: 'oa/index.php?c=CustomerInterface&a=getDailyAndUser',
        delFollow: 'oa/index.php?c=CustomerInterface&a=delFollow',
        delCustomer: 'oa/index.php?c=CustomerInterface&a=delCustomer',
        editCustomer: 'oa/index.php?c=CustomerInterface&a=editCustomer',
        addThread: 'oa/index.php?c=CustomerInterface&a=addThread',
        getThreadMsg: 'oa/index.php?c=CustomerInterface&a=getThreadMsg',
        threadDailyAndFollow: 'oa/index.php?c=CustomerInterface&a=threadDailyAndFollow',
        editThread: 'oa/index.php?c=CustomerInterface&a=editThread',
        delThread: 'oa/index.php?c=CustomerInterface&a=delThread',
        searchThread: 'oa/index.php?c=CustomerInterface&a=searchThread',
        searchGonghai: 'oa/index.php?c=CustomerInterface&a=searchGonghai',
        searchCustomerMsg: 'oa/index.php?c=CustomerInterface&a=searchCustomerMsg',   ///


        //聊天
        searchMyCustomerContacts:'oa/index.php?c=ChatInterface&a=searchMyCustomerContacts',//查询所有我的客户联系人
        delMyCustomerContact:'oa/index.php?c=ChatInterface&a=delMyCustomerContact',//删除我的客户联系人
        editMyCustomerContact:'oa/index.php?c=ChatInterface&a=editMyCustomerContact',//删除我的客户联系人
        searchContact:'oa/index.php?c=ChatInterface&a=searchContact',//根据姓名电话号码搜索我的客户联系人
        checkContactInfo:'oa/index.php?c=ChatInterface&a=checkContactInfo',//对联系人数据进行整理



        chatLastWord: 'oa/index.php?c=ChatInterface&a=chatLastWord',
        getUnRead: 'oa/index.php?c=ChatInterface&a=getUnRead',
        OAChatMsg: 'oa/index.php?c=ChatInterface&a=OAChatMsg',
        sendChatMsg: 'oa/index.php?c=ChatInterface&a=sendChatMsg',
        getAllUnRead: 'oa/index.php?c=ChatInterface&a=getAllUnRead',
        updateChatRead: 'oa/index.php?c=ChatInterface&a=updateChatRead',
        //群聊
        // chatGroup: 'oa/index.php?c=ChatInterface&a=chatGroup',
        // getGroupUnRead: 'oa/index.php?c=ChatInterface&a=getGroupUnRead',
        //团队申请
        getApplyNotice:'oa/index.php?c=ChatInterface&a=getApplyNotice',
        dealApplyNotice:'oa/index.php?c=ChatInterface&a=dealApplyNotice',
        lastApplyTime:'oa/index.php?c=ChatInterface&a=lastApplyTime',



        //邱志娟

        newNotice:'oa/index.php?c=NoticeInterface&a=newNotice',//新建公告
        // getUserNameById:'oa/index.php?c=NoticeInterface&a=getUserNameById',//查询员工姓名
        getNotices:'oa/index.php?c=NoticeInterface&a=getNotices',//查询所有的公告
        oneNoticeDetail:'oa/index.php?c=NoticeInterface&a=oneNoticeDetail',//查看公告详情
        cancelNotice:'oa/index.php?c=NoticeInterface&a=cancelNotice',//删除公告
        newLog:'oa/index.php?c=LogInterface&a=newLog',//新建日志
        getLogs:'oa/index.php?c=LogInterface&a=getLogs',//查询公告
        sendLogReview:'oa/index.php?c=LogInterface&a=sendReview',//发送评论
        getLogReview:'oa/index.php?c=LogInterface&a=getLogReview',//查询一条日志的评论
        imagesupload: 'oa/index.php?c=LogInterface&a=imagesupload',//多张图片上传
        searchNextByName:'oa/index.php?c=LogInterface&a=searchNextByName',//通过姓名查询下属
        searchCustomer:'oa/index.php?c=DailyInterface&a=searchCustomer',//查询客户
        searchExecutor:'oa/index.php?c=DailyInterface&a=searchExecutor',//查询执行人
        addDaily:'oa/index.php?c=DailyInterface&a=addDaily',//添加日程
        searchMyDaily:'oa/index.php?c=DailyInterface&a=searchMyDaily',//查询自己的日程
        sendDailyReview:'oa/index.php?c=DailyInterface&a=sendDailyReview',//发送日程评论
        editDaily:'oa/index.php?c=DailyInterface&a=editDaily',//修改日程
        sendDailyReport:'oa/index.php?c=DailyInterface&a=sendDailyReport',//发送日程报告
        editDailyStatus:'oa/index.php?c=DailyInterface&a=editDailyStatus',//改变日程状态
        getDailyDetailById:'oa/index.php?c=DailyInterface&a=getDailyDetailById',//由日程id查询日历详情
        searchMyDailyByCondition:'oa/index.php?c=DailyInterface&a=searchMyDailyByCondition',//条件搜索日程
        searchSubordinate:'oa/index.php?c=DailyInterface&a=searchSubordinate',//查找用户的下属
        searchSubordinateDaily:'oa/index.php?c=DailyInterface&a=searchSubordinateDaily',//查找下属日程
        editDailyInfo:'oa/index.php?c=DailyInterface&a=editDailyInfo',//修改日程


        //彭黎明
        //产品列表
        productlist: 'oa/index.php?c=ProductInterface&a=index',
        //产品详情
        productdetail: 'oa/index.php?c=ProductInterface&a=product_detail',
        //产品类型列表
        producttypelist: 'oa/index.php?c=ProductInterface&a=producttypelist',
        //根据产品类型id查类型名
        producttypebyid: 'oa/index.php?c=ProductInterface&a=producttypebyid',
        //添加产品
        productadd: 'oa/index.php?c=ProductInterface&a=add_product',
        //添加产品类型
        typeadd: 'oa/index.php?c=ProductInterface&a=addtype',
        //删除产品
        delproduct: 'oa/index.php?c=ProductInterface&a=delproduct',
        //输出编辑产品页面
        editproduct: 'oa/index.php?c=ProductInterface&a=editproduct',
        //编辑产品后保存
        productedit_save: 'oa/index.php?c=ProductInterface&a=editproduct_save',
        //搜索产品
        product_search: 'oa/index.php?c=ProductInterface&a=product_search',
        //新增表单
        addform: 'oa/index.php?c=FormInterface&a=addform',
        //查询所有表单
        selectform: 'oa/index.php?c=FormInterface&a=selectform',
        //查询表单详情
        formDeatail: 'oa/index.php?c=FormInterface&a=formDeatail',
        //保存表单提交信息
        sava_form: 'oa/index.php?c=FormInterface&a=sava_form',
        //查询审批人
        select_approve_peopel: 'oa/index.php?c=FormInterface&a=select_approve_peopel',
        //自己发起的流程和 别人发起要我审批的 和已经审批完成的
        select_approve: 'oa/index.php?c=FormInterface&a=select_approve',
        //自己发起的流程
        select_approve_myfaqi: 'oa/index.php?c=FormInterface&a=select_approve_myfaqi',
        //别人发起要我审批
        select_approve_attime: 'oa/index.php?c=FormInterface&a=select_approve_attime',
        //已经审批完成的
        select_approve_already: 'oa/index.php?c=FormInterface&a=select_approve_already',
        //判读审批的类型 是表单 合同 合同回款
        judge_approve_type: 'oa/index.php?c=FormInterface&a=judge_approve_type',
        //表单审批
        form_approve: 'oa/index.php?c=FormInterface&a=form_approve',
        //合同审批
        contract_approve: 'oa/index.php?c=FormInterface&a=contract_approve',
        //合同回款审批
        contract_returnmoney_approve: 'oa/index.php?c=FormInterface&a=contract_returnmoney_approve',
        //根据合同id 查 合同的创作者
        create_idby_contract_id: 'oa/index.php?c=ContractInterface&a=create_idby_contract_id',


        //同意审批
        approve_agreement: 'oa/index.php?c=FormInterface&a=approve_agreement',
        //拒绝审批
        approve_refuse: 'oa/index.php?c=FormInterface&a=approve_refuse',
        //转交审批
        approve_pass_on_to: 'oa/index.php?c=FormInterface&a=approve_pass_on_to',
        //转交审批人列表
        approve_pass_on_to_list: 'oa/index.php?c=FormInterface&a=approve_pass_on_to_list',
        //替换审批人
        replace_approve_people: 'oa/index.php?c=FormInterface&a=replace_approve_people',
        //判断登录者权限
        judge_role: 'oa/index.php?c=FormInterface&a=judge_role',
        //审批类型 表单集合 合同 合同回款
        approve_type:'oa/index.php?c=FormInterface&a=approve_type',
        //表单id 查表单名称
        form_name_byid:'oa/index.php?c=FormInterface&a=form_name_byid',
        //审批筛选 提交查询
        approve_filtrate_query:'oa/index.php?c=FormInterface&a=approve_filtrate_query',

        //小秘书中 自己发起的流程和 别人发起要我审批的 和已经审批完成的
        secretary_select_approve: 'oa/index.php?c=FormInterface&a=secretary_select_approve',
        //小秘书中 日程
        secretary_select_schedule: 'oa/index.php?c=ChatInterface&a=getMyDaily',
        //小秘书中 日程加审批
        secretary_select_schedule_approve: 'oa/index.php?c=ChatInterface&a=secretary_select_schedule_approve',
        //小秘书中 日程标记为已读
        mark_to_yidu: 'oa/index.php?c=ChatInterface&a=mark_to_yidu',
        //小秘书中 审批标记为已读
        mark_to_yidu_approve: 'oa/index.php?c=FormInterface&a=mark_to_yidu_approve',
        //根据实例id 判断实例状态
        example_status_byid:'oa/index.php?c=FormInterface&a=example_status_byid',

        //查询用户客户
        select_customer: 'oa/index.php?c=ContractInterface&a=select_customer',
        //查询用户客户联系人
        select_customer_linkman: 'oa/index.php?c=ContractInterface&a=select_customer_linkman',
        //查询登录系统的用户姓名通过id
        select_username: 'oa/index.php?c=ContractInterface&a=select_username',
        //查询该公司的所有产品
        select_product: 'oa/index.php?c=ContractInterface&a=select_product',
        //新增合同
        add_contract: 'oa/index.php?c=ContractInterface&a=add_contract',
        //查询合同
        select_contract: 'oa/index.php?c=ContractInterface&a=select_contract',
        //订单中的查询合同
        order_select_contract: 'oa/index.php?c=ContractInterface&a=order_select_contract',
        //订单中的查询合同 时间排序
        order_select_contract_bytime: 'oa/index.php?c=ContractInterface&a=order_select_contract_bytime',
        //订单中的查询合同 金额排序
        order_select_contract_byjine: 'oa/index.php?c=ContractInterface&a=order_select_contract_byjine',
        //订单中选择客户
        order_select_costom: 'oa/index.php?c=ContractInterface&a=order_select_costom',
        //订单筛选确认
        order_filtrate_query: 'oa/index.php?c=ContractInterface&a=order_filtrate_query',
        //首页最新业绩
        newer_performance:'oa/index.php?c=ContractInterface&a=newer_performance',
        //首页业绩对比
        performance_contrast:'oa/index.php?c=ContractInterface&a=performance_contrast',
        //首页最新业绩展开
        newer_performance_unwind:'oa/index.php?c=ContractInterface&a=newer_performance_unwind',
        //首页业绩对比展开
        performance_contrast_unwind:'oa/index.php?c=ContractInterface&a=performance_contrast_unwind',



        //合同详情
        contract_detail: 'oa/index.php?c=ContractInterface&a=contract_detail',
        //合同对应流程 和流程路线
        contract_emample_processway_detail: 'oa/index.php?c=ContractInterface&a=contract_emample_processway_detail',
        //合同对应的回款记录
        return_money_record:'oa/index.php?c=ContractInterface&a=return_money_record',
        //新增合同对应的回款记录
        add_return_money_record:'oa/index.php?c=ContractInterface&a=add_return_money_record',

    },
};