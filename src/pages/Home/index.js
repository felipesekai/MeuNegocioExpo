import React from 'react';
import { Text, View } from 'react-native';
import { Background } from '../../utils/Style';
 import Header from '../../components/Header';
import Router from '../../route/Toptab.router';
export default function Home() {
 return (
   <Background>
     <Header/>
       <Router/>
   </Background>
  );
}