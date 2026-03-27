import { useEffect, useRef } from 'react';

const MatrixBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Make canvas full screen
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Characters matching tech/matrix theme
        const letters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*]*';
        const lettersArray = letters.split('');

        // Font size and columns
        const fontSize = 16;
        const columns = canvas.width / fontSize;

        // Array of drops - one per column
        const drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        // Drawing the characters
        const draw = () => {
            // Black background with opacity to create trail effect
            ctx.fillStyle = 'rgba(13, 13, 13, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Classic Matrix Green
            ctx.fillStyle = '#00FF41';
            ctx.font = fontSize + 'px monospace';

            // Loop over drops
            for (let i = 0; i < drops.length; i++) {
                // Random character
                const text = lettersArray[Math.floor(Math.random() * lettersArray.length)];

                // x = i * fontSize, y = value of drops[i] * fontSize
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Sending drop back to top randomly after it crosses screen
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                // Increment Y coordinate
                drops[i]++;
            }
        };

        // Run the animation
        const interval = setInterval(draw, 33);

        // Handle window resize
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Reset drops if resizing
            const newColumns = canvas.width / fontSize;
            for (let x = 0; x < newColumns; x++) {
                if (!drops[x]) drops[x] = 1;
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                display: 'block',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none',
                opacity: 0.4 // Adjust for subtlety, increased slightly for Matrix feel
            }}
        />
    );
};

export default MatrixBackground;
