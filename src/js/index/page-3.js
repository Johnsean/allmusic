{
	let view = {
		el: '.page-3',
		show(){
			$(this.el).addClass('active')
		},
		hide(){
			$(this.el).removeClass('active')
		},
		template: `
			<form><input type="text" autofocus placeholder="搜索歌曲"></form>
		`,
		render(data={}){
			$(this.el).html(this.template)
			if(JSON.stringify(data)!=='{}'){
				console.log(data)
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
	}
	let model = {
		data:{
			songs:[]
		},
		find(queryParas){
			var query1 = new AV.Query('Song');
			var query2 = new AV.Query('Song');
			query1.equalTo('name', queryParas);
			query2.equalTo('singer', queryParas);
			var query = AV.Query.or(query1, query2);
			
			query.equalTo('name', queryParas);
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
			this.bindEventHub()
			this.bindEvents()
		},
		bindEventHub(){
			window.eventHub.on('selectTab',(tabName)=>{
				if(tabName === 'page-3'){
					this.view.show()
					this.view.render()
				}else{
					this.view.hide()
				}
			})
		},
		bindEvents(){
			$(this.view.el).on('input','input',()=>{
				// 实时显示并搜索	
				// console.log(1)
				// let value = $(this.view.el).find('input').val()
				// console.log(value)
			})
			$(this.view.el).on('submit','form',(e)=>{
				//按回车的时候 执行
				e.preventDefault()
				console.log(1)
				let value = $(this.view.el).find('input').val()
				this.model.find(value).then(()=>{
					console.log(this.model.data)
					this.view.render(this.model.data)
				})
				
			})
		}
	}
	controller.init(view,model)
}