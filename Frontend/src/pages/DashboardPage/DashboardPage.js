import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Tabs,
    Tab,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import useNotification from '@/hooks/useNotification';

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [movies, setMovies] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState(''); // 'movie' or 'user'
    const [dialogMode, setDialogMode] = useState(''); // 'add' or 'edit'
    const [selectedItem, setSelectedItem] = useState(null);
    const { showNotification } = useNotification();

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    // Form states
    const [movieForm, setMovieForm] = useState({
        title: '',
        description: '',
        releaseYear: '',
        duration: '',
        genre: '',
        director: '',
        cast: '',
        posterUrl: '',
        trailerUrl: '',
        videoUrl: '',
    });

    const [userForm, setUserForm] = useState({
        username: '',
        email: '',
        fullName: '',
        subscription: 'FREE',
    });

    useEffect(() => {
        fetchMovies();
        fetchUsers();
    }, []);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/movies`);
            if (response.data && response.data.code === 1000) {
                setMovies(response.data.data);
            }
        } catch (err) {
            setError('Không thể tải danh sách phim');
            showNotification('Không thể tải danh sách phim', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/users`);
            if (response.data && response.data.code === 1000) {
                setUsers(response.data.data);
            }
        } catch (err) {
            setError('Không thể tải danh sách người dùng');
            showNotification('Không thể tải danh sách người dùng', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleOpenDialog = (type, mode, item = null) => {
        setDialogType(type);
        setDialogMode(mode);
        setSelectedItem(item);
        if (mode === 'edit' && item) {
            if (type === 'movie') {
                setMovieForm(item);
            } else {
                setUserForm(item);
            }
        } else {
            // Reset form when adding new
            if (type === 'movie') {
                setMovieForm({
                    title: '',
                    description: '',
                    releaseYear: '',
                    duration: '',
                    genre: '',
                    director: '',
                    cast: '',
                    posterUrl: '',
                    trailerUrl: '',
                    videoUrl: '',
                });
            } else {
                setUserForm({
                    username: '',
                    email: '',
                    fullName: '',
                    subscription: 'FREE',
                });
            }
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedItem(null);
    };

    const handleMovieSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Không tìm thấy token xác thực');

            if (dialogMode === 'add') {
                const response = await axios.post(
                    `${apiUrl}/movies`,
                    movieForm,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (response.data && response.data.code === 1000) {
                    showNotification('Thêm phim thành công!', 'success');
                    fetchMovies();
                }
            } else {
                const response = await axios.put(
                    `${apiUrl}/movies/${selectedItem.id}`,
                    movieForm,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (response.data && response.data.code === 1000) {
                    showNotification('Cập nhật phim thành công!', 'success');
                    fetchMovies();
                }
            }
            handleCloseDialog();
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra');
            showNotification('Có lỗi xảy ra khi xử lý phim', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Không tìm thấy token xác thực');

            if (dialogMode === 'add') {
                const response = await axios.post(
                    `${apiUrl}/users`,
                    userForm,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (response.data && response.data.code === 1000) {
                    showNotification('Thêm người dùng thành công!', 'success');
                    fetchUsers();
                }
            } else {
                const response = await axios.put(
                    `${apiUrl}/users/${selectedItem.id}`,
                    userForm,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (response.data && response.data.code === 1000) {
                    showNotification('Cập nhật người dùng thành công!', 'success');
                    fetchUsers();
                }
            }
            handleCloseDialog();
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra');
            showNotification('Có lỗi xảy ra khi xử lý người dùng', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Không tìm thấy token xác thực');

            if (type === 'movie') {
                const response = await axios.delete(`${apiUrl}/movies/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data && response.data.code === 1000) {
                    showNotification('Xóa phim thành công!', 'success');
                    fetchMovies();
                }
            } else {
                const response = await axios.delete(`${apiUrl}/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data && response.data.code === 1000) {
                    showNotification('Xóa người dùng thành công!', 'success');
                    fetchUsers();
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra');
            showNotification('Có lỗi xảy ra khi xóa', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'var(--second-black)', pt: 8 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" sx={{ color: 'white', mb: 4 }}>
                    Dashboard
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Paper sx={{ width: '100%', mb: 2, bgcolor: 'var(--black)' }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab label="Quản lý phim" />
                        <Tab label="Quản lý người dùng" />
                    </Tabs>

                    {/* Movies Tab */}
                    {activeTab === 0 && (
                        <Box sx={{ p: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog('movie', 'add')}
                                sx={{ mb: 2 }}
                            >
                                Thêm phim mới
                            </Button>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Tên phim</TableCell>
                                            <TableCell>Năm phát hành</TableCell>
                                            <TableCell>Thể loại</TableCell>
                                            <TableCell>Thao tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {movies.map((movie) => (
                                            <TableRow key={movie.id}>
                                                <TableCell>{movie.id}</TableCell>
                                                <TableCell>{movie.title}</TableCell>
                                                <TableCell>{movie.releaseYear}</TableCell>
                                                <TableCell>{movie.genre}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() =>
                                                            handleOpenDialog('movie', 'edit', movie)
                                                        }
                                                        color="primary"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleDelete('movie', movie.id)}
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {/* Users Tab */}
                    {activeTab === 1 && (
                        <Box sx={{ p: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog('user', 'add')}
                                sx={{ mb: 2 }}
                            >
                                Thêm người dùng mới
                            </Button>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Tên đăng nhập</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Họ tên</TableCell>
                                            <TableCell>Gói đăng ký</TableCell>
                                            <TableCell>Thao tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>{user.id}</TableCell>
                                                <TableCell>{user.username}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.fullName}</TableCell>
                                                <TableCell>{user.subscription}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() =>
                                                            handleOpenDialog('user', 'edit', user)
                                                        }
                                                        color="primary"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleDelete('user', user.id)}
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </Paper>

                {/* Movie Dialog */}
                <Dialog
                    open={openDialog && dialogType === 'movie'}
                    onClose={handleCloseDialog}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        {dialogMode === 'add' ? 'Thêm phim mới' : 'Chỉnh sửa phim'}
                    </DialogTitle>
                    <DialogContent>
                        <Box component="form" onSubmit={handleMovieSubmit} sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Tên phim"
                                        value={movieForm.title}
                                        onChange={(e) =>
                                            setMovieForm({ ...movieForm, title: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Mô tả"
                                        multiline
                                        rows={4}
                                        value={movieForm.description}
                                        onChange={(e) =>
                                            setMovieForm({ ...movieForm, description: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Năm phát hành"
                                        value={movieForm.releaseYear}
                                        onChange={(e) =>
                                            setMovieForm({ ...movieForm, releaseYear: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Thời lượng (phút)"
                                        value={movieForm.duration}
                                        onChange={(e) =>
                                            setMovieForm({ ...movieForm, duration: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Thể loại"
                                        value={movieForm.genre}
                                        onChange={(e) =>
                                            setMovieForm({ ...movieForm, genre: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Đạo diễn"
                                        value={movieForm.director}
                                        onChange={(e) =>
                                            setMovieForm({ ...movieForm, director: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Diễn viên"
                                        value={movieForm.cast}
                                        onChange={(e) =>
                                            setMovieForm({ ...movieForm, cast: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="URL Poster"
                                        value={movieForm.posterUrl}
                                        onChange={(e) =>
                                            setMovieForm({ ...movieForm, posterUrl: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="URL Trailer"
                                        value={movieForm.trailerUrl}
                                        onChange={(e) =>
                                            setMovieForm({ ...movieForm, trailerUrl: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="URL Video"
                                        value={movieForm.videoUrl}
                                        onChange={(e) =>
                                            setMovieForm({ ...movieForm, videoUrl: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Hủy</Button>
                        <Button onClick={handleMovieSubmit} variant="contained">
                            {dialogMode === 'add' ? 'Thêm' : 'Cập nhật'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* User Dialog */}
                <Dialog
                    open={openDialog && dialogType === 'user'}
                    onClose={handleCloseDialog}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        {dialogMode === 'add' ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}
                    </DialogTitle>
                    <DialogContent>
                        <Box component="form" onSubmit={handleUserSubmit} sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Tên đăng nhập"
                                        value={userForm.username}
                                        onChange={(e) =>
                                            setUserForm({ ...userForm, username: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        value={userForm.email}
                                        onChange={(e) =>
                                            setUserForm({ ...userForm, email: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Họ tên"
                                        value={userForm.fullName}
                                        onChange={(e) =>
                                            setUserForm({ ...userForm, fullName: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Gói đăng ký"
                                        value={userForm.subscription}
                                        onChange={(e) =>
                                            setUserForm({ ...userForm, subscription: e.target.value })
                                        }
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        <option value="FREE">Free</option>
                                        <option value="PREMIUM">Premium</option>
                                        <option value="VIP">VIP</option>
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Hủy</Button>
                        <Button onClick={handleUserSubmit} variant="contained">
                            {dialogMode === 'add' ? 'Thêm' : 'Cập nhật'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default DashboardPage; 