{
	let view = {
		el: "#uploadArea",
		init(){
			this.$el = $(this.el)
		}
	}
	let model = {}
	let controller = {
		init(view, model){
			this.view = view
			this.view.init()
			this.model = model
			this.initQiniu()
		},
		initQiniu(){
			var uploader = Qiniu.uploader({
			     runtimes: 'html5',      // 上传模式
			     browse_button: 'uploadBtn',       // 上传选择的点选按钮，必需
			     // uptoken : '<Your upload token>', // uptoken是上传凭证，由其他程序生成
			     uptoken_url: 'http://localhost:8888/uptoken',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
			     get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
			     domain: 'q37dqt2g9.bkt.clouddn.com',     // bucket域名，下载资源时用到，必需
			     container: 'uploadArea',             // 上传区域DOM ID，默认是browser_button的父元素
			     max_file_size: '10mb',             // 最大文件体积限制
			     max_retries: 3,                     // 上传失败最大重试次数
			     dragdrop: true,                     // 开启可拖曳上传
			     drop_element: 'uploadArea',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
			     chunk_size: '4mb',                  // 分块上传时，每块的体积
			     auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
			   
			     init: {
			         'FilesAdded': function(up, files) {
			             plupload.each(files, function(file) {
			                 // 文件添加进队列后，处理相关的事情
			             });
			         },
			         'BeforeUpload': function(up, file) {
			                // 每个文件上传前，处理相关的事情
			         },
			         'UploadProgress': (up, file)=> {
			                // 每个文件上传时，处理相关的事情
							this.view.$el.find("#uploadBtn").html("上传中")
			         },
			         'FileUploaded': (up, file, info)=> {
						 this.view.$el.find("#uploadBtn").html("上传完成")
			                // 每个文件上传成功后，处理相关的事情
			                // 其中info.response是文件上传成功后，服务端返回的json，形式如：
			                // {
			                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
			                //    "key": "gogopher.jpg"
			                //  }
							
			                 var domain = up.getOption('domain');
			                 var res =JSON.parse(info.response);
			                 var sourceLink = "http://" + domain +"/"+ encodeURIComponent(res.key); //获取上传成功后的文件的Url
							 
							 // 传入data{}  包含name url等值
							 let data = {"name": res.key,"url": sourceLink}
							 window.eventHub.emit("uploadBe",data)
			         },
			         'Error': function(up, err, errTip) {
			                //上传出错时，处理相关的事情
			         },
			         'UploadComplete': function() {
			                //队列文件处理完毕后，处理相关的事情
			         },
			         'Key': function(up, file) {
			             // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
			             // 该配置必须要在unique_names: false，save_key: false时才生效
			             var key = file.name;
			             return key
			         }
			     }
			 });
			 // domain为七牛空间对应的域名，选择某个空间后，可通过 空间设置->基本设置->域名设置 查看获取
			 // uploader为一个plupload对象，继承了所有plupload的方法
		}
	}
	controller.init(view,model)
}