import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProviderProfileView from '../components/ProviderProfileView';
import axios from 'axios';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

jest.mock('axios');

describe('ProviderProfileView booking flow', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem(
      'currentUser',
      JSON.stringify({ name: 'Test User', district: null })
    );

    axios.get.mockImplementation((url) => {
      if (url === '/api/auth/me') {
        return Promise.resolve({
          data: { user: { name: 'Test User', district: null } }
        });
      }

      if (url.includes('/api/providerprofile/profileview')) {
        return Promise.resolve({
          data: {
            provider: {
              _id: '123',
              name: 'Test Provider',
              category: 'Plumbing',
              district: 'Colombo',
              experience: '5 years',
              education: 'NVQ',
              rating: 4.5,
              reviewCount: 10,
              workImages: []
            }
          }
        });
      }

      if (url.includes('/api/bookings/availability')) {
        return Promise.resolve({
          data: { bookedDates: [] }
        });
      }

      return Promise.resolve({ data: {} });
    });
  });

  test('shows district modal on first booking', async () => {
    render(
      <MemoryRouter initialEntries={['/provider/123']}>
        <Routes>
          <Route path="/provider/:providerId" element={<ProviderProfileView />} />
        </Routes>
      </MemoryRouter>
    );

    const bookBtn = await screen.findByText('Book Service');
    fireEvent.click(bookBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/select your district/i)
      ).toBeInTheDocument();
    });
  });
});
