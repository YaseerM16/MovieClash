const autocomplete = {
  optionRender(movie) {
    const imgSrc = movie.Poster === "N/A" ? " " : movie.Poster;
    return `
    <img src="${imgSrc}" style="width:50px;height:80px;" />
    ${movie.Title} (${movie.Year})
  `;
  },

  selectValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "15a3af1f",
        s: searchTerm,
      },
    });

    if (response.data.Error) {
      return [];
    }

    return response.data.Search;
  },
};

creatAutocomplete({
  ...autocomplete,
  root: document.querySelector(".left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".mynotify").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector(".left-summary"), 'left');
  },
});
creatAutocomplete({
  ...autocomplete,
  root: document.querySelector(".right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".mynotify").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector(".right-summary"), 'right');
  },
});
let leftside;
let rightside;
const onMovieSelect = async (movie, targetSummary, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "15a3af1f",
      i: movie.imdbID,
    },
  });
  console.log(response.data);
  
  targetSummary.innerHTML = movieTemplate(response.data);

  if (side === 'left') {
    leftside = response.data;
  } else if(side === 'right') {
    rightside = response.data;
  }

  if (leftside && rightside) {
    console.log(document.querySelectorAll('.right-summary .notification'));
    onCompare()
  }
  
};

function onCompare() {
  const rightSummary = document.querySelectorAll('.right-summary .notification');
  const leftSummary = document.querySelectorAll('.left-summary .notification');
  
  leftSummary.forEach((leftStat, index) => {
    const rightStat = rightSummary[index];
    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);
    if(rightSideValue>leftSideValue){
      leftStat.classList.remove('is-primary')
      leftStat.classList.add('is-warning')
    }else{
      rightStat.classList.remove('is-primary')
      rightStat.classList.add('is-warning')
    }
  });
}

const movieTemplate = (movieObj) => {
  let count = 0;
  const awards = movieObj.Awards.split(' ').forEach(element => {
    const value = parseInt(element)
    if(isNaN(value)){
      return;
    }else{
      count = count + value;
    }
    return count;
  });
  const boxoffice = parseInt(movieObj.BoxOffice.replace(/\$/g,'').replace(/,/g,''))
  const imdbVotes = parseInt(movieObj.imdbVotes.replace(/,/g,''));
  const imdbRating = parseFloat(movieObj.imdbRating);
  const Metascore = parseInt(movieObj.Metascore)
  return `
      <article class="media">
        <div class="container-content">
          <figure class="media-left">
            <p class="image">
              <img src="${movieObj.Poster}" style="width:100px;height:160px;" />
            </p>  
          </figure>
          <div class="media-content">
            <div class="content">
              <h1>${movieObj.Title}</h1>
              <h4>${movieObj.Genre}</h4>
              <p>${movieObj.Plot}</p>
            </div>
          </div><br></br>
        </div>
        <article data-value=${awards} class="notification is-primary">
          <p class="title">${movieObj.Awards}</p>
          <p class="subtitle">Awards</p>
        </article><br>
        <article data-value=${boxoffice} class="notification is-primary">
          <p class="title">${movieObj.BoxOffice}</p>
          <p class="subtitle">Box Office</p>
        </article><br>
        <article data-value=${Metascore} class="notification is-primary">
          <p class="title">${movieObj.Metascore}</p>
          <p class="subtitle">Metascore</p>
        </article><br>
        <article data-value=${imdbRating} class="notification is-primary">
          <p class="title">${movieObj.imdbRating}</p>
          <p class="subtitle">IMDB Rating</p>
        </article><br>
        <article data-value=${imdbVotes} class="notification is-primary">
          <p class="title">${movieObj.imdbVotes}</p>
          <p class="subtitle">IMDB Votes</p>
        </article>

      </article>
    `;
};
