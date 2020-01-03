{//该模块仅供参考思路!!!
	let view = {
		el: "main",
		template: `
			<form id="songForm">
				<h1>新建歌单</h1>
				<div class="row">
					<label>歌单名<input type="text" name="name"></label>
				</div>
				<div class="row">
					<label>简介<textarea cols="50" rows="10" name="summary"></textarea></label>
				</div>
				<div class="row">
					<label><button type="submit">保存</button></label>
				</div>
			</form>
		`,
		init(){
			this.$el = $(this.el)
		},
		render(data){ 
			//下面是测试代码: 创建依赖关系 待完善
			// var song = AV.Object.createWithoutData('Song', '5e09757556207100772e858a');
			// song.set('name','777')
			// var playlist = AV.Object.createWithoutData('Playlist', '5e0dcd2bd4b56c008e5d67a2');
			// song.set('dependent',playlist)
			
			// song.save().then((newSong)=>{
			// 	console.log(newSong)
			// },(error)=>{
			// 	console.error(error)
			// 	console.log(error)
			// })
			
			
			this.$el.html(this.template)
			if(data){
				this.$el.find("h1").text("编辑歌单")
				let needs = "name summary".split(" ")
				needs.map((string)=>{
					this.$el.find(`[name ="${string}"]`).val(data[string])
				})
			}
		}
	}
	let model = {
		data: {
			id: "",name: "",summary: "",pointer:""
		},
		create(data){
			// 上传成功后 点击save后 创建表数据
			var Playlist = AV.Object.extend('Playlist');
			var playlist = new Playlist();	
			return playlist.save(data).then(function (playlist) {
			  // console.log(playlist)
			  return playlist
			})
		},
		update(data){
			var playlist = AV.Object.createWithoutData('Playlist', this.data.id);
			return playlist.save(data).then(function (playlist) {
			  // console.log("更新后的playlist")
			  // console.log(playlist)
			  return playlist;
			})
		},
		reset(){
			let needs = "id name summary pointer".split(" ")
			needs.map((string)=>{
				this.data[string] = "" 
			})
		}
	}
	let controller = {
		init(view, model){
			this.view = view
			this.view.init()
			this.model = model
			this.view.render()
			// this.bindEvents()
			// this.bindEventHub()
		},
		bindEvents(){
			this.view.$el.on("submit","form",(e)=>{
				e.preventDefault()
				
				let needs = "name summary pointer".split(" ")
				let data = {}
				needs.map((string)=>{
					data[string] = this.view.$el.find(`[name="${string}"]`).val()
				})
				//判断 如果data 有id 时点保存 edit 更新
				// 否则 是创建
				if(this.model.data.id){
					this.model.update(data).then((song)=>{
						data.id = song.id
						window.eventHub.emit("editAc",data)	
					})
				}else{
					this.model.create(data).then((song)=>{
						this.model.data.id = song.id
						data = song.attributes
						Object.assign(this.model.data,data)
						// console.log(this.model.data)
						// 触发新增li 事件  传深拷贝过去
						window.eventHub.emit("addSong",JSON.parse(JSON.stringify(this.model.data)))
						})
					}
				//取表单每个value  组装 post()
					this.model.reset()
					// console.log("reset")
					// console.log(this.model.data)
					this.view.render()
			})	
		},
		bindEventHub(){
			window.eventHub.on("uploadBe",(song)=>{
				// 取出来 渲染
				this.model.reset()
				Object.assign(this.model.data,song)
				// console.log(this.model.data)
				this.view.render(song)
			})
		}	
	}
	controller.init(view,model)
}