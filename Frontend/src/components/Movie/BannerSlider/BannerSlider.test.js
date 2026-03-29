import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BannerSlider from '@/components/Movie/BannerSlider/BannerSlider';
import { getFavoriteStatus, toggleFavorite } from '@/services/favoritesServices';
import { getAuthToken } from '@/utils/authStorage';
import { useSelector } from 'react-redux';

const mockNavigate = jest.fn();
const mockShowNotification = jest.fn();

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}));

jest.mock(
    'react-router-dom',
    () => ({
        useNavigate: () => mockNavigate,
    }),
    { virtual: true },
);

jest.mock('@/hooks/useNotification', () => () => ({
    showNotification: mockShowNotification,
}));

jest.mock('@/hooks/useBanners', () => ({
    useBanners: () => ({
        loading: false,
        error: null,
        banners: [
            {
                mediaId: 101,
                title: 'Test Banner',
                description: 'Test description',
                releaseYear: 2024,
                duration: 100,
                backdropURL: 'https://example.com/banner.jpg',
                genres: [{ genreId: 1, genreName: 'Action' }],
            },
        ],
    }),
}));

jest.mock('@/services/favoritesServices', () => ({
    getFavoriteStatus: jest.fn(),
    toggleFavorite: jest.fn(),
}));

jest.mock('@/utils/authStorage', () => ({
    getAuthToken: jest.fn(),
}));

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, variants, initial, animate, exit, transition, custom, ...props }) => (
            <div {...props}>{children}</div>
        ),
        img: ({
            variants,
            initial,
            animate,
            exit,
            transition,
            custom,
            drag,
            dragConstraints,
            whileTap,
            onDragEnd,
            ...props
        }) => <img {...props} alt={props.alt || 'motion-img'} />,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('BannerSlider favorite flows', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getFavoriteStatus.mockResolvedValue(false);
    });

    it('shows login warning and redirects when unauthenticated user toggles favorite', async () => {
        useSelector.mockImplementation((selector) => selector({ auth: { isAuthenticated: false, loading: false } }));
        getAuthToken.mockReturnValue(null);

        render(<BannerSlider />);

        const favoriteButton = await screen.findByRole('button', { name: /add to favorites/i });
        fireEvent.click(favoriteButton);

        expect(mockShowNotification).toHaveBeenCalledWith('Please login to add to favorites', 'warning');
        expect(mockNavigate).toHaveBeenCalledWith('/login');
        expect(toggleFavorite).not.toHaveBeenCalled();
    });

    it('updates favorites for authenticated users', async () => {
        useSelector.mockImplementation((selector) => selector({ auth: { isAuthenticated: true, loading: false } }));
        getAuthToken.mockReturnValue('valid-token');
        toggleFavorite.mockResolvedValue({ code: 1000 });

        render(<BannerSlider />);

        const favoriteButton = await screen.findByRole('button', { name: /add to favorites/i });

        await waitFor(() => {
            expect(getFavoriteStatus).toHaveBeenCalledWith(101, 'valid-token');
        });

        fireEvent.click(favoriteButton);

        await waitFor(() => {
            expect(toggleFavorite).toHaveBeenCalledWith(101, 'valid-token');
        });

        expect(mockShowNotification).toHaveBeenCalledWith('Added to favorites', 'success');
    });
});
