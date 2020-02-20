{
	let view = {
		el: ".page-1>.songs",
		render(data={}){
			$(this.el).html('')
			let {songs} = data
			let $ali = songs.map((song)=>{	
				return $(`
				<a href='./song.html?id=${song.id}'>
					<div class="songName">${song.name}</div>
					<div class="songSinger">
						<svg class="icon" aria-hidden="true">
							<use xlink:href="#icon-sq3"></use>
						</svg>
						${song.singer}
					</div>
					<svg class="icon" aria-hidden="true">
					    <use xlink:href="#icon-bofang"></use>
					</svg>
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