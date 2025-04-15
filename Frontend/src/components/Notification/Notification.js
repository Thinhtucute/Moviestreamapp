import { Snackbar, Alert } from '@mui/material';

const Notification = ({ notification, closeNotification }) => {
    return (
        <Snackbar
            open={notification.open}
            autoHideDuration={3000} // Tự động đóng sau 3 giây
            onClose={closeNotification}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Hiển thị ở góc trái trên
            sx={{
                '& .MuiSnackbarContent-root': {
                    minWidth: '500px', // Tăng chiều rộng
                    minHeight: '120px', // Tăng chiều cao
                },
            }}
        >
            <Alert
                onClose={closeNotification}
                severity={notification.severity}
                sx={{ width: '100%', fontSize: '1.6rem', padding: '16px' }}
            >
                {notification.message}
            </Alert>
        </Snackbar>
    );
};

export default Notification;
