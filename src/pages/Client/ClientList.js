import React, {useState} from 'react';
import { Text, View, FlatList, Modal,  } from 'react-native';
import { Background } from '../../components/Style';
import Header from '../../components/Header';
import { Container, ItemList, ItemListText, ModalContainer } from './styles';
import FloatingButton from '../../components/FloatingButton';
import Icon from '@expo/vector-icons/MaterialIcons';
import NewClient from './NewClient';

export default function Client() {
  const [modalVisibility, setModalVisibility] = useState(false);

  const [people, setPeople] = useState([
    { key: 1, nome: 'felipe', telefone: '123465789' },
    { key: 2, nome: 'marcos', telefone: '123465789' },
    { key: 3, nome: 'jose', telefone: '123465789' },
  ]);

  function addUser(name, phone) {
     setPeople(oldArray=>[{key:people.length+1, nome: name, phone: phone},...oldArray])
       
     

      console.log(people);
  }

  return (
    <Background>
      <Header />
      <Container>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={people}
          keyExtractor={item => item.key.toString()}
          renderItem={({ item }) => (<ItemList><ItemListText>{item.nome}</ItemListText></ItemList>)}
        />
        <Text>Tela do cliente</Text>

        <View style={{borderWidth:1, borderRadius:5}}>
      
        </View>

     
      </Container>

      {modalVisibility &&
      
       <Modal
       transparent={true}         
       animationType="slide" visible={modalVisibility} onRequestClose={()=>setModalVisibility(false)}>
         <NewClient modalClose={setModalVisibility} setUser={(name, phone)=>addUser(name, phone)}/>
         </Modal>
        
      }
     
          
         
      <FloatingButton onClick={()=> setModalVisibility(true)}
      icon={<Icon name='person-add' size={30} color="white" />} />
    </Background>
  );
}