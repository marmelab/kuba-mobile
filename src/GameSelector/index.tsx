import { Button, Center, FormControl, Input, VStack } from "native-base";
import React from "react";

export interface GameSelectorFormData {
  gameId: number | undefined;
}

const GameSelectorForm = () => {
  const [formData, setData] = React.useState<GameSelectorFormData>({
    gameId: undefined,
  });
  const [errors, setErrors] = React.useState({});

  const validate = () => {
    if (formData.gameId === undefined || formData.gameId === 0) {
      setErrors({
        ...errors,
        gameId: "The game id cannot be empty",
      });
      return false;
    }

    setErrors({});
    return true;
  };

  const onSubmit = () => {
    validate() ? console.info("Submitted") : console.error("Validation Failed");
  };

  return (
    <VStack width="90%" mx={3}>
      <FormControl isRequired isInvalid={'gameId' in errors}>
        <FormControl.Label _text={{ bold: true }}>Game id</FormControl.Label>
        <Input
          placeholder="1, 2..."
          keyboardType="numeric"
          returnKeyType="done"
          onChangeText={(value) => setData({ ...formData, gameId: +value })}
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
  );
};

export default function () {
  return (
    <Center flex={1}>
      <GameSelectorForm />
    </Center>
  );
}
