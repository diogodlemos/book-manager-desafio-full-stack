export function Loading() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <div
                style={{
                    width: 36,
                    height: 36,
                    border: '3px solid #313244',
                    borderTop: '3px solid #cba6f7',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}
