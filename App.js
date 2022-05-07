import React, { useEffect, useRef, useState } from 'react';
import { Text, View, SafeAreaView, Button, TextInput, Animated, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons'
import * as Permissions from 'expo-permissions'
import * as Notifications from 'expo-notifications'

//simplesmente o cabeçalho
import Cabecalho from './components/Cabecalho/index'
//o arquivo que contem o style sheet
import estilos from './estilos'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export default function App() {

  const [temPermissaoNotificacoes, setTemPermissaoNotificacoes] = useState(null)
  const [titulo, setTitulo] = useState('')
  const [texto, setTexto] = useState('')

  const listenerDeNotificacao = useRef()
  const listenerDeResposta = useRef()


  const mostrarAlert = useRef(new Animated.Value(0)).current;

  const mostrar = () => {
    Animated.timing(mostrarAlert, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false
    }).start()
  };

  const esconder = () => {
    Animated.timing(mostrarAlert, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: false
    }).start()
    limparInputs();
  };

  const limparInputs = () => {
    setTitulo('');
    setTexto('');
  };


  useEffect(() => {

    //pede permissão para gerar notificações
    (
      async () => {

        const { status } = await Notifications.requestPermissionsAsync()
        setTemPermissaoNotificacoes(status === 'granted')

      }
    )() //as vezes o app da um aviso relacionado a promessas

    listenerDeNotificacao.current = Notifications.addNotificationReceivedListener()

    listenerDeResposta.current = Notifications.addNotificationResponseReceivedListener()

    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });

    //o return do use effect é executado quando o elemento deixa de ser renderizado
    return () => {
      Notifications.removeNotificationSubscription(listenerDeNotificacao)
      Notifications.removeNotificationSubscription(listenerDeResposta)
    }

  }, [])

  //agenda uma notifcação
  async function gerarNotificacao() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: titulo.toString(),
        body: texto.toString(),
      },
      trigger: { seconds: 1 },
      //teoricamente daria pra mudar esse valor e fazer a Notif. aparecer em um certo horario
      //mas eu não sei como isso iria interagir com o app sendo fechado
    })

    mostrar(); //mostra a seta da notificação
  }

  //É renderizado caso não tenha obtido permição para usar notificações
  if (!temPermissaoNotificacoes) {
    return <View><Text>Não foi possivel acessar as notificações</Text></View>
  }

  return (
    <SafeAreaView style={estilos.container}>

      {/*O Cabeçalho */}
      <Cabecalho titulo='PushMe' />

      <Animated.View
        style={[{ opacity: mostrarAlert }, estilos.alert]}>
        <TouchableOpacity onPress={esconder}>
          <Text style={estilos.Talert}>Veja seu lembrete 👆!</Text>
        </TouchableOpacity>
      </Animated.View>

      {/*O texto que explica o que o app faz */}
      <View style={estilos.centro}>

        <Text>Dê um título e escreva uma mensagem, pressione o botão</Text>{/*<br/> não funciona */}
        <Text>e gere um lembrete em suas notificações!</Text>

      </View>

      <View style={estilos.centro}>

        {/*O campo que segura o Titulo da notificação */}
        <View style={estilos.alto}>

          <Text style={estilos.texto}>Titulo:</Text>
          <TextInput
            onChangeText={texto => setTitulo(texto)}
            defaultValue={titulo}
            style={estilos.input}
            placeholder='O Titulo Da Sua Notificação'
            maxLength={30}
          />

        </View>

        {/*O campo que segura o corpo da notificação */}
        <View style={estilos.alto}>

          <Text style={estilos.texto}>Texto:</Text>
          
          <TextInput
            onChangeText={texto => setTexto(texto)}
            defaultValue={texto}
            style={estilos.input}
            placeholder='O Texto Da Sua Notificação'
            maxLength={100}
            multiline={true}
          />
        
        </View>
      
      </View>

      <View style={estilos.baixo}>
        <TouchableOpacity onPress={async () => await gerarNotificacao()}>
          <View>
            <AntDesign name='pushpin' size={40} color={'#017e'} />
          </View>
        </TouchableOpacity>
      </View>

    </SafeAreaView >
  );
}