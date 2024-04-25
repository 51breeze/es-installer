//+----------------------------------------------------------------------
//|模板设置
//+----------------------------------------------------------------------

export default {
    //模板引擎类型使用Think
    type:'Think',
    //默认模板渲染规则1解析为小写+下划线2全部转换小写3保持操作方法
    auto_rule:1,
    //模板目录名
    view_dir_name:'view',
    //模板后缀
    view_suffix:'html',
    //模板文件名分隔符
    view_depr:DIRECTORY_SEPARATOR,
    //模板引擎普通标签开始标记
    tpl_begin:'{',
    //模板引擎普通标签结束标记
    tpl_end:'}',
    //标签库标签开始标记
    taglib_begin:'{',
    //标签库标签结束标记
    taglib_end:'}',
};