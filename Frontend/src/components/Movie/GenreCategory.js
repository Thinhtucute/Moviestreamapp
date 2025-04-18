import { Box, Typography} from '@mui/material';
import ChevronRight from '@mui/icons-material/ChevronRight';
const categories = [
    { id: 1, name: 'Marvel', gradient: 'linear-gradient(to right, #3b82f6, #6366f1)' },
    { id: 2, name: '4K', gradient: 'linear-gradient(to right, #a78bfa, #6366f1)' },
    { id: 3, name: 'Sitcom', gradient: 'linear-gradient(to right, #34d399, #14b8a6)' },
    { id: 4, name: 'Lồng Tiếng Cực Mạnh', gradient: 'linear-gradient(to right, #8b5cf6, #7c3aed)' },
    { id: 5, name: 'Xuyên Không', gradient: 'linear-gradient(to right, #f97316, #f59e0b)' },
    { id: 6, name: '+4 chủ đề', gradient: 'linear-gradient(to right, #94a3b8, #6b7280)', noViewText: true },
];

export default function CategoryScroll() {
    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                px: 'var(--margin-left-right)',
                background: 'linear-gradient(to bottom, transparent, var(--black))',
            }}
        >
            <Typography variant="h3" color="white" sx={{ mb: 2 }}>
                Bạn đang quan tâm gì?
            </Typography>

            <Box sx={{ position: 'relative', '&:hover .scroll-button': { opacity: 1 } }}>
                <Box
                    sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        gap: 2,
                        pb: 1,
                        scrollSnapType: 'x mandatory',
                        '&::-webkit-scrollbar': { display: 'none' },
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {categories.map((cat) => (
                        <Box
                            key={cat.id}
                            sx={{
                                flexShrink: 0,
                                width: 227,
                                height: 140,
                                borderRadius: 2,
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                background: cat.gradient,
                                color: 'white',
                                cursor: 'pointer',
                                scrollSnapAlign: 'start',
                                transition: 'transform 0.3s',
                                boxShadow: 3,
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                },
                                '@media (min-width: 1600px)': {
                                    width: 290, // Tăng kích thước lên 1.5 lần
                                    height: 150, // Tăng kích thước lên 1.5 lần
                                },
                            }}
                        >
                            <Typography variant="h4" fontWeight="bold" sx={{ mt: '10px' }}>
                                {cat.name}
                            </Typography>
                            {!cat.noViewText && (
                                <Box display="flex" alignItems="center" sx={{ opacity: 0.9 }} gap={'2px'}>
                                    <Typography variant="body">Xem chủ đề</Typography>
                                    <ChevronRight variant="medium" />
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
