(function(){
	window.App = {
		Models: {},
		Views: {},
		Collections: {}
	};

	window.template = function(id){
		return _.template( $('#'+id).html() );
	}


	// 模型
	App.Models.Task = Backbone.Model.extend({
		defaults:{
			'title':'please input the title'
		}
	});

	// 集合
	App.Collections.Todo = Backbone.Collection.extend({
		model: App.Models.Task
	});

	// 集合视图
	App.Views.Todo = Backbone.View.extend({
		tagName: 'ul',
		initialize: function(){
			this.collection.on('add', this.addItem, this);
			this.render();
		},
		render: function(){
			// this.$el.html(this.template());
			this.collection.each(this.addItem,this);
			return this;
		},
		addItem: function(task){
			var taskView =  new App.Views.Task({
				model: task
			});
			this.$el.append(taskView.render().el);
			// this.$el.find('ul').append(taskView.el);
			return false;
		},
	});

	// 单条任务视图
	App.Views.Task = Backbone.View.extend({
		tagName: 'li',
		template: template('taskTemplate'),
		events: {
			'click .edit': 'editItem',
			'click .delete': 'destroy'
		},
		initialize: function(){
			// this.render();
			this.model.on('change', this.render, this);
			this.model.on('destroy', this.remove, this);
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		editItem: function(ev){
			var el = $(ev.target).parent().find('.task');
			var title = prompt("Please enter new title","")
				if (title != null && title != ""){
					el.html(title);
				}
			return false;
		},
		destroy: function(ev){
			this.model.destroy();
		},
		remove: function(ev){
			this.$el.remove();
			return false;
		}
	});

	App.Views.AddTask = Backbone.View.extend({
		el: '#addTask',
		events:{
			submit: 'submit'
		},
		submit: function(ev){
			ev.preventDefault();
			var input = $(ev.target).parent().find('input[type="text"]');
			var val = input.val();
			input.val('');
			// 为空限制
			if( $.trim(val) ){
				var mod = new App.Models.Task({
					title: val
				});
				this.collection.add(mod);
			}
		}
	});


	// 创建集合视图
	var tasks = new App.Collections.Todo([
		{
			title: 'dating'
		},
		{
			title: 'homework'
		}
	]);

	// 添加任务
	var addTask = new App.Views.AddTask({
		collection: tasks
	});

	// 实例化
	var todoView = new App.Views.Todo({
		collection: tasks
	});

	// 插入dom树
	$(document.body).append(todoView.el);

})()