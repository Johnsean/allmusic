{
	let view = {
		el: '.page',
		init(){
			this.$el = $(this.el)
		},
		render(data){
			this.$el.css({'background-image':`url(${data.cover})`}) //整个背景 待模糊
			this.$el.find('.name').text(data.name).append(`<p>${data.singer}</p>`)
			if(this.$el.find('audio').attr('src')!== data.url){
				let audio = this.$el.find("audio").attr("src", data.url).get(0)
					audio.ontimeupdate = ()=>{
						window.eventHub.emit('scrollLrc',audio.currentTime)
					}
					audio.onended = ()=>{
						$('.status').removeClass('active')
						$('.play').addClass('active').siblings().removeClass('active')
						//停止动画转动
					}
			}
			// this.play()  //自动播放
			//插入歌词
			 let arr = data.lyrics.split('\n')
			 let regexp = /\[([\d:.]+)\](.+)/
			 arr.map((string)=>{
				let p = document.createElement('p')
				let matches = string.match(regexp)
				if(matches){ // '[00:10.1]' 返回null
					p.textContent = matches[2]
					let parts = matches[1].split(':')
					let newTime = parseInt(parts[0],10)*60 + parseFloat(parts[1],10)
					p.setAttribute('data-time', newTime)
				}else{
					p.textContent = string
				}
				this.$el.find('.lyric-container>.lyric').append(p)
			 })
		},
		play(){
			this.$el.find('audio')[0].play()
			$('.status').addClass('active') //控制cover 360度转
		},
		pause(){
			this.$el.find('audio')[0].pause()
			$('.status').removeClass('active')
		}
	}
	let model = {
		data:{},
		get(id){
			var query = new AV.Query('Song');
			return query.get(id).then((song)=>{
				Object.assign(this.data,{id:song.id,...song.attributes})
				return song
			}) 
		}
	}
	let controller = {
		init(view,model){
			this.view = view
			this.view.init()
			this.model = model
			let id = this.getSongId()
			this.model.get(id).then(()=>{
				this.view.render(this.model.data)
			})
			this.bindEvents()
			this.bindEventHub()
		},
		getSongId(){
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
		},
		bindEvents(){
			$('.status').on('click','div',(e)=>{
				if($(e.currentTarget).attr('data-status')=== 'play'){
					this.view.play()
				}else{
					this.view.pause()
				}
				$(e.currentTarget).removeClass('active').siblings().addClass('active')
			})
		},
		bindEventHub(){
			window.eventHub.on('scrollLrc',(time)=>{
				let allP = $('.lyric>p')
				let p
				for(let i =0;i<allP.length;i++){
					if(i === allP.length-1){
						p = allP[i]
						break
					}else{
						let currenttime = allP.eq(i).attr('data-time')
						let nextTime = allP.eq(i+1).attr('data-time')
						if(currenttime <= time && time <= nextTime){//当没有[00:00.00]时 不满足if--> lyc会到末尾
							p = allP[i]
							break
						}
					}
				}
				let height = p.getBoundingClientRect().top - $('.lyric')[0].getBoundingClientRect().top
				$('div.lyric').css({'transform':`translateY(${-(height==0?0:height-37)}px)`})
				$(p).addClass('active').siblings('.active').removeClass('active')
			})
		}
	}
	controller.init(view,model)
}