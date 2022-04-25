import { StyleSheet, Text, View, FlatList, Modal, Pressable, Image, ScrollView, TouchableOpacity, Linking } from 'react-native'
import React, { useState } from 'react'
import { getAuth } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import screenshotCamera from '../assets/screenshot_camera.jpg';
import screenshotPhotoPlant from '../assets/screenshot_photoplant.jpg';


export default function SavedScreen() {
  const [plantsList, setPlantsList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [plantItem, setPlantItem] = useState({});

  const BASE_URL = 'https://4992-78-147-211-58.eu.ngrok.io';
  
  //This is used to perform the getPlants again when navigating back to this screen
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      getPlants();
      return () => {
        isActive = false;
      };
    }, [])
  );

  async function getPlants() {
    const auth = getAuth();
      fetch(`${BASE_URL}/plants`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data : auth.currentUser.email})
      }).then(res => res.json())
        .then(result => {
          setPlantsList(sortPlantsByDate(result.data));
        })
        .catch(err => console.error('SAVED SCREEN NETWORK ERROR: ', err));
  }

  function sortPlantsByDate(arr) {
    return arr.sort((a, b) => (Date.parse(b.date) - Date.parse(a.date)));
  }

  function showPlantDetails(id) {
    setPlantItem(plantsList.find(plant => plant._id == id));
    setModalVisible(true);
  }

  async function removePlantFromList(id) {
    console.log('Plant ID to remove: ', id);
    await fetch(`${BASE_URL}/plantItem/${id}`, {
      method: 'DELETE',
    }).then(res => res.json())
      .then(result => {
        console.log('Item deleted: ', result);
        setPlantsList( currPlants => {
          return currPlants.filter( plant => plant._id !== id);
        } );
      })
    setModalVisible(!modalVisible);
  }

  const renderItem = ({ item }) => <TouchableOpacity 
                                        style={styles.button} 
                                        key={item._id} 
                                        onPress={() => showPlantDetails(item._id)}
                                    >
                                    <Image style={styles.image} source={{uri: item.imageUrl}}></Image>
                                    <Text style={styles.text}>{item.title}</Text>
                                    </TouchableOpacity>

  return (
    
    <View style = {styles.container}>
      
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <ScrollView style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={styles.modalImage}
              source={{uri: plantItem.imageUrl}}
            ></Image>
            <Text style={styles.modalText} onPress={() => Linking.openURL(plantItem.plantInfoUrl)}>{plantItem.title}</Text>
            <Text style={styles.description}>{plantItem.description}</Text>
            <View style={styles.buttonsContainer}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Ok</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose, styles.button2]}
                onPress={() => removePlantFromList(plantItem._id)}
              >
                <Text style={styles.textStyle}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </Modal>
      {plantsList.length > 0 && 
      <FlatList data={plantsList} renderItem={renderItem} keyExtractor={item => item._id}/>
      }
      {plantsList.length == 0 && 
      <ScrollView style={styles.scrollViewContainer}>
        <Text style={styles.textNoSavedPlants}>You have no saved plants.</Text>
        
          <Image style={styles.screenshotImage} source={screenshotCamera}></Image>
        
        <Text style={styles.textNoSavedPlants}>Click on the Camera Icon to take picture or upload a plant.</Text>
        
          <Image style={styles.screenshotPlant} source={screenshotPhotoPlant}></Image>
        <Text style={styles.textNoSavedPlants}>Once identified you will have the option of saving or discarding the result.</Text>
      </ScrollView>
      }
    </View>
      
    
  )
}

const styles = StyleSheet.create({
  screenshotImage: {
    width: '70%',
    height: 160,
    resizeMode: 'contain',
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  screenshotPlant: {
    width: '70%',
    height: 230,
    resizeMode: 'contain',
    marginLeft: 'auto',
    marginRight: 'auto',
    
  },
  textNoSavedPlants: {
    color: 'black',
    fontSize: 20,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  centeredView: {
    flex: 1,
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    fontSize: 24,
    color: '#2196F3',
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  modalImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20
  },
  description: {
    fontSize: 15
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 10,
    
  },
  buttonClose: {
    width: 100,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 5,
    justifyContent: 'center',
  },
  button2: {
    backgroundColor: '#e32f45'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20
  },
  container: {
    flex: 1,
    marginBottom: 140,
  },
  scrollViewContainer: {
    flex: 1,
  },
  image: {
    height: 100,
    width: 100,
    resizeMode: 'cover',
    marginBottom: 5,
    borderRadius: 5
  },
  button: {  
    flexDirection: 'row',
    margin: 20,
    
  },
  text: {
    marginTop: 35,
    marginLeft: 15,
    fontSize: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
  }
})