{
	let view = {
		el: '#tabs',
		
	}
	let model = {}
	let controller = {
		init(view,model){
			this.view = view
			this.model = model
			this.bindEvents()
		},
		bindEvents(){
			$(this.view.el).on('click','a',(e)=>{
				let tabName = $(e.currentTarget).attr('data-tab-name')
				$(e.currentTarget).addClass('active')
					.siblings('.active').removeClass('active')
				window.eventHub.emit('selectTab',tabName)
			})
		}
	}
	controller.init(view,model)
}