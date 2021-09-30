import { useNavigation } from '../navigation/useNavigation';
import { Button, Modal } from 'native-base';
import React, { useState } from 'react';

export function ModalWin({ showModal, navigation }: any) {
  const { navigateToGameSelector } = useNavigation(navigation);
  const [isOpen, setIsOpen] = useState<boolean>(showModal);

  const handleNavigateButton = () => {
    navigateToGameSelector();
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>The game is over</Modal.Header>
        <Modal.Footer>
          <Button
            variant="ghost"
            colorScheme="blueGray"
            onPress={() => handleNavigateButton()}
          >
            Go to your games
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
