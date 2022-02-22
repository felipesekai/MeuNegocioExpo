import React from 'react';
import { Text, View } from 'react-native';
import { Background } from '../../components/Style';
 import Header from '../../components/Header';

export default function Home() {
 return (
   <Background>
     <Header/>
       <Text>tela home</Text>
   </Background>
  );
}