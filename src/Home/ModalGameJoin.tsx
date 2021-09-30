import { FormControl, Modal, Button, Input } from 'native-base';
import React from 'react';

interface ModalGameJoinProps {
  setShowModal: (bool: boolean) => void;
  joinGame: (id: number) => void;
  showModal: boolean;
}

export const ModalGameJoin = ({
  showModal,
  setShowModal,
  joinGame,
}: ModalGameJoinProps) => {
  let gameId: number;
  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Join new game</Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormControl.Label>Game ID</FormControl.Label>
            <Input type="number" onChangeText={(value) => (gameId = +value)} />
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => {
                setShowModal(false);
              }}
            >
              Cancel
            </Button>

            <Button
              onPress={() => {
                setShowModal(false);
                joinGame(gameId);
              }}
            >
              Join Game
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
