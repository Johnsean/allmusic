{
	let view = {
		el: "#playlists",
		render(data={}){
			$(this.el).html('')
			let {playlists} = data
			let $ali = playlists.map((playlist)=>{	
				return $(`
				<a href='./playlist.html?id=${playlist.id}'>
					<div class='playlist-cover'>
						<img src='${playlist.url}'>
					</div>
					<div>${playlist.name}</div>
				</a>
				`)
			})
			$(this.el).append($ali)
		}
	}
	let model = {
		data:{
			playlists:[]
		},
		find(){
			var query = new AV.Query('Playlist');
			return query.find().then((playlists)=>{
				this.data.playlists = playlists.map((playlist)=>{
					return {id: playlist.id, ...playlist.attributes}
				})
				return playlists
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