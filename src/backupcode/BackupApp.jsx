// src/App.jsx

import { useState, useEffect } from 'react';
import AuthForm from './AuthForm';
import './App.css';
import { auth, db } from './firebase'; // Import 'db'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Import Firestore functions

// Define your kiwi collection with access levels.
const KIWI_COLLECTION = [
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyuZjbvtxHYm8c4D-2MoOJrP5is2O5Zo0frg&s', alt: 'Cute kiwi bird 1', description: 'This is a kiwi', accessLevel: 'public' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/TeTuatahianui.jpg/960px-TeTuatahianui.jpg', alt: 'Cute kiwi bird 2', description: 'This kiwi also is a kiwi', accessLevel: 'member' },
    { src: 'https://thumbs.dreamstime.com/b/fluffy-kiwi-bird-chick-perched-tree-branch-surrounded-green-leaves-forest-adorable-brown-flightless-animal-natural-379963611.jpg', alt: 'Cute kiwi bird 3', description: 'Cute baby kiwi', accessLevel: 'member' },
    { src: 'https://www.pbs.org/wnet/nature/files/2015/11/636x460design_01-610x441.jpg', alt: 'Cute kiwi bird 4', description: 'This is the anatomy of a kiwi bird.', accessLevel: 'member' },
    { src: 'https://scx2.b-cdn.net/gfx/news/hires/2011/themalekiwic.jpg', alt: 'Cute kiwi bird 5', description: 'Albino Kiwi.', accessLevel: 'member' },
    { src: 'https://cdn.britannica.com/45/126445-050-4C0FA9F6.jpg', alt: 'Cute kiwi bird 6', description: 'This is just a kiwi fruit.', accessLevel: 'public' },
    { src: 'https://www.doc.govt.nz/thumbs/hero-square/public/kiwi-puku.png', alt: 'Kiwi Puku', description: 'Special kiwi for admins only.', accessLevel: 'admin' },
];

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null); // New state for user role
    const [isRegisterView, setIsRegisterView] = useState(false);
    const [theme, setTheme] = useState('light');
    const [currentView, setCurrentView] = useState('main'); // New state for navigation

    // Effect to listen for Firebase Auth state changes and get user role
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in. Now, get their role from Firestore.
                const userDocRef = doc(db, 'users', firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);

                // If the user document exists, set the role. Otherwise, default to 'member'.
                if (userDoc.exists()) {
                    setUserRole(userDoc.data().role);
                } else {
                    setUserRole('member'); // Default role for new users
                }

                setUser(firebaseUser);
                setIsLoggedIn(true);
            } else {
                // User is signed out
                setUser(null);
                setUserRole(null); // Clear the role on logout
                setIsLoggedIn(false);
                setIsRegisterView(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // Function to toggle theme
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    // Firebase Authentication functions
    const handleRegister = async (credentials) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
            // After successful registration, save the user's role to Firestore
            const userRef = doc(db, "users", userCredential.user.uid);
            await setDoc(userRef, { role: 'member' });
            alert('Registration successful! You are now logged in as a member.');
            setCurrentView('main'); // Add this line to redirect
        } catch (error) {
            console.error('Registration failed:', error.message);
            alert(`Registration failed: ${error.message}`);
        }
    };

    const handleLogin = async (credentials) => {
        try {
            await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
            // The onAuthStateChanged listener will handle state change,
            // but you can also set the view here for immediate feedback.
            setCurrentView('main'); // Add this line to redirect
        } catch (error) {
            console.error('Login failed:', error.message);
            alert(`Login failed: ${error.message}`);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert('You have been logged out.');
        } catch (error) {
            console.error('Logout failed:', error.message);
            alert(`Logout failed: ${error.message}`);
        }
    };

    // A helper function to filter kiwis based on the user's role
    const getFilteredKiwis = () => {
        if (!userRole) {
            return KIWI_COLLECTION.filter(kiwi => kiwi.accessLevel === 'public');
        } else if (userRole === 'admin') {
            return KIWI_COLLECTION; // Admin sees everything
        } else if (userRole === 'member') {
            return KIWI_COLLECTION.filter(kiwi => kiwi.accessLevel === 'public' || kiwi.accessLevel === 'member');
        }
        return []; // Fallback
    };

    // Main Content of kiwi pictures
    const mainContent = (
        <div className="logged-in-content-wrapper">
            <h2 className="welcome-title">Hooray! You're In!</h2>
            <p className="welcome-message">
                Now you can enjoy pictures of kiwis!
            </p>

            <div className="kiwi-grid-container">
                {getFilteredKiwis().map((kiwi, index) => (
                    <div key={index} className="kiwi-card">
                        <img
                            src={kiwi.src}
                            alt={kiwi.alt}
                            className="kiwi-image"
                        />
                        <p className="kiwi-description-text">{kiwi.description}</p>
                    </div>
                ))}
            </div>
            <p className="footer-message">Enjoy the view! Or perhaps, the *tweet*?</p>
        </div>
    );

    return (
        <div className={`app-layout-container ${theme}-theme`}>
            {/* Top Bar (Header) */}
            <header className="app-header">
                <div className="app-header-left">
                    <h1>KiwiHub</h1>
                </div>
                <nav className="app-header-right">
                    {/* Theme Toggle Button */}
                    <button className="nav-button theme-toggle-button" onClick={toggleTheme}>
                        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
                    </button>

                    {/* Home Button (No real routing yet, but conceptually here) */}
                    <button className="nav-button" onClick={() => setCurrentView('main')}>
                        Home
                    </button>

                    <button className="nav-button" onClick={() => setCurrentView('accmgmt')}>
                        Acc MGMT
                    </button>
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="app-main-content">
                {/* Left Section (Filters) */}
                <aside className="app-filters-sidebar">
                    <h3>Filters</h3>
                    <div style={{ padding: '15px', border: '1px dashed var(--border-dashed)', borderRadius: '5px', minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        Filter options will go here!
                    </div>
                </aside>

                {/* Right Section (Main Display - Kiwi Grid or AuthForm) */}
                <section className="app-main-display">
                    {currentView === 'accmgmt' ? (
                        // Render the account management content
                        <div>
                            {isLoggedIn ? (
                                <button className="nav-button" onClick={handleLogout}>Logout</button>
                            ) : (
                                <div>
                                    <AuthForm
                                        isRegister={isRegisterView}
                                        onSubmit={isRegisterView ? handleRegister : handleLogin}
                                    />
                                    <button
                                        onClick={() => setIsRegisterView(!isRegisterView)}
                                        style={{ marginTop: '10px', padding: '8px 15px', cursor: 'pointer', backgroundColor: 'var(--button-toggle-bg)', color: 'white' }}
                                    >
                                        {isRegisterView ? 'Switch to Login' : 'Switch to Register'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Render the main content (kiwi grid) for all other cases
                        mainContent
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;