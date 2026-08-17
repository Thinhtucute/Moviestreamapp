import { Snackbar, Alert } from '@mui/material';

const Notification = ({ notification, closeNotification }) => {
    return (
        <Snackbar
            open={notification.open}
            autoHideDuration={notification.duration || 3000}
            onClose={closeNotification}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{
                '& .MuiSnackbarContent-root': {
                    minWidth: { xs: 'calc(100vw - 32px)', sm: '500px' },
                    maxWidth: { xs: 'calc(100vw - 32px)', sm: '600px' },
                    minHeight: '120px',
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
