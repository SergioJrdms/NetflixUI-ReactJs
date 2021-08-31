/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable import/no-anonymous-default-export */

import React, { useEffect, useState } from 'react';
import './App.css'
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [FeatureData, setFeatureData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(()=>{
    const loadAll = async () => {
      //Pegando a Lista Total
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      //Pegando o Feature
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1));
      let chosen = originals[0].items.results[randomChosen]
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeatureData(chosenInfo);
    }

    loadAll();
  }, []);

  useEffect(()=>{
    const scrollListener = () => {
      if(window.scrollY > 10){
        setBlackHeader(true);
      }else{
        setBlackHeader(false)
      }
    }

    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);

  return(
  <div className="page">

    <Header black={blackHeader}/>

  {FeatureData &&
    <FeaturedMovie item={FeatureData}/>
  }

    <section className="lists">
      {movieList.map((item, key)=>(
        <MovieRow key={key} title={item.title} items={item.items}/>
      ))}
    </section>


      <footer>
        Feito em <img src="./logo192.png" id='react'/> por <a href="https://github.com/DevSakazaki">DevSakazaki</a><br/>
        Direitos de imagem para Netflix<br/>
        Dados pegos do site Themoviedb.org
      </footer>

        {movieList.length <= 0 && 
      <div className='loading'>
        <img src="https://i.gifer.com/origin/36/36527397c208b977fa3ef21f68c0f7b2.gif" alt='Carregando' />
      </div>
      }
  </div>
  );
}