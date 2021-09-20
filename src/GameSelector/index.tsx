import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Center, FormControl, Input, VStack } from "native-base";
import React from "react";
import { RootStackParamList } from "../../App";

export interface GameSelectorFormData {
  gameId: number;
}

type Props = NativeStackScreenProps<RootStackParamList, "GameSelector">;

export default function ({ navigation }: Props) {
  const [formData, setData] = React.useState<GameSelectorFormData>({
    gameId: -1,
  });
  const [errors, setErrors] = React.useState({});

  const validate = () => {
    if (!formData.gameId) {
      setErrors({
        ...errors,
        gameId: "The game id cannot be empty",
      });
      console.error("Validation Failed")
      return false;
    }

    setErrors({});
    console.info("Submitted")
    return true;
  };

  const handleChangeText = (value: string) => {
    setData({ ...formData, gameId: +value });
  };

  const onSubmit = () => {
    validate()
      ? navigation.navigate("GameState", {
          gameId: formData.gameId,
        })
      : console.error("Validation Failed");
  };

  return (
    <Center flex={1}>
      <VStack width="90%" mx={3}>
        <FormControl isRequired isInvalid={"gameId" in errors}>
          <FormControl.Label _text={{ bold: true }}>Game id</FormControl.Label>
          <Input
            placeholder="1, 2..."
            keyboardType="numeric"
            returnKeyType="done"
            onChangeText={(value) => handleChangeText(value)}
          />

          {"gameId" in errors ? (
            <FormControl.ErrorMessage
              _text={{ fontSize: "xs", color: "error.500", fontWeight: 500 }}
            >
              The game id cannot be empty.
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText _text={{ fontSize: "xs" }}>
              The game id should be a number.
            </FormControl.HelperText>
          )}
        </FormControl>

        <Button onPress={onSubmit} mt={5} colorScheme="cyan">
          Submit
        </Button>
      </VStack>
    </Center>
  );
}
