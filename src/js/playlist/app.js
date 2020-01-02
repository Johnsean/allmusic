{
	let view = {
		el: '.page',
		init(){
			this.$el = $(this.el)
		},
		render(data){
			let {songs,playlist} = data
			let $playlist = $(`
				<div class='playlist-cover'>
					<img src='${playlist.url}'>
				</div>
				<div>${playlist.name}</div>
				<div>${playlist.summary}</div>
			`)
			
			let $ali = songs.map((song)=>{
				return $(`
				<a href='./song.html?id=${song.id}'>
					<div>${song.name}</div>
					<div>${song.singer}</div>
				</a>
				`)
			})
			$(this.el).find('.playlist').append($playlist)
			$(this.el).find('.song-list').append($ali)
		}
	}
	let model = {
		data:{
			songs:[],
			playlist:{}
		},
		get(id){
			var queryPlaylist = new AV.Query('Playlist')
			queryPlaylist.get(id).then((playlist)=>{ //查询歌单data
				Object.assign(this.data.playlist,{id:playlist.id,...playlist.attributes})
				return playlist
			}) 
			
			var playlist = AV.Object.createWithoutData('Playlist', id)
			var querySongs = new AV.Query('Song')
			querySongs.equalTo('dependent',playlist) //查询与歌单有关联的歌
			return querySongs.find().then((songs)=>{
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
			this.view.init()
			this.model = model
			let id = this.getPlaylistId()
			this.model.get(id).then(()=>{
				this.view.render(this.model.data)
			})
		},
		getPlaylistId(){
			let search = window.location.search
			let id = ''
			if(search.indexOf('?') === 0){ //?位于首位则执行:
				search = search.substring(1)
			}
			search = search.split('&').filter(v=>v)//过滤掉空字符串
			search.map((string)=>{
				let kv = string.split('=')
				let key = kv[0]
				if(key === 'id'){
					id = kv[1]
				}
			})
			return id
		}
	}
	controller.init(view,model)
}