{
	let view = {
		el: '.page-1',
		show(){
			$(this.el).addClass('active')
		},
		hide(){
			$(this.el).removeClass('active')
		}
	}
	let model = {}
	let controller = {
		init(view,model){
			this.view = view
			this.model = model
			this.bindEventHub()
			this.loadMoudle1()
			this.loadMoudle2()
		},
		bindEventHub(){
			window.eventHub.on('selectTab',(tabName)=>{
				if(tabName === 'page-1'){
					this.view.show()
				}else{
					this.view.hide()
				}
			})
		},
		loadMoudle1(){
			let script1 = document.createElement('script')
			script1.src = './js/index/page-1-1.js'
			document.body.appendChild(script1)
		},
		loadMoudle2(){
			let script2 = document.createElement('script')
			script2.src = './js/index/page-1-2.js'
			document.body.appendChild(script2)
		}
	}
	controller.init(view,model)
}