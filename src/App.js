import React from 'react'

class App extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			isLoading: true,
			newsData: []
		}
	}
  
	componentWillMount() {
		localStorage.getItem('newsData') && this.setState({
			newsData: JSON.parse(localStorage.getItem('newsData')),
			isLoading: false
		})
	}  

	componentDidMount(){
		const date = localStorage.getItem('newsDataDate');
		const newsDataDate = date && new Date(parseInt(date));
		const now = new Date();

		const dataAge = Math.round((now - newsDataDate) / (1000 * 60)); // in minutes
		const tooOld = dataAge >= 1;

		if(tooOld){
			this.fetchData();            
		} else {
			console.log(`Using data from localStorage that are ${dataAge} minutes old.`);
		}
	}	

	componentWillUpdate(nextProps, nextState) {
		localStorage.setItem('newsData', JSON.stringify(nextState.newsData));
		localStorage.setItem('newsDataDate', Date.now());
	}
	
	fetchData(){

		this.setState({
			isLoading: true,
			newsData: []
		})

		fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=ac491a9373fc458eaff9ba484e0fe7fd')
		.then(response => response.json())
		.then(parsedJSON => parsedJSON.articles.map(news => (
			{
				author: `${news.author}`,
				title: `${news.title}`,
				description: `${news.description}`,
				url: `${news.url}`,
				urlToImage: `${news.urlToImage}`,
				publishedAt: `${news.publishedAt}`
			}
		)))
		.then(newsData => this.setState({
			newsData,
			isLoading: false
		}))
		.catch(error => console.log('parsing failed', error))
      
	}
  
	handleClick() {
		if (this.refs.myInput !== null) {
			var input = this.refs.myInput;
			var inputValue = input.value;
			//alert("Input is " + inputValue);
		
			var url = 'https://newsapi.org/v2/top-headlines?country=us&' +
			'q=' + inputValue +
			'&sortBy=popularity&' +
			'apiKey=ac491a9373fc458eaff9ba484e0fe7fd';

			var req = new Request(url);

			fetch(req)
			.then(response => response.json())
			.then(parsedJSON => parsedJSON.articles.map(news => (
				{
					author: `${news.author}`,
					title: `${news.title}`,
					description: `${news.description}`,
					url: `${news.url}`,
					urlToImage: `${news.urlToImage}`,
					publishedAt: `${news.publishedAt}`
				}
			)))
			.then(newsData => this.setState({
				newsData,
				isLoading: false
			}))
			.catch(error => console.log('parsing failed', error))
		
		}
	}

	render() {
		const {isLoading, newsData} = this.state;
		return (
			<div>
				<header><h1>Top headlines in the US right now</h1></header>
				
				<div className="row">
					<div className="col-3 pad0"><h4 className="totalNews">Total News : {newsData.length}</h4></div>
					<div className="col-9 pad0">
						<span className="rightAlign"><input type="text" placeholder="Search" ref="myInput" /><button className="btn" onClick={(e) => {
							this.handleClick();    
						}}>Search</button></span>
					</div>
				</div>
				
				<div className={`${isLoading ? 'is-loading' : ''}`}>
					<div className="col-12">
						{
							!isLoading && newsData.length > 0 ? newsData.map(contact => {
								const {author, title, description, url, urlToImage, publishedAt} = contact;
								return <div key={title} className="content row"><div className="col-3"><img src={urlToImage} alt={title}/></div><div className="col-9">
                                  <h2><a href={url} target="_blank">{title}</a></h2><h4>By : {author}</h4><p>{description}</p><h4 className="publishedAt">Published At : {publishedAt}</h4>
								</div></div>
							}) : null
						}
					</div>
					<div className="loader">
						<div className="icon"></div>
					</div>
				</div>
			</div>
		);
	}
}
export default App;