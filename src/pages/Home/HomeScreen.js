import React from 'react';
import { Background } from '../../utils/Style';
import Header from '../../components/Header';
import Router from '../../route/Toptab.router';

export default function HomeScreen() {
 return (
   <Background>
     <Header/>
       <Router/>
   </Background>
  );
}
