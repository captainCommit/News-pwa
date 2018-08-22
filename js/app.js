const body = document.querySelector('.container .row');
const apikey = '2d89d87c49894a9c9da9d70c044fe756'
const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const sourceSelector = document.getElementById("sourceSelector");
const defaultSource = "bbc-news"

if ('serviceWorker' in navigator) 
{
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('serviceworker.js').
    then(registration => console.log('Service Worker registered')).
    catch(err => 'SW registration failed'));
}


window.addEventListener('load',e =>
{
    updateNews();
    updateSources().then(() => {
      sourceSelector.value = defaultSource;
      updateNews();
    });
    sourceSelector.addEventListener('change', e =>{
      updateNews(e.target.value);
    })
});
async function updateSources()
{
  url = `https://newsapi.org/v2/sources?apiKey=${apikey}`;
  res = await fetch(url);
  json = await res.json();
  sourceSelector.innerHTML = json.sources.map((source)=>{
    return `<option value ="${source.id}">${source.name}</option>`
  }).join('\n');
}
async function updateNews(source = defaultSource)
{
    url = `https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apikey}`;
    res = await fetch(url);
    json =await res.json();
    body.innerHTML = json.articles.map(createArticle).join('\n'); 
}
function createArticle(article) {
    var x = article.publishedAt;
    var str = x.slice(0,10);
    var arr = str.split("-");
    return `
    <div class="example-2 card" style="margin-top:15px; margin-bottom:15px">
        <div class="wrapper" style="background: url(${article.urlToImage}) center/cover no-repeat; color:black">
            <div class="header">
                <div class="date">
                    <span class="day">${arr[2]}</span>
                    <span class="month">${months[arr[1]-1]}</span>
                    <span class="year">${arr[0]}</span>
                </div>
                <ul class="menu-content">
                    <li><a href="#" class="fa fa-bookmark-o"></a></li>
                    <li><a href="#" class="fa fa-heart-o"><span>18</span></a></li>
                    <li><a href="#" class="fa fa-comment-o"><span>3</span></a></li>
                </ul>
            </div>
            <div class="data">
                <div class="content">
                    <span class="author">${article.author}</span>
                    <h1 class="title"><a href="#">${article.title}</a></h1>
                    <p class="text">${article.description}</p>
                    <a href="${article.url}" class="button">Read more</a>
                </div>
            </div>
        </div>
    </div>
    `;
  }