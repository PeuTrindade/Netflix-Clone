import React,{ useEffect, useState } from "react";
import Tmdb from "./Tmdb";
import MovieRow from "./Components/MovieRow";
import "./App.css"
import FeaturedMovie from "./Components/FeaturedMovie";
import Header from "./Components/Header";

function App(props){
    const [movieList,setMovieList] = React.useState([]);
    const [featuredData,setFeaturedData] = React.useState(null);
    const [blackHeader,setBlackHeader] = React.useState(false);

    useEffect(()=>{
      const loadAll = async () =>{
        let list = await Tmdb.getHomeList();
        setMovieList(list);
        let originals = list.filter(i=>i.slug==="originals");
        let randomChosen = Math.floor(Math.random()*(originals[0].items.results.length -1));
        let chosen = originals[0].items.results[randomChosen];
        let chosenInfo = await Tmdb.getMovieInfo(chosen.id,"tv");
       setFeaturedData(chosenInfo)
      }
      loadAll()
    },[]);
    useEffect(()=>{
      const scrollListener = () => {
        if(window.scrollY > 100){
            setBlackHeader(true)
        }
        else {
            setBlackHeader(false)
        }
      }
      window.addEventListener("scroll",scrollListener);
      return () => {
          window.removeEventListener("scroll",scrollListener);
      }
    },[]);
    return(
        <div className="page">
          <Header black={blackHeader}/>
          {featuredData && <FeaturedMovie item={featuredData}/>}
          <section className="lists">
            {movieList.map((item,key)=>(
            <MovieRow key={key} title={item.title} items={item.items}/>
            ))}
          </section>
          <footer>
              <p>Feito por Pedro Henrique Trindade</p>
              <p>Direitos de imagem para Netflix</p>
              <p>Dados pegos do site Themoviedb.org</p> 
          </footer>
          {movieList.length<=0 && 
          <div className="loading">
            <img src="http://cdn.playbuzz.com/cdn/9e9f12db-279e-4141-8fe6-fd5bfc5d9fb8/4f155204-7266-486d-88a5-2018ff11f947.gif"></img>
          </div>
          }
        </div>
    )
}
export default App;