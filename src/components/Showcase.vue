<template>
  <div class="inner">
  	<div class="filters-wrapp">
  		<div class="row">
		  	<div class="col-md-3">
		  		{{currentSubject}}
				<select v-model="currentSubject" @change="setFilter()">
					<option value="" >Все предметы</option>
					<option v-for="subject in subjects">
				    	{{ subject }}
					</option>
				</select>
			</div>
			<div class="col-md-3">
				{{currentGenre}}
				<select v-model="currentGenre" @change="setFilter()">
					<option value="" >Все жанры</option>
					<option v-for="genre in genres">
				    	{{ genre }}
					</option>
				</select>
			</div>
			<div class="col-md-3">
				{{currentGrade}}
				<select v-model="currentGrade" @change="setFilter()">
					<option value="" >Все классы</option>
					<option v-for="grade in grades">
				    	{{ grade }}
					</option>
				</select>
			</div>
			<div class="col-md-3">
				<div class="input-group mb-3">
				  	<input type="text" class="form-control" placeholder="" aria-label="Recipient's username" aria-describedby="button-addon2">
				  	<div class="input-group-append">
				    	<button class="btn btn-outline-secondary" type="button" id="button-addon2">Поиск</button>
				  	</div>
				</div>
			</div>
		</div>	
	</div>

	<ul class="items-list">
		<li class="item" v-for="(book,index) in getData()">
			<div class="item-img">
				<img :src="imageLink + book.courseId">
			</div>
			<div class="item-info">
				<div class="info-title">{{book.subject}}</div>
				<div class="info-grade">{{book.grade}}</div>
				<div class="info-genre">{{book.genre}}</div>
				<div class="info-link hidden"></div>
				<div class="info-price">{{book.price}} </div>
				<div class="info-bonus hidden"></div>
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
			console.log('opa');
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
			var filtered = [];
			this.booksDefault = [];
			var tmp = [];
			tmp =  this.books.items;
			console.log('book-', tmp);
			console.log('pre - filtered',JSON.stringify(filtered));
			for (var i = 0; i < tmp.length; i++) {
				console.log('fafa-', tmp[i]);
				if(
					(
						((tmp[i].subject == this.currentSubject) || (this.currentSubject == '')) && 
						((tmp[i].genre == this.currentGenre) || (this.currentGenre == '')) && 
						((tmp[i].grade == this.currentGrade) || (this.currentGrade == ''))
					)){
					//filtered.push(tmp[i]);
					this.booksDefault.push(tmp[i]);
				}
			}
			console.log('after - ',JSON.stringify(this.booksDefault));
			//this.booksDefault = this.booksDefault.splice(0,this.booksDefault.length)
			return this.booksDefault;
			
			//console.log(JSON.stringify(filtered));
		}
	},
	created(){
	    const url = 'http://krapipl.imumk.ru:8082/api/mobilev1/update';
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
	      	console.log('we are here', this.booksDefault);
	    });
	}  
}
</script>

<style type="text/css">
	.inner{
		width: 100%;
	}

	.hidden{
		display: none !important;
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
</style>
