import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatModal from '../components/ChatModal';
import axios from 'axios';

jest.mock('axios');

describe('ChatModal', () => {
  const mockProvider = {
    _id: 'provider123',
    name: 'Test Provider',
    category: 'Plumbing',
    profileImage: ''
  };

  const mockUser = {
    _id: 'user123',
    name: 'Test User'
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: { messages: [] }
    });

    axios.post.mockResolvedValue({});
  });

  test('sends a message', async () => {
    render(
      <ChatModal
        isOpen={true}
        onClose={jest.fn()}
        provider={mockProvider}
        currentUser={mockUser}
      />
    );

    const input = await screen.findByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'Hello' } });

    fireEvent.click(screen.getByText('Send'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });

    expect(input.value).toBe('');
  });
});
