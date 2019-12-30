{
	let view = {
		el: "#songList-container",
		template:`
		<ul><li>第一首歌</li><li>第二首歌</li></ul>
		`,
		init(){
			this.$el = $(this.el)
		},
		render(data){
			this.$el.html(this.template)
			this.$el.find("ul").empty()
			data.map((song)=>{
				this.create(song)
			})
		},
		create(data){
			let $li = $(`<li>${data.name}</li>`).attr("data-id",data.id)
			this.$el.find("ul").append($li)
		}
	}
	let model = {
		data:{
			songs:[]
		},
		find(){
			// 查表
			let data = {}
			var query = new AV.Query('Song');
			return query.find().then((songs)=>{
				//返回 [对象,...]形式
				songs.map((song)=>{
					let {id,attributes} = song
					data = {id,...attributes}
					this.data.songs.push(data)
				})
				// console.log(this.data.songs)
			});
		}
	}
	let controller = {
		init(view, model){
			this.view = view
			this.view.init()
			this.model = model
			this.model.find().then(()=>{
				this.view.render(this.model.data.songs)
			})
			this.bindEvents()
			this.bindEventHub()
		},
		bindEvents(){
			this.view.$el.on("click","li",(e)=>{
				let id = $(e.currentTarget).attr("data-id")
				$(e.currentTarget).addClass("active").siblings(".active").removeClass("active")
				let data = {}
				this.model.data.songs.map((song)=>{
					if(song.id === id){
						data = song
					}
				})
				// console.log(data)
				window.eventHub.emit("uploadBe",data)
				// 选择事件
			})
		},
		bindEventHub(){
			window.eventHub.on("addSong",(data)=>{
				console.log("eimt addSong 传过来的data")
				console.log(data)
				this.view.create(data)
				this.model.data.songs.push(data)
				this.view.$el.find("ul >li.active").removeClass("active")
				console.log("model上面的data songs[]")
				console.log(this.model.data)
			})
			window.eventHub.on("editAc",(data)=>{
				console.log("tirggle editac")
				console.log(data)
				this.view.$el.find(`[data-id="${data.id}"]`).text(data.name)
			})
		}
	}
	controller.init(view,model)
}