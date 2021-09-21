import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Input,
  View,
  VStack,
  Text,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { RootStackParamList } from '../../App';
import { API_URL } from '../constant';
import { Game } from '../interface';

export interface GameSelectorFormData {
  gameId: number;
}

export default function ({ navigation, player }: any) {
  const [formData, setData] = React.useState<GameSelectorFormData>({
    gameId: -1,
  });
  const [errorsForm, setErrorsForm] = React.useState({});
  const [userGames, setUserGames] = useState<Game[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorUserGames, setErrorUserGames] = useState<any>();

  const validate = () => {
    if (!formData.gameId) {
      setErrorsForm({
        ...errorsForm,
        gameId: 'The game id cannot be empty',
      });
      return false;
    }

    setErrorsForm({});
    navigation.navigate('GameState', {
      gameId: formData.gameId,
    });
    return true;
  };

  const handleChangeText = (value: string) => {
    setData({ ...formData, gameId: +value });
  };

  const onSubmit = () => validate();

  const getUserGames = async () => {
    try {
      const response = await fetch(
        `${API_URL}/games?filter=${encodeURI(
          JSON.stringify({ playerNumber: [player.id] }),
        )}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + player.token,
          },
        },
      );
      const json = (await response.json()).data as Game[];
      setUserGames(json);
    } catch (error) {
      setErrorUserGames(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserGames();
  }, []);

  const GameSelectorForm = () => {
    return (
      <VStack width="90%" mx={3}>
        <FormControl isRequired isInvalid={'gameId' in errorsForm}>
          <FormControl.Label _text={{ bold: true }}>Game id</FormControl.Label>
          <Input
            placeholder="1, 2..."
            keyboardType="numeric"
            returnKeyType="done"
            onChangeText={(value) => handleChangeText(value)}
          />

          {'gameId' in errorsForm ? (
            <FormControl.ErrorMessage
              _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }}
            >
              The game id cannot be empty.
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText _text={{ fontSize: 'xs' }}>
              The game id should be a number.
            </FormControl.HelperText>
          )}
        </FormControl>

        <Button onPress={onSubmit} mt={5} colorScheme="cyan">
          Submit
        </Button>
      </VStack>
    );
  };

  const UserGamesList = () => {
    console.log(userGames);
    return (
      <View>
        {userGames?.map((game) => (
          <Box
            shadow={1}
            mb={4}
            width="full"
            bg={{
              linearGradient: {
                colors: ['cyan.400', 'cyan.100'],
                start: [0, 0],
                end: [1, 0],
              },
            }}
            rounded="lg"
            key={game.id}
          >
            <HStack
              alignItems="center"
              justifyContent="space-between"
              p={4}
              space={2}
            >
              <Text fontSize="lg" bold color="white">
                Game #{game?.id}
              </Text>
            </HStack>
          </Box>
        ))}
      </View>
    );
  };

  return (
    <Center flex={1}>
      <GameSelectorForm />
      <UserGamesList />
    </Center>
  );
}
