export default {
    // 默认缓存驱动
    default:env('filesystem.driver', 'local'),

    // 缓存连接方式配置
    disks:{
        local:{
            type:'local',
            root: app().getRuntimePath() + 'storage',
        },
        public:{
            // 磁盘类型
            type: 'local',
            // 磁盘路径
            root: app().getRootPath() + 'public/storage',
            // 磁盘路径对应的外部URL路径
            url: '/storage',
            // 可见性
            visibility: 'public'
        }
    }
 }
