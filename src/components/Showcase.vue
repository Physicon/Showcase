<template>
  <div class="inner">
  	<div v-if="loading" class="preloader-wrap">
  		<div class="preloader-inner">
  			<img src="https://cdn-images-1.medium.com/max/800/1*inYwyq37FdvRPLRphTqwBA.gif">
  		</div>
  	</div>
  	<div class="filters-wrapp">
  		<div class="row"> 		
		  	<div class="col-md-3">
		  		<div class="input-group">
					<select 
						v-model="currentSubject" 
						@change="setFilter()" 
						class="mb-3 form-control" 
					>
						<option value="" >Все предметы</option>
						<option v-for="subject in subjects">
					    	{{ subject }}
						</option>
					</select>
				</div>	
			</div>
			<div class="col-md-3">
				<div class="input-group">
					<select 
						v-model="currentGenre" 
						@change="setFilter()"
						class="mb-3 form-control" 
					>
						<option value="" >Все жанры</option>
						<option v-for="genre in genres">
					    	{{ genre }}
						</option>
					</select>
				</div>	
			</div>
			<div class="col-md-3">
				<div class="input-group">
					<select 
						v-model="currentGrade"
						@change="setFilter()"
						class="mb-3 form-control" 
					>
						<option value="" >Все классы</option>
						<option v-for="grade in grades">
					    	{{ grade }}
						</option>
					</select>
				</div>	
			</div>
			<div class="col-md-3">
				<div class="input-group mb-3">
				  	<input 
				  		type="text" 
				  		class="form-control" 
				  		aria-describedby="button-addon2" 
				  		@keyup.enter="setFilter()" 
				  		v-model="searchName"
				  		placeholder="Поиск" 
				  	>
				  	<div class="input-group-append">
				    	<button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="setFilter()">Найти</button>
				  	</div>
				</div>
			</div>
			
		</div>	
	</div>

	<div class="row">
		<div class="col-md-12">
			<div class="switcher-wrap mt-3">
				<span>Рубли</span>
				<label class="switch">
				  <input 
					  type="checkbox" 
					  v-model="switcher"
				  >
				  <span class="slider round"></span>
				</label>
				<span>Бонусы</span>
			</div>	
		</div>	
	</div>	
	<div class="message-wrap">
		{{message}}
	</div>
	<ul class="items-list">
		<li class="item" v-for="(book,index) in getData()">
			<div class="item-img">
				<img :src="imageLink + book.courseId">
			</div>
			<div class="item-info">
				<div class="info-title">{{book.subject}}</div>				
				<div v-if="book.grade.split(';').length > 1" class="info-grade">{{book.grade.split(';')[0] }} - {{book.grade.split(';').pop()}} Класс</div>
				<div v-else class="info-grade">{{book.grade}} Класс</div>
				<div class="info-genre">{{book.genre}}</div>
				<div class="info-link hidden"></div>
				<div v-if="switcher == false" class="info-price">Цена {{book.price}} </div>
				<div v-else class="info-bonus">{{book.priceBonus}} Бонусов</div>
			</div>
		</li>		
	</ul>		


  </div>
</template>

<script type="text/javascript">
export default {

  	name: 'app',
  		data () {
    		return {
    			imageLink:'https://www.imumk.ru/svc/coursecover/',
    			currentSubject:'',
    			currentGenre:'',
    			currentGrade:'',
    			searchName:'',
    			message:'',
    			loading: true,
    			switcher: false,
     			books:{},
     			booksDefault:{},
     			subjects:[],
     			genres:[],
     			grades:[]
    	}
  	},
  	computed:{

  	},
	methods:{
		getFilter(arr){
		    var current = '';
		    var unique = [];
		    for (var i = 0; i < arr.length; i++) {
		      	current = arr[i];
		      	if (!~unique.indexOf(current)) {
		        	unique.push(current);
		      	}
		    }
		    return unique;
		},
		getData(){			
			return this.booksDefault;
		},
		setFilter(){
			this.booksDefault = [];
			var tmp = [];
			tmp =  this.books.items;
			for (var i = 0; i < tmp.length; i++) {
				if(
					(
						((tmp[i].subject == this.currentSubject) || (this.currentSubject == '')) && 
						((tmp[i].genre == this.currentGenre) || (this.currentGenre == '')) && 
						((tmp[i].grade.split(';').indexOf(this.currentGrade) != -1) || (this.currentGrade == '')) &&
						((tmp[i].subject.toLowerCase() == this.searchName.toLowerCase())  || (this.searchName == ''))
					)){

					this.booksDefault.push(tmp[i]);
				}
			}
			if (this.booksDefault.length > 0){
				this.message = ''
			}else{
				this.message = 'Ничего не найдено'
			}
			return this.booksDefault;
		}
	},
	created(){
	    const url = 'https://cors-anywhere.herokuapp.com/http://krapipl.imumk.ru:8082/api/mobilev1/update';
		const obj = {
			data: ''
		}
		this.$http.post(url, obj).then(response => response.json())
	    .then(books => {
	      	this.books = books; 
	      	for( var i = 0; i < this.books.items.length; i++)  {
	      		this.subjects[i] = this.books.items[i].subject;
	      		this.genres[i] = this.books.items[i].genre;
	      		this.grades[i] = this.books.items[i].grade.split(';')[0];
	      	}	     	
	      	this.subjects = this.getFilter(this.subjects);
	      	this.genres = this.getFilter(this.genres);
	      	this.grades = this.getFilter(this.grades).sort((a,b) => a - b);
	      	this.booksDefault = this.books.items;
	      	this.loading = false;
	    });
	}  
}
</script>

<style type="text/css">
	.inner{
		position: relative;
		width: 100%;
	}

	.inner .preloader-wrap{
		position: absolute;
		width: 100%;
		height: 100vh;
		background: white;
		opacity: 0.7;
		text-align: center;
		z-index: 10;
	}

	.inner .preloader-wrap .preloader-inner{
		position: absolute;
	    width: 256px;
	    height: 256px;
	    top: 0;
	    left: 0;
	    right: 0;
	    bottom: 0;
	    margin: auto;
	}

	.hidden{
		display: none !important;
	}

	.filters-wrapp .row select{
		width: 100%;
	}

	.items-list{
	    overflow: hidden;
	    display: -webkit-flex;
	    display: -ms-flexbox;
	    display: flex;
	    -webkit-flex-wrap: wrap;
	    -ms-flex-wrap: wrap;
	    flex-wrap: wrap;
	    -webkit-justify-content: center;
	    -ms-flex-pack: center;
	    justify-content: center;
	    -webkit-align-items: flex-start;
	    -ms-flex-align: start;
	    align-items: flex-start;
	    list-style: none;
	    margin: 60px 0 20px;
	    padding: 0;
  	}

  	.items-list .item{
	    float: left;
	    box-sizing: border-box;
	    overflow: hidden;
	    display: block;
	    margin: 0 15px 55px;
	    width: 170px;
	    min-height: 260px;
	    border: solid 1px #b5b5b5;
	    border-radius: 10px;
	    background: #fff;
  	}
  	.items-list .item .item-img{
  		position: relative;
	    overflow: hidden;
	    height: 134px;
	    background: #ddd;
  	}
  	.items-list .item .item-info{
  		padding: 10px 16px;
  	}

  	.items-list .item .item-info > div{
  		margin: .4em 0;
  		padding-left: .5em;
	    font-size: 14px;
	    font-weight: normal;
  	}

  	.items-list .item .item-info > div.info-title{
  		margin: 0;
  	}

  	.items-list .item .item-info > div.info-genre {
	    margin-top: -.4em;
	    font-size: 11px;
	}

  	.items-list .item .item-img img{
  		max-width: 100%;
  	}

  	.switch {
	  	position: relative;
	  	display: inline-block;
	  	width: 60px;
	  	height: 34px;
	}
	
	.switch input {
		opacity: 0;
	  	width: 0;
	  	height: 0;
	}

	.slider {
	  	position: absolute;
	  	cursor: pointer;
	  	top: 0;
	  	left: 0;
	  	right: 0;
	  	bottom: 0;
	  	background-color: #ccc;
	  	-webkit-transition: .4s;
	  	transition: .4s;
	}

	.slider:before {
	  	position: absolute;
	  	content: "";
	  	height: 26px;
	  	width: 26px;
	  	left: 4px;
	  	bottom: 4px;
	  	background-color: white;
	  	-webkit-transition: .4s;
	  	transition: .4s;
	}

	input:checked + .slider {
	  	/*background-color: #2196F3;*/
	}

	input:focus + .slider {
	  	/*box-shadow: 0 0 1px #2196F3;*/
	}

	input:checked + .slider:before {
	  	-webkit-transform: translateX(26px);
	  	-ms-transform: translateX(26px);
	  	transform: translateX(26px);
	}

	.slider.round {
		border-radius: 34px;
	}

	.slider.round:before {
	  	border-radius: 50%;
	}

	.switcher-wrap label{
		margin-bottom: 0;
	}

	.switcher-wrap span{
		vertical-align: middle;
	}
	.message-wrap{
		text-align: center;
	}
</style>
