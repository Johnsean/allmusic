{
	let view = {
		el: "main",
		template: `
			<form id="songForm">
				<h1>新建歌曲</h1>
				<div class="row">
					<label>歌名<input type="text" name="name"></label>
				</div>
				<div class="row">
					<label>歌手<input type="text" name="singer"></label>
				</div>
				<div class="row">
					<label>外链<input type="text" name="url"></label>
				</div>
				<div class="row">
					<label>封面<input type="text" name="cover"></label>
				</div>
				<div class="row">
					<label>歌词<textarea cols="50" rows="10" name="lyrics"></textarea></label>
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
			this.$el.html(this.template)
			if(data){
				this.$el.find("h1").text("编辑歌曲")
				let needs = "name url singer cover lyrics".split(" ")
				needs.map((string)=>{
					this.$el.find(`[name ="${string}"]`).val(data[string])
				})
			}
		}
	}
	let model = {
		data: {
			id: "",name: "",url: "",singer: "",cover: "",lyrics: ""
		},
		create(data){
			// 上传成功后 点击save后 创建表数据
			var Song = AV.Object.extend('Song');
			var song = new Song();	
			return song.save(data).then(function (song) {
			  // console.log(song)
			  return song
			})
		},
		update(data){
			var song = AV.Object.createWithoutData('Song', this.data.id);
			return song.save(data).then(function (song) {
			  // console.log("更新后的song")
			  // console.log(song)
			  return song;
			})
		},
		reset(){
			let needs = "id name url singer cover lyrics".split(" ")
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
			this.bindEvents()
			this.bindEventHub()
		},
		bindEvents(){
			this.view.$el.on("submit","form",(e)=>{
				e.preventDefault()
				
				let needs = "name url singer cover lyrics".split(" ")
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