{
	let view = {
		el: "#songs",
		render(data={}){
			let {songs} = data
			let $ali = songs.map((song)=>{	
				return $(`
				<a href='./song.html?id=${song.id}'>
					<div>${song.name}</div>
					<div>${song.singer}</div>
				</a>
				`)
			})
			$(this.el).append($ali)
		}
	}
	let model = {
		data:{
			songs:[]
		},
		find(){
			var query = new AV.Query('Song');
			return query.find().then((songs)=>{
				this.data.songs = songs.map((song)=>{
					return {id: song.id, ...song.attributes}
				})
				return songs
			})
		}
	}
	let controller = {
		init(view,model){
			this.view = view
			this.model = model
			this.model.find().then(()=>{
				this.view.render(this.model.data)
			})
		}			
	}
	controller.init(view,model)
}